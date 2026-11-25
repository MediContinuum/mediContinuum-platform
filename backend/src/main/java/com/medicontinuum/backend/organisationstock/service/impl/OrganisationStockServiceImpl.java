package com.medicontinuum.backend.organisationstock.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.medicontinuum.backend.medicine.entity.Medicine;
import com.medicontinuum.backend.medicine.enums.MedicineStatus;
import com.medicontinuum.backend.medicine.repository.MedicineRepository;
import com.medicontinuum.backend.organisation.entity.Organisation;
import com.medicontinuum.backend.organisation.repository.OrganisationRepository;
import com.medicontinuum.backend.organisationstock.dto.OrganisationStockResponse;
import com.medicontinuum.backend.organisationstock.entity.*;
import com.medicontinuum.backend.organisationstock.enums.OrganisationStockTransactionType;
import com.medicontinuum.backend.organisationstock.repository.*;
import com.medicontinuum.backend.organisationstock.service.OrganisationStockService;
import com.medicontinuum.backend.user.entity.User;
import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor @Transactional
public class OrganisationStockServiceImpl implements OrganisationStockService{
    private final OrganisationStockRepository stocks;
    private final OrganisationStockBatchRepository batches;
    private final OrganisationStockTransactionRepository transactions;
    private final OrganisationRepository organisations;
    private final MedicineRepository medicines;

    @Override public OrganisationStockResponse receive(UUID organisationId,UUID medicineId,BigDecimal quantity,String unit,String batchNumber,LocalDate expiryDate,User actor,String notes){
        if(quantity==null||quantity.compareTo(BigDecimal.ZERO)<=0)throw bad("Received quantity must be greater than zero");
        if(unit==null||unit.isBlank())throw bad("Stock unit is required");
        if(expiryDate==null||expiryDate.isBefore(LocalDate.now()))throw bad("Expiry date cannot be in the past");
        Organisation organisation=organisations.findById(organisationId).orElseThrow(()->notFound("Organisation not found"));
        Medicine medicine=medicines.findById(medicineId).filter(m->m.getStatus()==MedicineStatus.ACTIVE).orElseThrow(()->notFound("Active medicine not found"));
        String normalizedUnit=unit.trim().toUpperCase(Locale.ROOT);
        OrganisationStock stock=stocks.findByOrganisation_IdAndMedicine_Id(organisationId,medicineId).orElse(null);
        if(stock==null){
            stock=new OrganisationStock();stock.setOrganisation(organisation);stock.setMedicine(medicine);stock.setStockUnit(normalizedUnit);stock.setLowStockThreshold(BigDecimal.ZERO);
            stock=stocks.saveAndFlush(stock);
        }else{
            stock=stocks.findByIdForUpdate(stock.getId()).orElseThrow(()->notFound("Organisation stock record not found"));
            if(!stock.getStockUnit().equals(normalizedUnit))throw conflict("Received stock unit does not match the existing stock unit");
        }
        String cleanBatch=batchNumber==null||batchNumber.isBlank()?null:batchNumber.trim();
        if(cleanBatch!=null&&batches.existsByStockItem_IdAndBatchNumber(stock.getId(),cleanBatch))throw conflict("Batch number already exists for this medicine at this organisation");
        OrganisationStockBatch batch=new OrganisationStockBatch();batch.setStockItem(stock);batch.setBatchNumber(cleanBatch);batch.setExpiryDate(expiryDate);batch.setQuantityReceived(quantity);batch.setQuantityRemaining(quantity);
        batch=batches.save(batch);
        OrganisationStockTransaction tx=new OrganisationStockTransaction();tx.setStockItem(stock);tx.setBatch(batch);tx.setPerformedBy(actor);tx.setType(OrganisationStockTransactionType.RECEIVED);tx.setQuantity(quantity);tx.setNotes(notes==null||notes.isBlank()?null:notes.trim());transactions.save(tx);
        return toResponse(stock);
    }

    @Override @Transactional(readOnly=true) public List<OrganisationStockResponse> list(UUID organisationId){
        return stocks.findByOrganisation_IdOrderByMedicine_NameAsc(organisationId).stream().map(this::toResponse).toList();
    }
    private OrganisationStockResponse toResponse(OrganisationStock stock){
        LocalDate today=LocalDate.now();
        List<OrganisationStockBatch> stockBatches=batches.findByStockItem_IdOrderByExpiryDateAsc(stock.getId());
        BigDecimal available=BigDecimal.ZERO;List<OrganisationStockResponse.Batch> output=new ArrayList<>();
        for(OrganisationStockBatch b:stockBatches){
            if(!b.getExpiryDate().isBefore(today))available=available.add(b.getQuantityRemaining());
            output.add(new OrganisationStockResponse.Batch(b.getId(),b.getBatchNumber(),b.getExpiryDate(),b.getQuantityReceived(),b.getQuantityRemaining()));
        }
        return new OrganisationStockResponse(stock.getId(),stock.getOrganisation().getId(),stock.getMedicine().getId(),stock.getMedicine().getName(),stock.getMedicine().getStrength(),stock.getStockUnit(),available,stock.getLowStockThreshold(),available.compareTo(stock.getLowStockThreshold())<=0,output);
    }
    private ResponseStatusException notFound(String m){return new ResponseStatusException(HttpStatus.NOT_FOUND,m);}
    private ResponseStatusException bad(String m){return new ResponseStatusException(HttpStatus.BAD_REQUEST,m);}
    private ResponseStatusException conflict(String m){return new ResponseStatusException(HttpStatus.CONFLICT,m);}
}
