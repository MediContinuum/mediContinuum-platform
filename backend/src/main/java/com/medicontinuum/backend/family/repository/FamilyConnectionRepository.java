package com.medicontinuum.backend.family.repository;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medicontinuum.backend.family.entity.FamilyConnection;
import com.medicontinuum.backend.family.enums.ConnectionStatus;

public interface FamilyConnectionRepository
        extends JpaRepository<FamilyConnection, UUID> {

    List<FamilyConnection> findByUser_Id(UUID userId);

    List<FamilyConnection> findByRelatedUser_Id(UUID userId);

    Optional<FamilyConnection> findByUser_IdAndRelatedUser_Id(
            UUID userId,
            UUID relatedUserId
    );

    boolean existsByUser_IdAndRelatedUser_Id(
            UUID userId,
            UUID relatedUserId
    );

    List<FamilyConnection> findByRelatedUser_IdAndStatus(
            UUID userId,
            ConnectionStatus status
    );
}