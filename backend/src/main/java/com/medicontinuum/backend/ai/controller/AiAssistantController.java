package com.medicontinuum.backend.ai.controller;

import java.util.Map;

import com.medicontinuum.backend.ai.dto.ChatRequest;
import com.medicontinuum.backend.ai.dto.ChatResponse;
import com.medicontinuum.backend.ai.service.GeminiAssistantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiAssistantController {
    private final GeminiAssistantService assistantService;

    @GetMapping("/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> status() {
        boolean configured = assistantService.isConfigured();
        return ResponseEntity.status(configured ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE)
            .body(Map.of(
                "configured", configured,
                "provider", "Google Gemini",
                "model", assistantService.configuredModel(),
                "status", configured ? "READY" : "NOT_CONFIGURED",
                "message", configured ? "Gemini API key is configured on the backend." :
                    "Set GEMINI_API_KEY on the backend and restart Spring Boot."
            ));
    }

    @PostMapping("/chat")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        return ResponseEntity.ok(assistantService.ask(request));
    }
}
