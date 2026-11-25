package com.medicontinuum.backend.procurement.service.impl;

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
import com.medicontinuum.backend.organisation.enums.*;
import com.medicontinuum.backend.organisation.repository.*;
import com.medicontinuum.backend.organisationstock.service.OrganisationStockService;
import com.medicontinuum.backend.procurement.dto.*;
import com.medicontinuum.backend.procurement.entity.*;
import com.medicontinuum.backend.procurement.enums.ProcurementStatus;
import com.medicontinuum.backend.procurement.repository.*;
import com.medicontinuum.backend.procurement.service.ProcurementService;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.enums.UserStatus;
import com.medicontinuum.backend.user.repository.UserRepository;
import com.medicontinuum.backend.vendor.entity.Vendor;
import com.medicontinuum.backend.vendor.enums.VendorStatus;
import com.medicontinuum.backend.vendor.repository.VendorRepository;
import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor @Transactional
public class ProcurementServiceImpl implements ProcurementService{
    private final ProcurementRepository orders;
    private final ProcurementItemRepository items;
    private final VendorRepository vendors;
    private final MedicineRepository medicines;
    private final OrganisationRepository organisations;
    private final OrganisationMembershipRepository memberships;
    private final UserRepository users;
    private final OrganisationStockService stockService;

    @Override public ProcurementResponse create(String email,ProcurementRequests.Create r){
        User actor=activeUser(email);Vendor vendor=vendors.findById(r.vendorId()).orElseThrow(()->notFound("Vendor not found"));
        requireManager(actor,vendor.getOrganisation());
        if(vendor.getStatus()!=VendorStatus.ACTIVE)throw conflict("Cannot order from an inactive vendor");
        if(r.expectedDeliveryDate()!=null&&r.expectedDeliveryDate().isBefore(LocalDate.now()))throw bad("Expected delivery date cannot be in the past");
        Procurement order=new Procurement();order.setOrganisation(vendor.getOrganisation());order.setVendor(vendor);order.setCreatedBy(actor);
        order.setOrderNumber("PO-"+UUID.randomUUID().toString().substring(0,8).toUpperCase(Locale.ROOT));order.setStatus(ProcurementStatus.DRAFT);
        order.setExpectedDeliveryDate(r.expectedDeliveryDate());order.setNotes(clean(r.notes()));
        BigDecimal total=BigDecimal.ZERO;
        for(ProcurementRequests.Item input:r.items()){
            Medicine medicine=medicines.findById(input.medicineId()).filter(m->m.getStatus()==MedicineStatus.ACTIVE).orElseThrow(()->notFound("Active medicine not found: "+input.medicineId()));
            String unit=input.stockUnit().trim().toUpperCase(Locale.ROOT);
            if(input.quantity().compareTo(BigDecimal.ZERO)<=0||input.unitPrice().compareTo(BigDecimal.ZERO)<0)throw bad("Invalid purchase quantity or unit price");
            ProcurementItem item=new ProcurementItem();item.setMedicine(medicine);item.setOrderedQuantity(input.quantity());item.setReceivedQuantity(BigDecimal.ZERO);
            item.setStockUnit(unit);item.setUnitPrice(input.unitPrice());item.setLineTotal(input.quantity().multiply(input.unitPrice()));order.addItem(item);total=total.add(item.getLineTotal());
        }
        order.setTotalAmount(total);return toResponse(orders.save(order));
    }
    @Override @Transactional(readOnly=true) public List<ProcurementResponse> list(String email){
        User actor=activeUser(email);List<UUID> orgIds=accessibleOrganisationIds(actor);
        if(orgIds.isEmpty())return List.of();
        return orders.findByOrganisation_IdInOrderByCreatedAtDesc(orgIds).stream().map(this::toResponse).toList();
    }
    @Override @Transactional(readOnly=true) public ProcurementResponse get(String email,UUID id){
        User actor=activeUser(email);Procurement order=findOrder(id);requireManager(actor,order.getOrganisation());return toResponse(order);
    }
    @Override public ProcurementResponse updateStatus(String email,UUID id,ProcurementRequests.UpdateStatus request){
        User actor=activeUser(email);Procurement order=findOrder(id);requireManager(actor,order.getOrganisation());
        ProcurementStatus next=request.status(),current=order.getStatus();
        if(next==ProcurementStatus.ORDERED&&current==ProcurementStatus.DRAFT){order.setStatus(next);return toResponse(orders.save(order));}
        if(next==ProcurementStatus.CANCELLED&&(current==ProcurementStatus.DRAFT||current==ProcurementStatus.ORDERED)){
            if(order.getItems().stream().anyMatch(i->i.getReceivedQuantity().compareTo(BigDecimal.ZERO)>0))throw conflict("An order with received stock cannot be cancelled");
            order.setStatus(next);return toResponse(orders.save(order));
        }
        throw conflict("Invalid procurement status transition from "+current+" to "+next);
    }
    @Override public ProcurementResponse receive(String email,UUID id,ProcurementRequests.Receive request){
        User actor=activeUser(email);Procurement order=findOrder(id);requireManager(actor,order.getOrganisation());
        if(order.getStatus()!=ProcurementStatus.ORDERED&&order.getStatus()!=ProcurementStatus.PARTIALLY_RECEIVED)throw conflict("Only ordered purchase orders can receive stock");
        for(ProcurementRequests.ReceivedItem receipt:request.items()){
            ProcurementItem item=items.findById(receipt.procurementItemId()).filter(i->i.getOrder().getId().equals(order.getId())).orElseThrow(()->notFound("Purchase order item not found"));
            BigDecimal remaining=item.getOrderedQuantity().subtract(item.getReceivedQuantity());
            if(receipt.quantity().compareTo(BigDecimal.ZERO)<=0||receipt.quantity().compareTo(remaining)>0)throw bad("Received quantity exceeds the remaining ordered quantity for "+item.getMedicine().getName());
            stockService.receive(order.getOrganisation().getId(),item.getMedicine().getId(),receipt.quantity(),item.getStockUnit(),receipt.batchNumber(),receipt.expiryDate(),actor,request.notes());
            item.setReceivedQuantity(item.getReceivedQuantity().add(receipt.quantity()));
        }
        boolean complete=order.getItems().stream().allMatch(i->i.getReceivedQuantity().compareTo(i.getOrderedQuantity())>=0);
        boolean hasReceipt=order.getItems().stream().anyMatch(i->i.getReceivedQuantity().compareTo(BigDecimal.ZERO)>0);
        order.setStatus(complete?ProcurementStatus.RECEIVED:(hasReceipt?ProcurementStatus.PARTIALLY_RECEIVED:ProcurementStatus.ORDERED));
        return toResponse(orders.save(order));
    }
    @Override public void cancel(String email,UUID id){updateStatus(email,id,new ProcurementRequests.UpdateStatus(ProcurementStatus.CANCELLED));}

    private Procurement findOrder(UUID id){return orders.findById(id).orElseThrow(()->notFound("Purchase order not found"));}
    private User activeUser(String email){return users.findByEmailIgnoreCase(email).filter(u->u.getStatus()==UserStatus.ACTIVE).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Authenticated user is unavailable"));}
    private void requireManager(User actor,Organisation org){
        if(actor.getRoles().contains(com.medicontinuum.backend.user.enums.UserRole.PLATFORM_ADMIN))return;
        if(org.getStatus()!=OrganisationStatus.ACTIVE)throw conflict("Organisation is not active");
        OrganisationMembership m=memberships.findByOrganisation_IdAndUser_Id(org.getId(),actor.getId()).filter(x->x.getStatus()==OrganisationMemberStatus.ACTIVE).orElseThrow(()->forbidden("Organisation membership required"));
        if(m.getRole()!=OrganisationMemberRole.OWNER&&m.getRole()!=OrganisationMemberRole.ADMIN&&m.getRole()!=OrganisationMemberRole.PHARMACIST&&m.getRole()!=OrganisationMemberRole.STAFF)throw forbidden("Procurement permission required");
    }
    private List<UUID> accessibleOrganisationIds(User actor){
        if(actor.getRoles().contains(com.medicontinuum.backend.user.enums.UserRole.PLATFORM_ADMIN))return organisations.findAll().stream().filter(o->o.getStatus()==OrganisationStatus.ACTIVE).map(Organisation::getId).toList();
        return memberships.findByUser_IdAndStatusOrderByCreatedAtDesc(actor.getId(),OrganisationMemberStatus.ACTIVE).stream().filter(m->m.getOrganisation().getStatus()==OrganisationStatus.ACTIVE&&(m.getRole()==OrganisationMemberRole.OWNER||m.getRole()==OrganisationMemberRole.ADMIN||m.getRole()==OrganisationMemberRole.PHARMACIST||m.getRole()==OrganisationMemberRole.STAFF)).map(m->m.getOrganisation().getId()).distinct().toList();
    }
    private ProcurementResponse toResponse(Procurement o){
        List<ProcurementResponse.Item> lines=o.getItems().stream().map(i->new ProcurementResponse.Item(i.getId(),i.getMedicine().getId(),i.getMedicine().getName(),i.getMedicine().getStrength(),i.getOrderedQuantity(),i.getReceivedQuantity(),i.getStockUnit(),i.getUnitPrice(),i.getLineTotal())).toList();
        return new ProcurementResponse(o.getId(),o.getOrderNumber(),o.getOrganisation().getId(),o.getVendor().getId(),o.getVendor().getName(),o.getStatus(),o.getExpectedDeliveryDate(),o.getTotalAmount(),o.getNotes(),o.getCreatedBy().getId(),o.getCreatedAt(),o.getUpdatedAt(),lines);
    }
    private String clean(String s){return s==null||s.isBlank()?null:s.trim();}
    private ResponseStatusException notFound(String m){return new ResponseStatusException(HttpStatus.NOT_FOUND,m);}
    private ResponseStatusException conflict(String m){return new ResponseStatusException(HttpStatus.CONFLICT,m);}
    private ResponseStatusException forbidden(String m){return new ResponseStatusException(HttpStatus.FORBIDDEN,m);}
    private ResponseStatusException bad(String m){return new ResponseStatusException(HttpStatus.BAD_REQUEST,m);}
}
