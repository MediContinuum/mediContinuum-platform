package com.medicontinuum.backend.organisation.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import com.medicontinuum.backend.organisation.enums.*;

public final class OrganisationResponses {
    private OrganisationResponses() {}

    public record Organisation(
        UUID id, String name, String registrationNumber, OrganisationType type,
        OrganisationStatus status, String contactEmail, String contactPhone,
        String website, String addressLine, String city, String state,
        String country, String postalCode, UUID createdByUserId,
        String createdByName, LocalDateTime createdAt, LocalDateTime updatedAt
    ) {}

    public record Member(
        UUID membershipId, UUID userId, String globalUserId, String fullName,
        String email, String phoneNumber, OrganisationMemberRole role,
        OrganisationMemberStatus status, LocalDateTime joinedAt,
        LocalDateTime updatedAt
    ) {}

    public record Patient(
        UUID linkId, UUID patientId, String globalUserId, String fullName,
        String email, String phoneNumber, String city, String state,
        OrganisationPatientStatus status, LocalDateTime linkedAt
    ) {}

    public record Dashboard(
        UUID organisationId, String organisationName, OrganisationType type,
        OrganisationStatus status, long totalMembers, long totalDoctors,
        long totalNurses, long totalPharmacists, long totalPatients
    ) {}
}
