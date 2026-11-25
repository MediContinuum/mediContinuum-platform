package com.medicontinuum.backend.procurement.repository;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import com.medicontinuum.backend.procurement.entity.ProcurementItem;
public interface ProcurementItemRepository extends JpaRepository<ProcurementItem,UUID>{
    List<ProcurementItem> findByOrder_IdOrderByIdAsc(UUID orderId);
}
