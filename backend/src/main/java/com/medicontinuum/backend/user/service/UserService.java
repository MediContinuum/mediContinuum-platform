package com.medicontinuum.backend.user.service;

import java.util.List;
import java.util.UUID;

import com.medicontinuum.backend.user.dto.CreateUserRequest;
import com.medicontinuum.backend.user.dto.UpdateUserRequest;
import com.medicontinuum.backend.user.dto.UserResponse;

public interface UserService {

    UserResponse createUser(
            CreateUserRequest request,
            String encodedPassword
    );

    List<UserResponse> getAllUsers();

    UserResponse getUserById(UUID id);

    UserResponse getUserByGlobalId(String globalUserId);

    UserResponse updateUser(
            UUID id,
            UpdateUserRequest request
    );

    void deactivateUser(UUID id);
}