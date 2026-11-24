package com.medicontinuum.backend.user.dto;

import java.util.Set;

import com.medicontinuum.backend.user.enums.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(

        @NotBlank
        @Size(max = 100)
        String fullName,

        @NotBlank
        @Email
        @Size(max = 150)
        String email,

        @Size(max = 20)
        String phoneNumber,

        @NotEmpty(message = "At least one role is required")
        Set<UserRole> roles

) {
}