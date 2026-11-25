package com.medicontinuum.backend.auth.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import com.medicontinuum.backend.user.entity.User;
import jakarta.persistence.*;

@Entity
@Table(
    name = "oauth2_accounts",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_oauth2_provider_subject", columnNames = {"provider", "provider_subject"}),
        @UniqueConstraint(name = "uk_oauth2_provider_user", columnNames = {"provider", "user_id"})
    },
    indexes = {
        @Index(name = "idx_oauth2_account_user", columnList = "user_id"),
        @Index(name = "idx_oauth2_account_email", columnList = "email")
    }
)
public class OAuth2Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 30)
    private String provider;

    @Column(name = "provider_subject", nullable = false, length = 200)
    private String providerSubject;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(name = "linked_at", nullable = false, updatable = false)
    private LocalDateTime linkedAt;

    @PrePersist
    void onCreate() {
        linkedAt = LocalDateTime.now();
    }

    public UUID getId() { return id; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getProviderSubject() { return providerSubject; }
    public void setProviderSubject(String providerSubject) { this.providerSubject = providerSubject; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public LocalDateTime getLinkedAt() { return linkedAt; }
}
