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

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.medicontinuum.backend.auth.dto.AuthResponse;
import com.medicontinuum.backend.auth.dto.OAuth2Identity;
import com.medicontinuum.backend.auth.entity.OAuth2Account;
import com.medicontinuum.backend.auth.entity.RefreshToken;
import com.medicontinuum.backend.auth.repository.OAuth2AccountRepository;
import com.medicontinuum.backend.auth.repository.RefreshTokenRepository;
import com.medicontinuum.backend.auth.service.OAuth2LoginService;
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

@Service
@RequiredArgsConstructor
@Transactional
public class OAuth2LoginServiceImpl implements OAuth2LoginService {
    private static final SecureRandom RANDOM = new SecureRandom();

    private final OAuth2AccountRepository oauthAccounts;
    private final UserRepository users;
    private final UserService userService;
    private final PatientRepository patients;
    private final RefreshTokenRepository refreshTokens;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${app.security.refresh-expiration-days:30}")
    private long refreshLifetimeDays;

    @Value("${app.time-zone:Asia/Kolkata}")
    private String appTimeZone;

    @Override
    public AuthResponse loginOrLink(OAuth2Identity identity) {
        if (identity == null || !"google".equalsIgnoreCase(identity.provider())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported OAuth2 provider");
        }
        if (!identity.emailVerified()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google must verify the email address before account linking");
        }
        String subject = required(identity.subject(), "Google subject");
        String email = normalizeEmail(identity.email());

        OAuth2Account linked = oauthAccounts.findByProviderAndProviderSubject("google", subject).orElse(null);
        User user;
        if (linked != null) {
            user = linked.getUser();
            if (user.getStatus() != UserStatus.ACTIVE) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This account is not active");
            }
            if (!user.getEmail().equalsIgnoreCase(email)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "The Google account email has changed; contact support to relink it");
            }
        } else {
            user = users.findByEmailIgnoreCase(email).orElse(null);
            if (user == null) {
                String name = identity.fullName() == null || identity.fullName().isBlank()
                    ? email.substring(0, email.indexOf('@'))
                    : identity.fullName().trim();
                UserResponse created = userService.createUser(
                    new CreateUserRequest(name, email, null, Set.of(UserRole.PATIENT)),
                    passwordEncoder.encode(randomPassword())
                );
                user = users.findById(created.id())
                    .orElseThrow(() -> new IllegalStateException("OAuth2 account was created but could not be loaded"));
                Patient patient = new Patient();
                patient.setUser(user);
                patients.save(patient);
            } else if (user.getStatus() != UserStatus.ACTIVE) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This account is not active");
            }

            if (oauthAccounts.existsByProviderAndUser_Id("google", user.getId())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Another Google account is already linked to this user");
            }

            OAuth2Account account = new OAuth2Account();
            account.setProvider("google");
            account.setProviderSubject(subject);
            account.setUser(user);
            account.setEmail(email);
            oauthAccounts.save(account);
        }

        return issueTokens(user);
    }

    private AuthResponse issueTokens(User user) {
        String accessToken = jwtService.issueToken(user.getEmail(), user.getTokenVersion());
        byte[] random = new byte[48];
        RANDOM.nextBytes(random);
        String rawRefreshToken = Base64.getUrlEncoder().withoutPadding().encodeToString(random);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenHash(hash(rawRefreshToken));
        refreshToken.setExpiresAt(now().plusDays(Math.max(1, refreshLifetimeDays)));
        refreshTokens.save(refreshToken);

        UserResponse response = new UserResponse(
            user.getId(), user.getGlobalUserId(), user.getFullName(), user.getEmail(),
            user.getPhoneNumber(), Set.copyOf(user.getRoles()), user.getStatus(),
            user.getCreatedAt(), user.getUpdatedAt()
        );
        return new AuthResponse(accessToken, rawRefreshToken, "Bearer", jwtService.expiresInSeconds(), response);
    }

    private String randomPassword() {
        byte[] value = new byte[64];
        RANDOM.nextBytes(value);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(value);
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google did not return an email address");
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String required(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google did not return a valid " + field);
        }
        return value.trim();
    }

    private String hash(String token) {
        try {
            return HexFormat.of().formatHex(
                MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8))
            );
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to hash refresh token", ex);
        }
    }

    private LocalDateTime now() {
        return LocalDateTime.now(ZoneId.of(appTimeZone));
    }
}
