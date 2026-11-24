package com.medicontinuum.backend.organisation.repository;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import com.medicontinuum.backend.organisation.entity.OrganisationMembership;
import com.medicontinuum.backend.organisation.enums.*;
public interface OrganisationMembershipRepository extends JpaRepository<OrganisationMembership, UUID> {
    Optional<OrganisationMembership> findByOrganisation_IdAndUser_Id(UUID organisationId, UUID userId);
    Optional<OrganisationMembership> findByIdAndOrganisation_Id(UUID membershipId, UUID organisationId);
    List<OrganisationMembership> findByUser_IdAndStatusOrderByCreatedAtDesc(UUID userId, OrganisationMemberStatus status);
    List<OrganisationMembership> findByOrganisation_IdAndStatusOrderByCreatedAtAsc(UUID organisationId, OrganisationMemberStatus status);
    long countByOrganisation_IdAndStatus(UUID organisationId, OrganisationMemberStatus status);
    long countByOrganisation_IdAndRoleAndStatus(UUID organisationId, OrganisationMemberRole role, OrganisationMemberStatus status);
}
