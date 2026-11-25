package com.medicontinuum.backend.auth.entity;

import java.time.LocalDateTime;
import java.util.UUID;
import com.medicontinuum.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="refresh_tokens",uniqueConstraints=@UniqueConstraint(name="uk_refresh_token_hash",columnNames="token_hash"),indexes={
    @Index(name="idx_refresh_token_user",columnList="user_id"),
    @Index(name="idx_refresh_token_expiry",columnList="expires_at")
})
@Getter @Setter @NoArgsConstructor
public class RefreshToken {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="user_id",nullable=false) private User user;
    @Column(name="token_hash",nullable=false,length=64,unique=true) private String tokenHash;
    @Column(name="expires_at",nullable=false) private LocalDateTime expiresAt;
    @Column(name="revoked_at") private LocalDateTime revokedAt;
    @Column(name="created_at",nullable=false,updatable=false) private LocalDateTime createdAt;
    @PrePersist void onCreate(){createdAt=LocalDateTime.now();}
}
