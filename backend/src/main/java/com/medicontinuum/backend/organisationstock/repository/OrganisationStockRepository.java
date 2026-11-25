package com.medicontinuum.backend.organisationstock.repository;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import com.medicontinuum.backend.organisationstock.entity.OrganisationStock;
public interface OrganisationStockRepository extends JpaRepository<OrganisationStock,UUID>{
    Optional<OrganisationStock> findByOrganisation_IdAndMedicine_Id(UUID organisationId,UUID medicineId);
    List<OrganisationStock> findByOrganisation_IdOrderByMedicine_NameAsc(UUID organisationId);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM OrganisationStock s WHERE s.id=:id")
    Optional<OrganisationStock> findByIdForUpdate(@Param("id") UUID id);
}
