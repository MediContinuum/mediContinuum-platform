
package com.medicontinuum.backend.family.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.medicontinuum.backend.family.dto.CreateFamilyConnectionRequest;
import com.medicontinuum.backend.family.dto.FamilyConnectionResponse;
import com.medicontinuum.backend.family.entity.FamilyConnection;
import com.medicontinuum.backend.family.enums.ConnectionStatus;
import com.medicontinuum.backend.family.exception.FamilyConnectionException;
import com.medicontinuum.backend.family.mapper.FamilyConnectionMapper;
import com.medicontinuum.backend.family.repository.FamilyConnectionRepository;
import com.medicontinuum.backend.family.service.FamilyConnectionService;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.enums.UserStatus;
import com.medicontinuum.backend.user.exception.UserNotFoundException;
import com.medicontinuum.backend.user.repository.UserRepository;

@Service
@Transactional
public class FamilyConnectionServiceImpl
        implements FamilyConnectionService {

    private final FamilyConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    private final FamilyConnectionMapper connectionMapper;

    public FamilyConnectionServiceImpl(
            FamilyConnectionRepository connectionRepository,
            UserRepository userRepository,
            FamilyConnectionMapper connectionMapper
    ) {
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
        this.connectionMapper = connectionMapper;
    }

    // 1. Send a family connection request.
    @Override
    public FamilyConnectionResponse sendRequest(
            String senderEmail,
            CreateFamilyConnectionRequest request
    ) {

        User sender = findActiveUserByEmail(senderEmail);

        User recipient = userRepository
                .findByGlobalUserId(request.relatedUserGlobalId())
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with Global ID: "
                                        + request.relatedUserGlobalId()
                        )
                );

        if (recipient.getStatus() != UserStatus.ACTIVE) {
            throw new FamilyConnectionException(
                    "Cannot connect to an inactive user"
            );
        }

        if (sender.getId().equals(recipient.getId())) {
            throw new FamilyConnectionException(
                    "You cannot send a family request to yourself"
            );
        }

        var existing = connectionRepository.findConnectionBetweenUsers(
                sender.getId(),
                recipient.getId()
        );

        if (existing.isPresent()) {

            FamilyConnection connection = existing.get();

            if (connection.getStatus() == ConnectionStatus.PENDING) {
                throw new FamilyConnectionException(
                        "A connection request already exists"
                );
            }

            if (connection.getStatus() == ConnectionStatus.ACCEPTED) {
                throw new FamilyConnectionException(
                        "These users are already connected"
                );
            }

            // Allow a new request after a previous terminal outcome.
            connection.setUser(sender);
            connection.setRelatedUser(recipient);
            connection.setRelationship(request.relationship());
            connection.setStatus(ConnectionStatus.PENDING);
            connection.setRespondedAt(null);

            return connectionMapper.toResponse(
                    connectionRepository.save(connection)
            );
        }

        FamilyConnection connection = new FamilyConnection();

        connection.setUser(sender);
        connection.setRelatedUser(recipient);
        connection.setRelationship(request.relationship());
        connection.setStatus(ConnectionStatus.PENDING);

        return connectionMapper.toResponse(
                connectionRepository.save(connection)
        );
    }

    // 2. Accept a received request.
    @Override
    public FamilyConnectionResponse acceptRequest(
            String recipientEmail,
            UUID connectionId
    ) {

        User recipient = findActiveUserByEmail(recipientEmail);

        FamilyConnection connection =
                findRequestForRecipient(connectionId, recipient.getId());

        validatePending(connection);

        connection.setStatus(ConnectionStatus.ACCEPTED);
        connection.setRespondedAt(LocalDateTime.now());

        return connectionMapper.toResponse(
                connectionRepository.save(connection)
        );
    }

    // 3. Reject a received request.
    @Override
    public FamilyConnectionResponse rejectRequest(
            String recipientEmail,
            UUID connectionId
    ) {

        User recipient = findActiveUserByEmail(recipientEmail);

        FamilyConnection connection =
                findRequestForRecipient(connectionId, recipient.getId());

        validatePending(connection);

        connection.setStatus(ConnectionStatus.REJECTED);
        connection.setRespondedAt(LocalDateTime.now());

        return connectionMapper.toResponse(
                connectionRepository.save(connection)
        );
    }

    // 4. Cancel a request sent by the current user.
    @Override
    public void cancelRequest(
            String senderEmail,
            UUID connectionId
    ) {

        User sender = findActiveUserByEmail(senderEmail);

        FamilyConnection connection = connectionRepository
                .findByIdAndUser_Id(connectionId, sender.getId())
                .orElseThrow(() ->
                        new FamilyConnectionException(
                                "Sent connection request not found"
                        )
                );

        validatePending(connection);

        connection.setStatus(ConnectionStatus.CANCELLED);
        connection.setRespondedAt(LocalDateTime.now());

        connectionRepository.save(connection);
    }

    // 5. Remove an accepted connection.
    @Override
    public void removeConnection(
            String currentUserEmail,
            UUID connectionId
    ) {

        User currentUser = findActiveUserByEmail(currentUserEmail);

        FamilyConnection connection =
                connectionRepository.findById(connectionId)
                        .orElseThrow(() ->
                                new FamilyConnectionException(
                                        "Family connection not found"
                                )
                        );

        boolean isFirstUser = connection.getUser().getId()
                .equals(currentUser.getId());

        boolean isSecondUser = connection.getRelatedUser().getId()
                .equals(currentUser.getId());

        if (!isFirstUser && !isSecondUser) {
            throw new FamilyConnectionException(
                    "You are not part of this family connection"
            );
        }

        if (connection.getStatus() != ConnectionStatus.ACCEPTED) {
            throw new FamilyConnectionException(
                    "Only accepted connections can be removed"
            );
        }

        connection.setStatus(ConnectionStatus.REMOVED);
        connection.setRespondedAt(LocalDateTime.now());

        connectionRepository.save(connection);
    }

    // 6. Get all accepted family connections.
    @Override
    @Transactional(readOnly = true)
    public List<FamilyConnectionResponse> getMyConnections(
            String currentUserEmail
    ) {

        User currentUser = findActiveUserByEmail(currentUserEmail);

        return connectionRepository.findConnectionsByUserAndStatus(
                        currentUser.getId(),
                        ConnectionStatus.ACCEPTED
                )
                .stream()
                .map(connectionMapper::toResponse)
                .toList();
    }

    // 7. Get requests received by the current user.
    @Override
    @Transactional(readOnly = true)
    public List<FamilyConnectionResponse> getReceivedRequests(
            String currentUserEmail
    ) {

        User currentUser = findActiveUserByEmail(currentUserEmail);

        return connectionRepository.findByRelatedUser_IdAndStatus(
                        currentUser.getId(),
                        ConnectionStatus.PENDING
                )
                .stream()
                .map(connectionMapper::toResponse)
                .toList();
    }

    // 8. Get requests sent by the current user.
    @Override
    @Transactional(readOnly = true)
    public List<FamilyConnectionResponse> getSentRequests(
            String currentUserEmail
    ) {

        User currentUser = findActiveUserByEmail(currentUserEmail);

        return connectionRepository.findByUser_IdAndStatus(
                        currentUser.getId(),
                        ConnectionStatus.PENDING
                )
                .stream()
                .map(connectionMapper::toResponse)
                .toList();
    }

    // Helper: Find an active user using the authenticated email.
    private User findActiveUserByEmail(String email) {

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "Authenticated user account not found"
                        )
                );

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new FamilyConnectionException(
                    "Your account is not active"
            );
        }

        return user;
    }

    // Helper: Only the actual recipient can respond to a request.
    private FamilyConnection findRequestForRecipient(
            UUID connectionId,
            UUID recipientId
    ) {

        return connectionRepository
                .findByIdAndRelatedUser_Id(connectionId, recipientId)
                .orElseThrow(() ->
                        new FamilyConnectionException(
                                "Received family request not found"
                        )
                );
    }

    // Helper: Only pending requests can be accepted or rejected.
    private void validatePending(FamilyConnection connection) {

        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new FamilyConnectionException(
                    "This request is no longer pending"
            );
        }
    }
}
