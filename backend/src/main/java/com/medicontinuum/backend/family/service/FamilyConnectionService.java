package com.medicontinuum.backend.family.service;



import java.util.List;
import java.util.UUID;

import com.medicontinuum.backend.family.dto.CreateFamilyConnectionRequest;
import com.medicontinuum.backend.family.dto.FamilyConnectionResponse;

public interface FamilyConnectionService {

    FamilyConnectionResponse sendRequest(
            String senderEmail,
            CreateFamilyConnectionRequest request
    );

    FamilyConnectionResponse acceptRequest(
            String recipientEmail,
            UUID connectionId
    );

    FamilyConnectionResponse rejectRequest(
            String recipientEmail,
            UUID connectionId
    );

    void cancelRequest(
            String senderEmail,
            UUID connectionId
    );

    void removeConnection(
            String currentUserEmail,
            UUID connectionId
    );

    List<FamilyConnectionResponse> getMyConnections(
            String currentUserEmail
    );

    List<FamilyConnectionResponse> getReceivedRequests(
            String currentUserEmail
    );

    List<FamilyConnectionResponse> getSentRequests(
            String currentUserEmail
    );
}