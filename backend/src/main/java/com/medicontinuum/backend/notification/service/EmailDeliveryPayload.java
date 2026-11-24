package com.medicontinuum.backend.notification.service;

import java.util.UUID;

/**
 * Immutable snapshot of an email claimed by a delivery worker.
 * The claim token prevents a timed-out worker from updating a newer claim.
 */
public record EmailDeliveryPayload(
    UUID notificationId,
    UUID claimToken,
    String recipientEmail,
    String subject,
    String message
) {}
