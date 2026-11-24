package com.medicontinuum.backend.family.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.medicontinuum.backend.family.entity.FamilyConnection;
import com.medicontinuum.backend.family.enums.ConnectionStatus;

public interface FamilyConnectionRepository
        extends JpaRepository<FamilyConnection, UUID> {

    // Requests sent by a user.
    List<FamilyConnection> findByUser_Id(UUID userId);

    // Requests received by a user.
    List<FamilyConnection> findByRelatedUser_Id(UUID userId);

    // Requests sent by a user with a particular status.
    List<FamilyConnection> findByUser_IdAndStatus(
            UUID userId,
            ConnectionStatus status
    );

    // Requests received by a user with a particular status.
    List<FamilyConnection> findByRelatedUser_IdAndStatus(
            UUID userId,
            ConnectionStatus status
    );

    // Find a connection in either direction.
    @Query("""
            SELECT fc FROM FamilyConnection fc
            WHERE
                (fc.user.id = :firstUserId
                 AND fc.relatedUser.id = :secondUserId)
                OR
                (fc.user.id = :secondUserId
                 AND fc.relatedUser.id = :firstUserId)
            """)
    Optional<FamilyConnection> findConnectionBetweenUsers(
            @Param("firstUserId") UUID firstUserId,
            @Param("secondUserId") UUID secondUserId
    );

    // Accepted connections involving a user.
    @Query("""
            SELECT fc FROM FamilyConnection fc
            WHERE
                (fc.user.id = :userId OR fc.relatedUser.id = :userId)
                AND fc.status = :status
            ORDER BY fc.createdAt DESC
            """)
    List<FamilyConnection> findConnectionsByUserAndStatus(
            @Param("userId") UUID userId,
            @Param("status") ConnectionStatus status
    );

    // All connections involving a user.
    @Query("""
            SELECT fc FROM FamilyConnection fc
            WHERE fc.user.id = :userId OR fc.relatedUser.id = :userId
            ORDER BY fc.createdAt DESC
            """)
    List<FamilyConnection> findAllConnectionsForUser(
            @Param("userId") UUID userId
    );

    // Check whether a connection exists in the specified direction.
    boolean existsByUser_IdAndRelatedUser_Id(
            UUID userId,
            UUID relatedUserId
    );

    // Find a connection in the specified direction.
    Optional<FamilyConnection> findByUser_IdAndRelatedUser_Id(
            UUID userId,
            UUID relatedUserId
    );

    // Find a request only when the specified user is its recipient.
    Optional<FamilyConnection> findByIdAndRelatedUser_Id(
            UUID id,
            UUID recipientId
    );

    // Find a request only when the specified user is its sender.
    Optional<FamilyConnection> findByIdAndUser_Id(
            UUID id,
            UUID senderId
    );
}