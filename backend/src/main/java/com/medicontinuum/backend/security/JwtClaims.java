package com.medicontinuum.backend.security;

public record JwtClaims(String subject, int tokenVersion, long expiresAtEpochSecond) {}
