package com.medicontinuum.backend.ai.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChatRequest(
    @NotBlank @Size(max = 1600) String message,
    @Size(max = 8) List<@Valid ChatTurn> history,
    @Size(max = 12000) String context
) {
    public record ChatTurn(
        @NotBlank @Pattern(regexp = "USER|ASSISTANT") String role,
        @NotBlank @Size(max = 1200) String text
    ) {}
}
