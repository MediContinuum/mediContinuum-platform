package com.medicontinuum.backend.auth.dto;

import com.medicontinuum.backend.user.dto.UserResponse;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    String tokenType,
    long expiresIn,
    UserResponse user
) {}
