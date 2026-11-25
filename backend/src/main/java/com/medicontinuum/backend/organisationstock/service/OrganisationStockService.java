package com.medicontinuum.backend.organisationstock.service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import com.medicontinuum.backend.organisationstock.dto.OrganisationStockResponse;
import com.medicontinuum.backend.user.entity.User;
public interface OrganisationStockService{
    OrganisationStockResponse receive(UUID organisationId,UUID medicineId,BigDecimal quantity,String unit,String batchNumber,LocalDate expiryDate,User performedBy,String notes);
    List<OrganisationStockResponse> list(UUID organisationId);
}
