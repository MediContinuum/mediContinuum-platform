package com.medicontinuum.backend.security;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Bounded per-instance token bucket. Use a gateway/WAF for distributed
 * volumetric DDoS protection and shared quotas across application replicas.
 */
@Component
@RequiredArgsConstructor
public class ApiRateLimitFilter extends OncePerRequestFilter {
    private static final Logger log = LoggerFactory.getLogger(ApiRateLimitFilter.class);
    private static final long CLEANUP_INTERVAL_MILLIS = 30_000L;

    private final MeterRegistry meterRegistry;
    private final java.time.Clock clock;
    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();
    private final AtomicLong lastCleanup = new AtomicLong();

    @Value("${app.security.rate-limit.enabled:true}")
    private boolean enabled;

    @Value("${app.security.rate-limit.burst:60}")
    private long burstCapacity;

    @Value("${app.security.rate-limit.refill-per-second:1}")
    private double refillPerSecond;

    @Value("${app.security.rate-limit.max-tracked-clients:50000}")
    private int maxTrackedClients;

    @Value("${app.security.rate-limit.idle-minutes:10}")
    private long idleMinutes;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return !enabled || !(path.startsWith("/api/") || path.startsWith("/oauth2/") || path.startsWith("/login/oauth2/"));
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        long now = clock.millis();
        cleanupIfNeeded(now);

        String key = clientKey(request);
        Bucket bucket = buckets.get(key);
        if (bucket == null) {
            if (buckets.size() >= Math.max(100, maxTrackedClients)) {
                reject(response);
                return;
            }
            Bucket candidate = new Bucket(Math.max(1, burstCapacity), now);
            Bucket previous = buckets.putIfAbsent(key, candidate);
            bucket = previous == null ? candidate : previous;
        }

        if (!bucket.tryConsume(now, Math.max(1, burstCapacity), Math.max(0.01, refillPerSecond))) {
            reject(response);
            log.warn("SECURITY_EVENT event=api_rate_limit_rejected client={} method={} path={}",
                safeClient(key), request.getMethod(), safePath(request.getRequestURI()));
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String clientKey(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && authentication.getName() != null
                && !authentication.getName().isBlank()
                && !"anonymousUser".equals(authentication.getName())) {
            return "user:" + authentication.getName().toLowerCase(java.util.Locale.ROOT);
        }
        // Do not trust a client-supplied X-Forwarded-For header. Configure trusted
        // reverse-proxy address resolution at the connector/edge if needed.
        String remoteAddress = request.getRemoteAddr();
        return "ip:" + (remoteAddress == null ? "unknown" : remoteAddress);
    }

    private void cleanupIfNeeded(long now) {
        long previous = lastCleanup.get();
        if (now - previous < CLEANUP_INTERVAL_MILLIS || !lastCleanup.compareAndSet(previous, now)) return;
        long cutoff = now - Math.max(1, idleMinutes) * 60_000L;
        for (Map.Entry<String, Bucket> entry : buckets.entrySet()) {
            if (entry.getValue().lastTouchedMillis() < cutoff) {
                buckets.remove(entry.getKey(), entry.getValue());
            }
        }
    }

    private void reject(HttpServletResponse response) throws IOException {
        meterRegistry.counter("medicontinuum.security.rejections", "reason", "rate_limit").increment();
        response.setStatus(429);
        response.setHeader("Retry-After", "1");
        response.setHeader("Cache-Control", "no-store");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"success\":false,\"message\":\"Request rate limit exceeded. Please retry shortly.\"}");
    }

    private String safeClient(String key) {
        return key.startsWith("user:") ? "authenticated" : "network-client";
    }

    private String safePath(String path) {
        return path.replaceAll("/[0-9a-fA-F-]{36}(?=/|$)", "/{id}")
            .replaceAll("/[0-9]+(?=/|$)", "/{id}");
    }

    private static final class Bucket {
        private double tokens;
        private long lastRefillMillis;
        private long lastTouchedMillis;

        private Bucket(long capacity, long now) {
            tokens = capacity;
            lastRefillMillis = now;
            lastTouchedMillis = now;
        }

        synchronized boolean tryConsume(long now, long capacity, double refillPerSecond) {
            long elapsed = Math.max(0, now - lastRefillMillis);
            tokens = Math.min(capacity, tokens + elapsed * refillPerSecond / 1000.0);
            lastRefillMillis = now;
            lastTouchedMillis = now;
            if (tokens < 1.0) return false;
            tokens -= 1.0;
            return true;
        }

        synchronized long lastTouchedMillis() { return lastTouchedMillis; }
    }
}
