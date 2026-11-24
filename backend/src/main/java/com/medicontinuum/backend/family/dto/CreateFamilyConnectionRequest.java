package com.medicontinuum.backend.family.dto;



import com.medicontinuum.backend.family.enums.FamilyRelationship;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record CreateFamilyConnectionRequest(

        @NotBlank(message = "Global user ID is required")
        @Pattern(
            regexp = "^[0-9]{16}$",
            message = "Global user ID must contain exactly 16 digits"
        )
        String relatedUserGlobalId,

        @NotNull(message = "Family relationship is required")
        FamilyRelationship relationship

) {
}