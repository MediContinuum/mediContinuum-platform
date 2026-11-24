package com.medicontinuum.backend.family.mapper;



import org.springframework.stereotype.Component;

import com.medicontinuum.backend.family.dto.FamilyConnectionResponse;
import com.medicontinuum.backend.family.entity.FamilyConnection;

@Component
public class FamilyConnectionMapper {

    public FamilyConnectionResponse toResponse(
            FamilyConnection connection
    ) {

        return new FamilyConnectionResponse(
                connection.getId(),

                connection.getUser().getGlobalUserId(),
                connection.getUser().getFullName(),

                connection.getRelatedUser().getGlobalUserId(),
                connection.getRelatedUser().getFullName(),

                connection.getRelationship(),
                connection.getStatus(),

                connection.getCreatedAt(),
                connection.getRespondedAt()
        );
    }
}