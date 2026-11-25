package com.medicontinuum.backend.inventory.repository;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import com.medicontinuum.backend.inventory.entity.DoseInventoryConsumption;
public interface DoseInventoryConsumptionRepository extends JpaRepository<DoseInventoryConsumption,UUID>{
    boolean existsByDoseSchedule_Id(UUID doseScheduleId);
    Optional<DoseInventoryConsumption> findByDoseSchedule_Id(UUID doseScheduleId);
}
