package com.medicontinuum.backend.family.dto;



import java.time.LocalDateTime;
import java.util.UUID;

import com.medicontinuum.backend.family.enums.ConnectionStatus;
import com.medicontinuum.backend.family.enums.FamilyRelationship;

public record FamilyConnectionResponse(

        UUID connectionId,

        String userGlobalId,

        String userName,

        String relatedUserGlobalId,

        String relatedUserName,

        FamilyRelationship relationship,

        ConnectionStatus status,

        LocalDateTime createdAt,

        LocalDateTime respondedAt

) {
}