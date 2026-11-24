package com.medicontinuum.backend.user.dto;



import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

import com.medicontinuum.backend.user.enums.UserRole;
import com.medicontinuum.backend.user.enums.UserStatus;

public record UserResponse(

        UUID id,

        String globalUserId,

        String fullName,

        String email,

        String phoneNumber,

        Set<UserRole> roles,

        UserStatus status,

        LocalDateTime createdAt,

        LocalDateTime updatedAt

) {
}