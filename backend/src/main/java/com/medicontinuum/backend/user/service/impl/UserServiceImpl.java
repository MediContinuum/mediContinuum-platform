package com.medicontinuum.backend.user.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicontinuum.backend.user.dto.CreateUserRequest;
import com.medicontinuum.backend.user.dto.UpdateUserRequest;
import com.medicontinuum.backend.user.dto.UserResponse;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.enums.UserStatus;
import com.medicontinuum.backend.user.exception.UserAlreadyExistsException;
import com.medicontinuum.backend.user.exception.UserNotFoundException;
import com.medicontinuum.backend.user.mapper.UserMapper;
import com.medicontinuum.backend.user.repository.UserRepository;
import com.medicontinuum.backend.user.service.GlobalUserIdGenerator;
import com.medicontinuum.backend.user.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final GlobalUserIdGenerator globalUserIdGenerator;
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    // CREATE USER
    @Override
    @Transactional
    public UserResponse createUser(
            CreateUserRequest request,
            String encodedPassword
    ) {

        if (encodedPassword == null || encodedPassword.isBlank()) {
            throw new IllegalArgumentException(
                    "Encoded password is required"
            );
        }

        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new UserAlreadyExistsException(
                    "A user with this email already exists"
            );
        }

        if (request.roles() == null || request.roles().isEmpty()) {
            throw new IllegalArgumentException(
                    "At least one user role is required"
            );
        }

        User user = new User();

        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPhoneNumber(request.phoneNumber());
        user.setPasswordHash(encodedPassword);
        user.setRoles(new HashSet<>(request.roles()));
        user.setStatus(UserStatus.ACTIVE);

        user.setGlobalUserId(generateUniqueGlobalId());

        User savedUser = userRepository.save(user);

        return userMapper.toResponse(savedUser);
    }

    // GET ALL USERS
    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    // GET USER BY UUID
    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with ID: " + id
                        )
                );

        return userMapper.toResponse(user);
    }

    // GET USER BY GLOBAL ID
    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByGlobalId(String globalUserId) {

        if (globalUserId == null || globalUserId.isBlank()) {
            throw new IllegalArgumentException(
                    "Global user ID is required"
            );
        }

        User user = userRepository.findByGlobalUserId(
                        globalUserId.trim()
                )
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with global ID: "
                                        + globalUserId
                        )
                );

        return userMapper.toResponse(user);
    }

    // UPDATE USER
    @Override
    @Transactional
    public UserResponse updateUser(
            UUID id,
            UpdateUserRequest request
    ) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with ID: " + id
                        )
                );

        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmailIgnoreCaseAndIdNot(email, id)) {
            throw new UserAlreadyExistsException(
                    "Another user already exists with this email"
            );
        }

        user.setFullName(request.fullName().trim());
        user.setEmail(email);
        user.setPhoneNumber(request.phoneNumber());

        User updatedUser = userRepository.save(user);

        return userMapper.toResponse(updatedUser);
    }

    // DEACTIVATE USER
    @Override
    @Transactional
    public void deactivateUser(UUID id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with ID: " + id
                        )
                );

        user.setStatus(UserStatus.INACTIVE);

        userRepository.save(user);
    }

    // GENERATE UNIQUE 16-DIGIT GLOBAL ID
    private String generateUniqueGlobalId() {

        for (int attempt = 0; attempt < 10; attempt++) {

            String globalId = globalUserIdGenerator.generate();

            if (globalId != null
                    && globalId.matches("\\d{16}")
                    && !userRepository.existsByGlobalUserId(globalId)) {

                return globalId;
            }
        }

        throw new IllegalStateException(
                "Unable to generate a unique global user ID"
        );
    }

    // NORMALIZE EMAIL
    private String normalizeEmail(String email) {

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException(
                    "Email is required"
            );
        }

        return email.trim().toLowerCase(Locale.ROOT);
    }
}