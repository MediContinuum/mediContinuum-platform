package com.medicontinuum.backend.security;

import java.io.IOException;
import java.util.Arrays;
import java.util.Locale;
import java.util.Set;

import io.micrometer.core.instrument.MeterRegistry;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Enforces REST request shape and response browser-security headers.
 * Executable MIME types are rejected; JSON text is never executed as a script.
 */
@Component
@RequiredArgsConstructor
public class ApiRequestGuardFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(ApiRequestGuardFilter.class);
    private static final Set<String> BODY_METHODS = Set.of("POST", "PUT", "PATCH");
    private static final Set<String> ALLOWED_METHODS = Set.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");

    private final MeterRegistry meterRegistry;

    @Value("${app.security.request-guard.max-body-bytes:1048576}")
    private long maxBodyBytes;

    @Value("${app.security.request-guard.max-query-length:4096}")
    private int maxQueryLength;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/api/");
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        applySecurityHeaders(response);

        if (!ALLOWED_METHODS.contains(request.getMethod().toUpperCase(Locale.ROOT))) {
            reject(response, 405, "method");
            return;
        }

        String path = request.getRequestURI();
        String lowerPath = path.toLowerCase(Locale.ROOT);
        if (lowerPath.contains("%2e") || lowerPath.contains("%00")
                || lowerPath.contains("%252e") || lowerPath.contains("\\")
                || Arrays.asList(path.split("/")).contains("..")) {
            reject(response, 400, "path");
            return;
        }

        String query = request.getQueryString();
        if (query != null && query.length() > Math.max(128, maxQueryLength)) {
            reject(response, 414, "query_size");
            return;
        }

        long contentLength = request.getContentLengthLong();
        if (contentLength > Math.max(1024, maxBodyBytes)) {
            reject(response, 413, "body_size");
            return;
        }

        boolean hasBody = contentLength != 0 || request.getHeader("Transfer-Encoding") != null;
        if (BODY_METHODS.contains(request.getMethod().toUpperCase(Locale.ROOT)) && hasBody) {
            String contentType = request.getContentType();
            if (contentType == null || !isJson(contentType)) {
                reject(response, 415, "content_type");
                return;
            }
        }

        try {
            filterChain.doFilter(new LimitedBodyRequestWrapper(request, maxBodyBytes), response);
        } catch (IOException exception) {
            if (causedByBodyLimit(exception) && !response.isCommitted()) {
                reject(response, 413, "body_size");
                return;
            }
            throw exception;
        } catch (ServletException exception) {
            if (causedByBodyLimit(exception) && !response.isCommitted()) {
                reject(response, 413, "body_size");
                return;
            }
            throw exception;
        } catch (RuntimeException exception) {
            if (causedByBodyLimit(exception) && !response.isCommitted()) {
                reject(response, 413, "body_size");
                return;
            }
            throw exception;
        }
    }

    private boolean causedByBodyLimit(Throwable throwable) {
        Throwable current = throwable;
        while (current != null) {
            if (current instanceof RequestBodyLimitExceededException) return true;
            current = current.getCause();
        }
        return false;
    }

    private boolean isJson(String value) {
        String mediaType = value.split(";", 2)[0].trim().toLowerCase(Locale.ROOT);
        return MediaType.APPLICATION_JSON_VALUE.equals(mediaType)
            || (mediaType.startsWith("application/") && mediaType.endsWith("+json"));
    }

    private void applySecurityHeaders(HttpServletResponse response) {
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("Referrer-Policy", "no-referrer");
        response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
        response.setHeader("Content-Security-Policy",
            "default-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
        response.setHeader("Cache-Control", "no-store");
    }

    private void reject(HttpServletResponse response, int status, String reason) throws IOException {
        meterRegistry.counter("medicontinuum.security.rejections", "reason", reason).increment();
        log.warn("SECURITY_EVENT event=api_request_rejected reason={}", reason);
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setHeader("Cache-Control", "no-store");
        response.getWriter().write("{\"success\":false,\"message\":\"Request rejected by API security policy.\"}");
    }
}
