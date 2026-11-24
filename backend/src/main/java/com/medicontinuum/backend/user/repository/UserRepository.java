package com.medicontinuum.backend.user.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.enums.UserStatus;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByGlobalUserId(String globalUserId);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCaseAndIdNot(
            String email,
            UUID id
    );

    boolean existsByGlobalUserId(String globalUserId);

    List<User> findAllByStatus(UserStatus status);
}