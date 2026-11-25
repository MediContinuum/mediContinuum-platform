package com.medicontinuum.backend.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    private static final String ALGORITHM = "HmacSHA256";
    private static final String ISSUER = "medicontinuum";
    private final ObjectMapper objectMapper;
    private final String secret;
    private final long lifetimeSeconds;

    public JwtService(
        ObjectMapper objectMapper,
        @Value("${app.security.jwt-secret:}") String secret,
        @Value("${app.security.jwt-expiration-minutes:30}") long lifetimeMinutes
    ) {
        this.objectMapper = objectMapper;
        this.secret = secret == null ? "" : secret.trim();
        this.lifetimeSeconds = Math.multiplyExact(Math.max(1, lifetimeMinutes), 60);
    }

    public String issueToken(String email, int tokenVersion) {
        Instant now = Instant.now();
        long expiresAt = now.plusSeconds(lifetimeSeconds).getEpochSecond();
        try {
            Map<String, Object> header = Map.of("alg", "HS256", "typ", "JWT");
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("iss", ISSUER);
            payload.put("sub", email);
            payload.put("ver", tokenVersion);
            payload.put("iat", now.getEpochSecond());
            payload.put("exp", expiresAt);
            payload.put("jti", UUID.randomUUID().toString());

            String encodedHeader = encode(objectMapper.writeValueAsBytes(header));
            String encodedPayload = encode(objectMapper.writeValueAsBytes(payload));
            String signingInput = encodedHeader + "." + encodedPayload;
            return signingInput + "." + encode(sign(signingInput));
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to create access token", ex);
        }
    }

    public JwtClaims validate(String token) {
        try {
            if (token == null || token.length() > 8192) return null;
            String[] parts = token.split("\\.", -1);
            if (parts.length != 3) return null;

            JsonNode header = objectMapper.readTree(Base64.getUrlDecoder().decode(parts[0]));
            if (!"HS256".equals(header.path("alg").asText()) || !"JWT".equals(header.path("typ").asText())) return null;

            String signingInput = parts[0] + "." + parts[1];
            byte[] suppliedSignature = Base64.getUrlDecoder().decode(parts[2]);
            byte[] expectedSignature = sign(signingInput);
            if (!MessageDigest.isEqual(expectedSignature, suppliedSignature)) return null;

            JsonNode payload = objectMapper.readTree(Base64.getUrlDecoder().decode(parts[1]));
            String issuer = payload.path("iss").asText();
            String subject = payload.path("sub").asText();
            long expiresAt = payload.path("exp").asLong(0);
            long issuedAt = payload.path("iat").asLong(0);
            int tokenVersion = payload.path("ver").asInt(-1);
            long now = Instant.now().getEpochSecond();

            if (!ISSUER.equals(issuer) || subject.isBlank() || tokenVersion < 0
                    || expiresAt <= now || issuedAt <= 0 || issuedAt > now + 60
                    || expiresAt <= issuedAt || expiresAt - issuedAt > lifetimeSeconds + 60) {
                return null;
            }
            return new JwtClaims(subject, tokenVersion, expiresAt);
        } catch (Exception ex) {
            return null;
        }
    }

    public long expiresInSeconds() {
        return lifetimeSeconds;
    }

    private byte[] sign(String value) throws Exception {
        if (secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException(
                "JWT secret is missing or too short. Configure APP_JWT_SECRET with at least 32 UTF-8 bytes."
            );
        }
        Mac mac = Mac.getInstance(ALGORITHM);
        mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), ALGORITHM));
        return mac.doFinal(value.getBytes(StandardCharsets.UTF_8));
    }

    private String encode(byte[] bytes) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
