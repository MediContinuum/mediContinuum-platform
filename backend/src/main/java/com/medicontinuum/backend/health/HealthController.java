package com.medicontinuum.backend.health;

import java.time.Instant;
import java.util.Map;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {
    private final JdbcTemplate jdbcTemplate;
    private final MeterRegistry meterRegistry;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        boolean databaseUp;
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            databaseUp = Integer.valueOf(1).equals(result);
        } catch (Exception exception) {
            databaseUp = false;
        }

        Map<String, Object> body = Map.of(
            "status", databaseUp ? "UP" : "DEGRADED",
            "service", "medicontinuum-backend",
            "database", databaseUp ? "UP" : "DOWN",
            "timestamp", Instant.now().toString()
        );
        return ResponseEntity.status(databaseUp ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE).body(body);
    }

    /** Aggregate security and request counters; restricted to platform admins. */
    @GetMapping("/security")
    @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public Map<String, Object> securityMetrics() {
        return Map.of(
            "rateLimitRejections", sumCounter("medicontinuum.security.rejections", "reason", "rate_limit"),
            "requestGuardRejections", sumReasons("method", "path", "query_size", "body_size", "content_type"),
            "invalidBearerTokens", sumCounter("medicontinuum.security.rejections", "reason", "invalid_bearer_token"),
            "apiRequests", sumCounter("medicontinuum.http.requests"),
            "capturedAt", Instant.now().toString()
        );
    }

    private double sumCounter(String name) {
        return meterRegistry.getMeters().stream()
            .filter(meter -> name.equals(meter.getId().getName()))
            .filter(meter -> meter instanceof Counter)
            .mapToDouble(meter -> ((Counter) meter).count())
            .sum();
    }

    private double sumReasons(String... reasons) {
        double total = 0;
        for (String reason : reasons) {
            total += sumCounter("medicontinuum.security.rejections", "reason", reason);
        }
        return total;
    }

    private double sumCounter(String name, String key, String value) {
        return meterRegistry.getMeters().stream()
            .filter(meter -> name.equals(meter.getId().getName()))
            .filter(meter -> value.equals(meter.getId().getTag(key)))
            .filter(meter -> meter instanceof Counter)
            .mapToDouble(meter -> ((Counter) meter).count())
            .sum();
    }
}
