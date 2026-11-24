package com.medicontinuum.backend.user.service;

import java.util.UUID;

import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import com.medicontinuum.backend.user.dto.CreateUserRequest;
import com.medicontinuum.backend.user.dto.UserResponse;

@Service
public interface  UserService {

    UserResponse createUser(CreateUserRequest request, String encodedPassword);

    @Nullable
    Object getAllUsers();

    @Nullable
    Object getUserById(UUID id);

}
