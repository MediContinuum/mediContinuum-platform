package com.medicontinuum.backend.security;

import java.io.IOException;
import java.util.List;
import io.micrometer.core.instrument.MeterRegistry;

import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.enums.UserStatus;
import com.medicontinuum.backend.user.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final MeterRegistry meterRegistry;

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")
                && SecurityContextHolder.getContext().getAuthentication() == null) {
            JwtClaims claims = jwtService.validate(header.substring(7).trim());
            if (claims != null) {
                userRepository.findByEmailIgnoreCase(claims.subject())
                    .filter(user -> user.getStatus() == UserStatus.ACTIVE)
                    .filter(user -> user.getTokenVersion() == claims.tokenVersion())
                    .ifPresent(this::authenticate);
            } else {
                meterRegistry.counter("medicontinuum.security.rejections", "reason", "invalid_bearer_token").increment();
            }
        }
        filterChain.doFilter(request, response);
    }

    private void authenticate(User user) {
        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
            .map(role -> new SimpleGrantedAuthority(role.name()))
            .toList();
        var authentication = new UsernamePasswordAuthenticationToken(
            user.getEmail(), null, authorities
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
