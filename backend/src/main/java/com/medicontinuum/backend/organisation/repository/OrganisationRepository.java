package com.medicontinuum.backend.organisation.repository;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import com.medicontinuum.backend.organisation.entity.Organisation;
public interface OrganisationRepository extends JpaRepository<Organisation, UUID> {
    boolean existsByRegistrationNumberIgnoreCase(String registrationNumber);
    boolean existsByRegistrationNumberIgnoreCaseAndIdNot(String registrationNumber, UUID id);
}
