package com.medicontinuum.backend.notification.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.medicontinuum.backend.notification.dto.NotificationPageResponse;
import com.medicontinuum.backend.notification.dto.NotificationResponse;
import com.medicontinuum.backend.notification.dto.NotificationSummaryResponse;
import com.medicontinuum.backend.notification.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // ---------------------------------------------------------
    // 1. Get logged-in user's notifications
    // ---------------------------------------------------------

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificationPageResponse> getMyNotifications(
        @RequestParam(defaultValue = "false")
        boolean unreadOnly,

        @RequestParam(defaultValue = "0")
        int page,

        @RequestParam(defaultValue = "20")
        int size,

        Authentication authentication
    ) {

        return ResponseEntity.ok(
            notificationService.getMyNotifications(
                authentication.getName(),
                unreadOnly,
                page,
                size
            )
        );
    }

    // ---------------------------------------------------------
    // 2. Get notification summary
    // ---------------------------------------------------------

    @GetMapping("/me/summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificationSummaryResponse> getMySummary(
        Authentication authentication
    ) {

        return ResponseEntity.ok(
            notificationService.getMySummary(
                authentication.getName()
            )
        );
    }

    // ---------------------------------------------------------
    // 3. Mark one notification as read
    // ---------------------------------------------------------

    @PatchMapping("/me/{notificationId}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificationResponse> markAsRead(
        @PathVariable UUID notificationId,
        Authentication authentication
    ) {

        return ResponseEntity.ok(
            notificationService.markAsRead(
                authentication.getName(),
                notificationId
            )
        );
    }

    // ---------------------------------------------------------
    // 4. Mark all notifications as read
    // ---------------------------------------------------------

    @PatchMapping("/me/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integer> markAllAsRead(
        Authentication authentication
    ) {

        int updatedCount =
            notificationService.markAllAsRead(
                authentication.getName()
            );

        return ResponseEntity.ok(updatedCount);
    }

    // ---------------------------------------------------------
    // 5. Delete one notification
    // ---------------------------------------------------------

    @DeleteMapping("/me/{notificationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteNotification(
        @PathVariable UUID notificationId,
        Authentication authentication
    ) {

        notificationService.deleteNotification(
            authentication.getName(),
            notificationId
        );

        return ResponseEntity.noContent().build();
    }
}