package com.medicontinuum.backend.auth.service.impl;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Set;

import com.medicontinuum.backend.auth.dto.AuthRequests;
import com.medicontinuum.backend.auth.dto.AuthResponse;
import com.medicontinuum.backend.auth.entity.RefreshToken;
import com.medicontinuum.backend.auth.repository.RefreshTokenRepository;
import com.medicontinuum.backend.auth.service.AuthService;
import com.medicontinuum.backend.patient.entity.Patient;
import com.medicontinuum.backend.patient.repository.PatientRepository;
import com.medicontinuum.backend.security.JwtService;
import com.medicontinuum.backend.user.dto.CreateUserRequest;
import com.medicontinuum.backend.user.dto.UserResponse;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.enums.UserRole;
import com.medicontinuum.backend.user.enums.UserStatus;
import com.medicontinuum.backend.user.repository.UserRepository;
import com.medicontinuum.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {
    private static final SecureRandom RANDOM = new SecureRandom();

    private final UserService userService;
    private final UserRepository users;
    private final PatientRepository patients;
    private final RefreshTokenRepository refreshTokens;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${app.security.refresh-expiration-days:30}")
    private long refreshLifetimeDays;

    @Value("${app.time-zone:Asia/Kolkata}")
    private String appTimeZone;

    @Override
    public AuthResponse registerPatient(AuthRequests.Register request) {
        String email = normalizeEmail(request.email());
        if (users.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
        validatePassword(request.password());

        String fullName = (request.firstName().trim() + " " + request.lastName().trim()).trim();
        UserResponse created = userService.createUser(
            new CreateUserRequest(
                fullName,
                email,
                clean(request.phoneNumber()),
                Set.of(UserRole.PATIENT)
            ),
            passwordEncoder.encode(request.password())
        );

        User user = users.findById(created.id())
            .orElseThrow(() -> new IllegalStateException("Newly created user could not be loaded"));
        Patient patient = new Patient();
        patient.setUser(user);
        patients.save(patient);

        return tokenResponse(user, created);
    }

    @Override
    public AuthResponse login(AuthRequests.Login request) {
        User user = users.findByEmailIgnoreCase(normalizeEmail(request.email()))
            .filter(candidate -> candidate.getStatus() == UserStatus.ACTIVE)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        // Refresh token is stored only as a SHA-256 hash.
        return tokenResponse(user, userResponse(user));
    }

    @Override
    public AuthResponse refresh(AuthRequests.Refresh request) {
        String hash = hashToken(request.refreshToken());
        RefreshToken record = refreshTokens.findByTokenHash(hash)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token is invalid"));

        if (record.getRevokedAt() != null) {
            // Reuse of an already-rotated token indicates possible theft.
            refreshTokens.revokeAllActiveForUser(record.getUser().getId(), now());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token reuse detected; sign in again");
        }
        if (!record.getExpiresAt().isAfter(now()) || record.getUser().getStatus() != UserStatus.ACTIVE) {
            record.setRevokedAt(now());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token has expired or its account is inactive");
        }

        record.setRevokedAt(now());
        return tokenResponse(record.getUser(), userResponse(record.getUser()));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse me(String email) {
        return userResponse(activeUser(email));
    }

    @Override
    public void logout(String email, AuthRequests.Logout request) {
        User user = activeUser(email);
        if (request != null && request.refreshToken() != null && !request.refreshToken().isBlank()) {
            refreshTokens.findByTokenHash(hashToken(request.refreshToken()))
                .filter(token -> token.getUser().getId().equals(user.getId()))
                .ifPresent(token -> token.setRevokedAt(now()));
        }
        // The token version invalidates all outstanding access tokens for this user.
        user.setTokenVersion(user.getTokenVersion() + 1);
        users.save(user);
        refreshTokens.revokeAllActiveForUser(user.getId(), now());
    }

    @Override
    public void changePassword(String email, AuthRequests.ChangePassword request) {
        User user = activeUser(email);
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }
        validatePassword(request.newPassword());
        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password must be different");
        }
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setTokenVersion(user.getTokenVersion() + 1);
        users.save(user);
        refreshTokens.revokeAllActiveForUser(user.getId(), now());
    }

    private AuthResponse tokenResponse(User user, UserResponse response) {
        String accessToken = jwtService.issueToken(user.getEmail(), user.getTokenVersion());
        String refreshToken = createRefreshToken(user);
        return new AuthResponse(accessToken, refreshToken, "Bearer", jwtService.expiresInSeconds(), response);
    }

    private String createRefreshToken(User user) {
        byte[] bytes = new byte[48];
        RANDOM.nextBytes(bytes);
        String raw = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setTokenHash(hashToken(raw));
        token.setExpiresAt(now().plusDays(Math.max(1, refreshLifetimeDays)));
        refreshTokens.save(token);
        return raw;
    }

    private UserResponse userResponse(User user) {
        return new UserResponse(
            user.getId(), user.getGlobalUserId(), user.getFullName(), user.getEmail(),
            user.getPhoneNumber(), Set.copyOf(user.getRoles()), user.getStatus(),
            user.getCreatedAt(), user.getUpdatedAt()
        );
    }

    private User activeUser(String email) {
        return users.findByEmailIgnoreCase(normalizeEmail(email))
            .filter(user -> user.getStatus() == UserStatus.ACTIVE)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated user is unavailable"));
    }

    private void validatePassword(String password) {
        int length = password == null ? 0 : password.getBytes(StandardCharsets.UTF_8).length;
        if (length < 10 || length > 72) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be 10 to 72 UTF-8 bytes");
        }
    }

    private String normalizeEmail(String value) {
        if (value == null || value.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        return value.trim().toLowerCase(Locale.ROOT);
    }

    private String clean(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private LocalDateTime now() {
        return LocalDateTime.now(ZoneId.of(appTimeZone));
    }

    private String hashToken(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to hash refresh token", ex);
        }
    }
}
