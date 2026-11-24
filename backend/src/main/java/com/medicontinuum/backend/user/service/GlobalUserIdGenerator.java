package com.medicontinuum.user.service;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class GlobalUserIdGenerator {

    private static final SecureRandom RANDOM = new SecureRandom();

    public String generate() {

        StringBuilder id = new StringBuilder(16);

        // First digit must be 1-9.
        id.append(RANDOM.nextInt(9) + 1);

        // Remaining 15 digits can be 0-9.
        for (int i = 1; i < 16; i++) {
            id.append(RANDOM.nextInt(10));
        }

        return id.toString();
    }
}