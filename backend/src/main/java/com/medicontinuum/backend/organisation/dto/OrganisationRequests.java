package com.medicontinuum.backend.organisation.dto;

import java.util.UUID;
import com.medicontinuum.backend.organisation.enums.OrganisationMemberRole;
import com.medicontinuum.backend.organisation.enums.OrganisationStatus;
import com.medicontinuum.backend.organisation.enums.OrganisationType;
import jakarta.validation.constraints.*;

public final class OrganisationRequests {
    private OrganisationRequests() {}

    public record Create(
        @NotBlank @Size(max=150) String name,
        @Size(max=100) String registrationNumber,
        @NotNull OrganisationType type,
        @Email @Size(max=150) String contactEmail,
        @Pattern(regexp="^[+0-9() .-]{7,25}$") String contactPhone,
        @Size(max=255) String website,
        @Size(max=255) String addressLine,
        @Size(max=100) String city,
        @Size(max=100) String state,
        @Size(max=100) String country,
        @Size(max=20) String postalCode
    ) {}

    /** PATCH semantics: null properties are not modified. */
    public record Update(
        @Size(min=2,max=150) String name,
        @Size(max=100) String registrationNumber,
        OrganisationType type,
        @Email @Size(max=150) String contactEmail,
        @Pattern(regexp="^[+0-9() .-]{7,25}$") String contactPhone,
        @Size(max=255) String website,
        @Size(max=255) String addressLine,
        @Size(max=100) String city,
        @Size(max=100) String state,
        @Size(max=100) String country,
        @Size(max=20) String postalCode
    ) {}

    public record Status(@NotNull OrganisationStatus status) {}
    public record AddMember(
        @NotBlank @Pattern(regexp="^[0-9]{16}$") String globalUserId,
        @NotNull OrganisationMemberRole role
    ) {}
    public record MemberRole(@NotNull OrganisationMemberRole role) {}
    public record AddPatient(@NotNull UUID patientId) {}
}
