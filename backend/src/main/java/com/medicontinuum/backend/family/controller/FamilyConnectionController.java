
package com.medicontinuum.backend.family.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.medicontinuum.backend.family.dto.CreateFamilyConnectionRequest;
import com.medicontinuum.backend.family.dto.FamilyConnectionResponse;
import com.medicontinuum.backend.family.service.FamilyConnectionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/family/connections")
public class FamilyConnectionController {

    private final FamilyConnectionService familyConnectionService;

    public FamilyConnectionController(
            FamilyConnectionService familyConnectionService
    ) {
        this.familyConnectionService = familyConnectionService;
    }

    // 1. Send a family connection request.
    @PostMapping
    public ResponseEntity<FamilyConnectionResponse> sendRequest(
            @Valid @RequestBody CreateFamilyConnectionRequest request,
            Authentication authentication
    ) {

        FamilyConnectionResponse response =
                familyConnectionService.sendRequest(
                        authentication.getName(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 2. Get all accepted family connections.
    @GetMapping
    public ResponseEntity<List<FamilyConnectionResponse>> getMyConnections(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                familyConnectionService.getMyConnections(
                        authentication.getName()
                )
        );
    }

    // 3. Get requests received by the current user.
    @GetMapping("/requests/received")
    public ResponseEntity<List<FamilyConnectionResponse>> getReceivedRequests(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                familyConnectionService.getReceivedRequests(
                        authentication.getName()
                )
        );
    }

    // 4. Get requests sent by the current user.
    @GetMapping("/requests/sent")
    public ResponseEntity<List<FamilyConnectionResponse>> getSentRequests(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                familyConnectionService.getSentRequests(
                        authentication.getName()
                )
        );
    }

    // 5. Accept a received request.
    @PatchMapping("/{connectionId}/accept")
    public ResponseEntity<FamilyConnectionResponse> acceptRequest(
            @PathVariable UUID connectionId,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                familyConnectionService.acceptRequest(
                        authentication.getName(),
                        connectionId
                )
        );
    }

    // 6. Reject a received request.
    @PatchMapping("/{connectionId}/reject")
    public ResponseEntity<FamilyConnectionResponse> rejectRequest(
            @PathVariable UUID connectionId,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                familyConnectionService.rejectRequest(
                        authentication.getName(),
                        connectionId
                )
        );
    }

    // 7. Cancel a request sent by the current user.
    @PatchMapping("/{connectionId}/cancel")
    public ResponseEntity<Void> cancelRequest(
            @PathVariable UUID connectionId,
            Authentication authentication
    ) {

        familyConnectionService.cancelRequest(
                authentication.getName(),
                connectionId
        );

        return ResponseEntity.noContent().build();
    }

    // 8. Remove an accepted family connection.
    @DeleteMapping("/{connectionId}")
    public ResponseEntity<Void> removeConnection(
            @PathVariable UUID connectionId,
            Authentication authentication
    ) {

        familyConnectionService.removeConnection(
                authentication.getName(),
                connectionId
        );

        return ResponseEntity.noContent().build();
    }
}
