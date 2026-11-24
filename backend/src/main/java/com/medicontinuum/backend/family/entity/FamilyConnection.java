package com.medicontinuum.backend.family.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.medicontinuum.backend.family.enums.ConnectionStatus;
import com.medicontinuum.backend.family.enums.FamilyRelationship;
import com.medicontinuum.backend.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "family_connections",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_family_connection_pair",
            columnNames = {"user_id", "related_user_id"}
        )
    }
)
public class FamilyConnection {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // User who sends the connection request.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // User who receives the connection request.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "related_user_id", nullable = false)
    private User relatedUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private FamilyRelationship relationship;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ConnectionStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public FamilyConnection() {
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status = ConnectionStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getRelatedUser() {
        return relatedUser;
    }

    public void setRelatedUser(User relatedUser) {
        this.relatedUser = relatedUser;
    }

    public FamilyRelationship getRelationship() {
        return relationship;
    }

    public void setRelationship(FamilyRelationship relationship) {
        this.relationship = relationship;
    }

    public ConnectionStatus getStatus() {
        return status;
    }

    public void setStatus(ConnectionStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}