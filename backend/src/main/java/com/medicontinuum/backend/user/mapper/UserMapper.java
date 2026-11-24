package com.medicontinuum.backend.user.mapper;

import java.util.HashSet;

import org.springframework.stereotype.Component;

import com.medicontinuum.backend.user.dto.UserResponse;
import com.medicontinuum.backend.user.entity.User;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getGlobalUserId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhoneNumber(),
                new HashSet<>(user.getRoles()),
                user.getStatus(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}