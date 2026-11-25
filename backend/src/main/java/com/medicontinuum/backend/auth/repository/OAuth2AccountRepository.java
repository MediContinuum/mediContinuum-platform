package com.medicontinuum.backend.auth.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medicontinuum.backend.auth.entity.OAuth2Account;

public interface OAuth2AccountRepository extends JpaRepository<OAuth2Account, UUID> {
    Optional<OAuth2Account> findByProviderAndProviderSubject(String provider, String providerSubject);
    boolean existsByProviderAndUser_Id(String provider, UUID userId);
}
