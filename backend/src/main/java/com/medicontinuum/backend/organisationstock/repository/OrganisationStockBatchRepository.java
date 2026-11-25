package com.medicontinuum.backend.organisationstock.repository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import com.medicontinuum.backend.organisationstock.entity.OrganisationStockBatch;
public interface OrganisationStockBatchRepository extends JpaRepository<OrganisationStockBatch,UUID>{
    List<OrganisationStockBatch> findByStockItem_IdOrderByExpiryDateAsc(UUID stockItemId);
    boolean existsByStockItem_IdAndBatchNumber(UUID stockItemId,String batchNumber);
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM OrganisationStockBatch b WHERE b.stockItem.id=:stockItemId AND b.expiryDate>=:today AND b.quantityRemaining>0 ORDER BY b.expiryDate ASC,b.createdAt ASC")
    List<OrganisationStockBatch> findUsableForUpdate(@Param("stockItemId") UUID stockItemId,@Param("today") LocalDate today);
}
