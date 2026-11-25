package com.medicontinuum.backend.vendor.repository;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import com.medicontinuum.backend.vendor.entity.Vendor;
import com.medicontinuum.backend.vendor.enums.VendorStatus;
public interface VendorRepository extends JpaRepository<Vendor,UUID>{
    List<Vendor> findByOrganisation_IdInAndStatusOrderByNameAsc(Collection<UUID> organisationIds,VendorStatus status);
    List<Vendor> findByOrganisation_IdOrderByNameAsc(UUID organisationId);
    Optional<Vendor> findByIdAndOrganisation_Id(UUID id,UUID organisationId);
    boolean existsByOrganisation_IdAndNameIgnoreCaseAndIdNot(UUID organisationId,String name,UUID id);
}
