package com.medicontinuum.backend.auth.repository;

import java.time.LocalDateTime;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.medicontinuum.backend.auth.entity.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken,UUID>{
    Optional<RefreshToken> findByTokenHash(String tokenHash);

    @Modifying(clearAutomatically=true,flushAutomatically=true)
    @Query("""
        UPDATE RefreshToken r
        SET r.revokedAt=:now
        WHERE r.user.id=:userId AND r.revokedAt IS NULL
    """)
    int revokeAllActiveForUser(@Param("userId") UUID userId,@Param("now") LocalDateTime now);
}
