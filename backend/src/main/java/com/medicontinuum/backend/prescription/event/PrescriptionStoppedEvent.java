package com.medicontinuum.backend.prescription.event;

import java.util.UUID;

import com.medicontinuum.backend.prescription.enums.PrescriptionStatus;

/**
 * Published when a prescription stops being active. Dependent modules
 * clean up any still-pending work after the originating transaction commits.
 */
public record PrescriptionStoppedEvent(
    UUID prescriptionId,
    PrescriptionStatus status
) {
}
