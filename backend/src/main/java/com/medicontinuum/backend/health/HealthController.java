package com.medicontinuum.backend.health;

import java.time.Instant;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
public class HealthController {
    private final JdbcTemplate jdbcTemplate;

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
}
