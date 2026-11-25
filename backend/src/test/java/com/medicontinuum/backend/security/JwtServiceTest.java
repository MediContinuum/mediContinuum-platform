package com.medicontinuum.backend.security;

import static org.junit.jupiter.api.Assertions.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

class JwtServiceTest {
    private static final String SECRET = "unit-test-secret-with-more-than-32-bytes-123456";

    @Test
    void issuedTokenValidatesAndPreservesTokenVersion() {
        JwtService service = new JwtService(new ObjectMapper(), SECRET, 30);
        String token = service.issueToken("patient@example.org", 7);

        JwtClaims claims = service.validate(token);

        assertNotNull(claims);
        assertEquals("patient@example.org", claims.subject());
        assertEquals(7, claims.tokenVersion());
        assertTrue(claims.expiresAtEpochSecond() > System.currentTimeMillis() / 1000);
    }

    @Test
    void modifiedPayloadIsRejected() {
        JwtService service = new JwtService(new ObjectMapper(), SECRET, 30);
        String token = service.issueToken("patient@example.org", 0);
        String[] parts = token.split("\\.", -1);
        parts[1] = parts[1].substring(0, parts[1].length() - 1) + (parts[1].endsWith("A") ? "B" : "A");

        assertNull(service.validate(String.join(".", parts)));
    }

    @Test
    void malformedTokensAreRejected() {
        JwtService service = new JwtService(new ObjectMapper(), SECRET, 30);
        assertNull(service.validate("not-a-jwt"));
        assertNull(service.validate(null));
    }

    @Test
    void signingFailsWithoutAConfiguredSecret() {
        JwtService service = new JwtService(new ObjectMapper(), "", 30);
        assertThrows(IllegalStateException.class,
            () -> service.issueToken("patient@example.org", 0));
    }
}
