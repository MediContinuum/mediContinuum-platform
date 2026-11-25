package com.medicontinuum.backend.common.exception;

import java.time.Instant;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import com.medicontinuum.backend.security.RequestBodyLimitExceededException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler(ResponseStatusException.class)
    ResponseEntity<Map<String, Object>> handleStatus(ResponseStatusException ex) {
        return response(ex.getStatusCode(), ex.getReason() == null ? "Request failed" : ex.getReason());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return response(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .distinct()
            .collect(Collectors.joining("; "));
        return response(HttpStatus.BAD_REQUEST, message.isBlank() ? "Validation failed" : message);
    }


    @ExceptionHandler(HttpMessageNotReadableException.class)
    ResponseEntity<Map<String, Object>> handleUnreadable(HttpMessageNotReadableException ex) {
        Throwable cause = ex;
        while (cause != null) {
            if (cause instanceof RequestBodyLimitExceededException) {
                return response(HttpStatus.PAYLOAD_TOO_LARGE, "Request body exceeds the configured size limit");
            }
            cause = cause.getCause();
        }
        return response(HttpStatus.BAD_REQUEST, "Request body is malformed or contains invalid values");
    }

    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<Map<String, Object>> handleForbidden(AccessDeniedException ex) {
        return response(HttpStatus.FORBIDDEN, "You do not have permission to perform this action");
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<Map<String, Object>> handleIntegrity(DataIntegrityViolationException ex) {
        return response(HttpStatus.CONFLICT, "The request conflicts with an existing record");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        return response(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    private ResponseEntity<Map<String, Object>> response(org.springframework.http.HttpStatusCode status, String message) {
        return ResponseEntity.status(status).body(Map.of(
            "success", false,
            "status", status.value(),
            "message", message,
            "timestamp", Instant.now().toString()
        ));
    }
}
