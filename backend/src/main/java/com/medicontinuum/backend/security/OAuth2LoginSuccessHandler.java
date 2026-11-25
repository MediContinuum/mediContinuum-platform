package com.medicontinuum.backend.security;

import java.io.IOException;

import com.medicontinuum.backend.auth.dto.OAuth2Identity;
import com.medicontinuum.backend.auth.service.OAuth2LoginService;
import tools.jackson.databind.ObjectMapper;
import io.micrometer.core.instrument.MeterRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    private static final Logger log = LoggerFactory.getLogger(OAuth2LoginSuccessHandler.class);

    private final OAuth2LoginService oauth2LoginService;
    private final ObjectMapper objectMapper;
    private final MeterRegistry meterRegistry;

    @Override
    public void onAuthenticationSuccess(
        HttpServletRequest request,
        HttpServletResponse response,
        Authentication authentication
    ) throws IOException, ServletException {
        if (!(authentication instanceof OAuth2AuthenticationToken token)
                || !(token.getPrincipal() instanceof OidcUser oidcUser)) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "OIDC authentication was not returned by the provider");
            return;
        }

        Object verifiedClaim = oidcUser.getClaim("email_verified");
        boolean emailVerified = Boolean.TRUE.equals(verifiedClaim)
            || "true".equalsIgnoreCase(String.valueOf(verifiedClaim));

        OAuth2Identity identity = new OAuth2Identity(
            token.getAuthorizedClientRegistrationId(),
            oidcUser.getSubject(),
            oidcUser.getClaimAsString("email"),
            oidcUser.getClaimAsString("name"),
            emailVerified
        );

        try {
            var result = oauth2LoginService.loginOrLink(identity);
            meterRegistry.counter("medicontinuum.security.oauth2.logins", "provider", "google", "result", "success").increment();
            log.info("SECURITY_EVENT event=oauth2_login_success provider=google");
            response.setStatus(HttpServletResponse.SC_OK);
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json");
            response.setHeader("Cache-Control", "no-store");
            response.setHeader("Pragma", "no-cache");
            response.setHeader("X-Content-Type-Options", "nosniff");
            objectMapper.writeValue(response.getOutputStream(), result);
        } catch (ResponseStatusException exception) {
            meterRegistry.counter("medicontinuum.security.oauth2.logins", "provider", "google", "result", "rejected").increment();
            response.setStatus(exception.getStatusCode().value());
            response.setCharacterEncoding("UTF-8");
            response.setContentType("application/json");
            response.setHeader("Cache-Control", "no-store");
            response.getWriter().write("{\"success\":false,\"message\":\"Google account sign-in was rejected.\"}");
        }
    }
}
