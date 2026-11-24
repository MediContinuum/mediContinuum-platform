package com.medicontinuum.backend.organisation.repository;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import com.medicontinuum.backend.organisation.entity.OrganisationPatient;
import com.medicontinuum.backend.organisation.enums.OrganisationPatientStatus;
public interface OrganisationPatientRepository extends JpaRepository<OrganisationPatient, UUID> {
    Optional<OrganisationPatient> findByOrganisation_IdAndPatient_Id(UUID organisationId, UUID patientId);
    List<OrganisationPatient> findByOrganisation_IdAndStatusOrderByCreatedAtDesc(UUID organisationId, OrganisationPatientStatus status);
    long countByOrganisation_IdAndStatus(UUID organisationId, OrganisationPatientStatus status);
}
