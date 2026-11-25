package com.medicontinuum.backend.auth.controller;

import com.medicontinuum.backend.auth.dto.AuthRequests;
import com.medicontinuum.backend.auth.dto.AuthResponse;
import com.medicontinuum.backend.auth.service.AuthService;
import com.medicontinuum.backend.user.dto.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody AuthRequests.Register request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.registerPatient(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequests.Login request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody AuthRequests.Refresh request) {
        return ResponseEntity.ok(authService.refresh(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) {
        return ResponseEntity.ok(authService.me(authentication.getName()));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(Authentication authentication,@RequestBody(required=false) AuthRequests.Logout request) {
        authService.logout(authentication.getName(),request);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(Authentication authentication,@Valid @RequestBody AuthRequests.ChangePassword request) {
        authService.changePassword(authentication.getName(),request);
        return ResponseEntity.noContent().build();
    }
}
