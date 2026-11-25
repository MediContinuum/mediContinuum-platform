package com.medicontinuum.backend.health;

import java.io.IOException;
import java.util.UUID;
import java.util.regex.Pattern;

import io.micrometer.core.instrument.MeterRegistry;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** Correlation IDs and low-cardinality API request metrics; no request bodies or query strings are logged. */
@Component
@RequiredArgsConstructor
public class RequestTelemetryFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(RequestTelemetryFilter.class);
    private static final Pattern SAFE_ID = Pattern.compile("[A-Za-z0-9._-]{1,64}");
    private static final Pattern UUID_PATH = Pattern.compile("/[0-9a-fA-F-]{36}(?=/|$)");

    private final MeterRegistry meterRegistry;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/api/");
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain
    ) throws ServletException, IOException {
        String supplied = request.getHeader("X-Request-ID");
        String requestId = supplied != null && SAFE_ID.matcher(supplied).matches()
            ? supplied : UUID.randomUUID().toString();

        MDC.put("requestId", requestId);
        response.setHeader("X-Request-ID", requestId);
        long started = System.nanoTime();
        int status = 500;
        try {
            chain.doFilter(request, response);
            status = response.getStatus();
        } finally {
            long elapsed = Math.max(0, System.nanoTime() - started);
            String method = request.getMethod();
            String statusTag = String.valueOf(status);
            meterRegistry.counter("medicontinuum.http.requests", "method", method, "status", statusTag).increment();
            meterRegistry.timer("medicontinuum.http.request.duration", "method", method, "status", statusTag)
                .record(elapsed, java.util.concurrent.TimeUnit.NANOSECONDS);
            log.info("API request completed method={} path={} status={} durationMs={}",
                method, safePath(request.getRequestURI()), status,
                java.util.concurrent.TimeUnit.NANOSECONDS.toMillis(elapsed));
            MDC.remove("requestId");
        }
    }

    private String safePath(String path) {
        return UUID_PATH.matcher(path).replaceAll("/{id}")
            .replaceAll("/[0-9]+(?=/|$)", "/{id}");
    }
}
