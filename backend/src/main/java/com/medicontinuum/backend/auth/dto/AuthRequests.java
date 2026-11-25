package com.medicontinuum.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthRequests {
    private AuthRequests() {}

    public record Register(
        @NotBlank @Size(max = 60) String firstName,
        @NotBlank @Size(max = 60) String lastName,
        @NotBlank @Email @Size(max = 150) String email,
        @NotBlank @Size(min = 10, max = 72) String password,
        @Size(max = 20) String phoneNumber
    ) {}

    public record Login(
        @NotBlank @Email String email,
        @NotBlank String password
    ) {}

    public record Refresh(
        @NotBlank @Size(max = 128) String refreshToken
    ) {}

    public record Logout(
        @Size(max = 128) String refreshToken
    ) {}

    public record ChangePassword(
        @NotBlank String currentPassword,
        @NotBlank @Size(min = 10, max = 72) String newPassword
    ) {}
}
