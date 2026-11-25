package com.medicontinuum.backend.config;

import java.time.Clock;
import java.time.ZoneId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Shared application clock for services and deterministic tests. */
@Configuration
public class ApplicationTimeConfig {
    @Bean
    Clock applicationClock(@Value("${app.time-zone:Asia/Kolkata}") String zone) {
        return Clock.system(ZoneId.of(zone));
    }
}
