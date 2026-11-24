package com.medicontinuum.backend.user.service.impl;

import java.util.UUID;

import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import com.medicontinuum.backend.user.dto.CreateUserRequest;
import com.medicontinuum.backend.user.dto.UserResponse;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.enums.UserStatus;
import com.medicontinuum.backend.user.mapper.UserMapper;
import com.medicontinuum.backend.user.repository.UserRepository;
import com.medicontinuum.backend.user.service.GlobalUserIdGenerator;
import com.medicontinuum.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final GlobalUserIdGenerator globalUserIdGenerator;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public UserResponse createUser(
            CreateUserRequest request,
            String encodedPassword) {

        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException(
                    "A user with this email already exists");
        }

        if (encodedPassword == null || encodedPassword.isBlank()) {
            throw new IllegalArgumentException(
                    "Encoded password is required");
        }

        User user = new User();

        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPhoneNumber(request.phoneNumber());
        user.setPasswordHash(encodedPassword);
        user.setRoles(request.roles());
        user.setStatus(UserStatus.ACTIVE);

        // Generate a unique 16-digit global ID.
        String globalId;

        do {
            globalId = globalUserIdGenerator.generate();
        } while (userRepository.existsByGlobalUserId(globalId));

        user.setGlobalUserId(globalId);

        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }

    @Override
    public @Nullable Object getAllUsers() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getAllUsers'");
    }

    @Override
    public @Nullable Object getUserById(UUID id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getUserById'");
    }
}
