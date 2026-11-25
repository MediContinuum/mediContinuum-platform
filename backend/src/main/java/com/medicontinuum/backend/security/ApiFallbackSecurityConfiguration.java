package com.medicontinuum.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/** Deny all non-API and non-OAuth routes unless a future feature explicitly permits them. */
@Configuration
public class ApiFallbackSecurityConfiguration {
    @Bean
    @Order(3)
    SecurityFilterChain denyUnmappedRoutes(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth.anyRequest().denyAll())
            .csrf(csrf -> csrf.disable())
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .build();
    }
}
