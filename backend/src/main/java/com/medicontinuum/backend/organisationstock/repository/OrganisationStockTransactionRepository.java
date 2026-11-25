package com.medicontinuum.backend.organisationstock.repository;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import com.medicontinuum.backend.organisationstock.entity.OrganisationStockTransaction;
public interface OrganisationStockTransactionRepository extends JpaRepository<OrganisationStockTransaction,UUID>{
    List<OrganisationStockTransaction> findByStockItem_IdOrderByCreatedAtDesc(UUID stockItemId);
    List<OrganisationStockTransaction> findByStockItem_IdAndTypeAndCreatedAtGreaterThanEqualAndCreatedAtLessThanOrderByCreatedAtAsc(UUID stockItemId, com.medicontinuum.backend.organisationstock.enums.OrganisationStockTransactionType type, java.time.LocalDateTime from, java.time.LocalDateTime to);
}
