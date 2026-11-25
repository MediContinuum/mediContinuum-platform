package com.medicontinuum.backend.procurement.repository;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import com.medicontinuum.backend.procurement.entity.Procurement;
import com.medicontinuum.backend.procurement.enums.ProcurementStatus;
public interface ProcurementRepository extends JpaRepository<Procurement,UUID>{
    List<Procurement> findByOrganisation_IdInOrderByCreatedAtDesc(Collection<UUID> organisationIds);
    Optional<Procurement> findByIdAndOrganisation_Id(UUID id,UUID organisationId);
    long countByOrganisation_IdAndStatus(UUID organisationId,ProcurementStatus status);
    long countByOrganisation_Id(UUID organisationId);
}
