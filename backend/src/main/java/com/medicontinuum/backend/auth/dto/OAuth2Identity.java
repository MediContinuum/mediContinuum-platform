package com.medicontinuum.backend.auth.dto;

/** Verified identity returned by an external OpenID Connect provider. */
public record OAuth2Identity(
    String provider,
    String subject,
    String email,
    String fullName,
    boolean emailVerified
) {}
