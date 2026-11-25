package com.medicontinuum.backend.vendor.service.impl;

import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.medicontinuum.backend.organisation.entity.Organisation;
import com.medicontinuum.backend.organisation.enums.*;
import com.medicontinuum.backend.organisation.repository.*;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.enums.UserStatus;
import com.medicontinuum.backend.user.repository.UserRepository;
import com.medicontinuum.backend.vendor.dto.*;
import com.medicontinuum.backend.vendor.entity.Vendor;
import com.medicontinuum.backend.vendor.enums.VendorStatus;
import com.medicontinuum.backend.vendor.repository.VendorRepository;
import com.medicontinuum.backend.vendor.service.VendorService;
import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor @Transactional
public class VendorServiceImpl implements VendorService {
    private final VendorRepository vendors;
    private final OrganisationRepository organisations;
    private final OrganisationMembershipRepository memberships;
    private final UserRepository users;

    @Override public VendorResponse create(String email,VendorRequests.Create r){
        User actor=activeUser(email);Organisation org=resolveOrganisation(actor,r.organisationId());requireManager(actor,org);
        Vendor v=new Vendor();v.setOrganisation(org);v.setName(r.name().trim());v.setRegistrationNumber(clean(r.registrationNumber()));
        v.setContactPerson(clean(r.contactPerson()));v.setEmail(normalizeOptionalEmail(r.email()));v.setPhoneNumber(clean(r.phoneNumber()));v.setAddress(clean(r.address()));
        v.setCity(clean(r.city()));v.setState(clean(r.state()));v.setCountry(clean(r.country()));v.setPostalCode(clean(r.postalCode()));v.setCreatedBy(actor);v.setStatus(VendorStatus.ACTIVE);
        return toResponse(vendors.save(v));
    }
    @Override @Transactional(readOnly=true) public List<VendorResponse> list(String email){
        User actor=activeUser(email);
        if(actor.getRoles().contains(com.medicontinuum.backend.user.enums.UserRole.PLATFORM_ADMIN))
            return vendors.findAll().stream().filter(v->v.getStatus()==VendorStatus.ACTIVE).map(this::toResponse).toList();
        List<UUID> orgIds=memberships.findByUser_IdAndStatusOrderByCreatedAtDesc(actor.getId(),OrganisationMemberStatus.ACTIVE).stream()
            .filter(m->allowedRole(m.getRole())&&m.getOrganisation().getStatus()==OrganisationStatus.ACTIVE)
            .map(m->m.getOrganisation().getId()).distinct().toList();
        if(orgIds.isEmpty())return List.of();
        return vendors.findByOrganisation_IdInAndStatusOrderByNameAsc(orgIds,VendorStatus.ACTIVE).stream().map(this::toResponse).toList();
    }
    @Override @Transactional(readOnly=true) public VendorResponse get(String email,UUID id){
        User actor=activeUser(email);Vendor v=vendor(id);requireManager(actor,v.getOrganisation());return toResponse(v);
    }
    @Override public VendorResponse update(String email,UUID id,VendorRequests.Update r){
        User actor=activeUser(email);Vendor v=vendor(id);requireManager(actor,v.getOrganisation());
        if(r.name()!=null){String name=r.name().trim();if(vendors.existsByOrganisation_IdAndNameIgnoreCaseAndIdNot(v.getOrganisation().getId(),name,id))throw conflict("Vendor name already exists for this organisation");v.setName(name);}
        if(r.registrationNumber()!=null)v.setRegistrationNumber(clean(r.registrationNumber()));
        if(r.contactPerson()!=null)v.setContactPerson(clean(r.contactPerson()));
        if(r.email()!=null)v.setEmail(normalizeOptionalEmail(r.email()));
        if(r.phoneNumber()!=null)v.setPhoneNumber(clean(r.phoneNumber()));
        if(r.address()!=null)v.setAddress(clean(r.address()));
        if(r.city()!=null)v.setCity(clean(r.city()));if(r.state()!=null)v.setState(clean(r.state()));if(r.country()!=null)v.setCountry(clean(r.country()));if(r.postalCode()!=null)v.setPostalCode(clean(r.postalCode()));
        if(r.status()!=null)v.setStatus(r.status());
        return toResponse(vendors.save(v));
    }
    @Override public void deactivate(String email,UUID id){
        User actor=activeUser(email);Vendor v=vendor(id);requireManager(actor,v.getOrganisation());
        if(v.getStatus()==VendorStatus.INACTIVE)throw conflict("Vendor is already inactive");
        v.setStatus(VendorStatus.INACTIVE);vendors.save(v);
    }
    private Organisation resolveOrganisation(User actor,UUID organisationId){
        if(organisationId!=null)return organisations.findById(organisationId).orElseThrow(()->notFound("Organisation not found"));
        if(actor.getRoles().contains(com.medicontinuum.backend.user.enums.UserRole.PLATFORM_ADMIN))throw badRequest("organisationId is required for platform administrators");
        List<Organisation> accessible=memberships.findByUser_IdAndStatusOrderByCreatedAtDesc(actor.getId(),OrganisationMemberStatus.ACTIVE).stream()
            .filter(m->allowedRole(m.getRole())&&m.getOrganisation().getStatus()==OrganisationStatus.ACTIVE)
            .map(m->m.getOrganisation()).distinct().toList();
        if(accessible.size()!=1)throw badRequest("Provide organisationId when you belong to zero or multiple organisations");
        return accessible.get(0);
    }
    private void requireManager(User actor,Organisation org){
        if(actor.getRoles().contains(com.medicontinuum.backend.user.enums.UserRole.PLATFORM_ADMIN))return;
        if(org.getStatus()!=OrganisationStatus.ACTIVE)throw conflict("Organisation is not active");
        OrganisationMembership membership=memberships.findByOrganisation_IdAndUser_Id(org.getId(),actor.getId())
            .filter(m->m.getStatus()==OrganisationMemberStatus.ACTIVE&&allowedRole(m.getRole()))
            .orElseThrow(()->forbidden("Active organisation procurement permission is required"));
    }
    private boolean allowedRole(OrganisationMemberRole r){return r==OrganisationMemberRole.OWNER||r==OrganisationMemberRole.ADMIN||r==OrganisationMemberRole.PHARMACIST||r==OrganisationMemberRole.STAFF;}
    private User activeUser(String email){return users.findByEmailIgnoreCase(email).filter(u->u.getStatus()==UserStatus.ACTIVE).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Authenticated user is unavailable"));}
    private Vendor vendor(UUID id){return vendors.findById(id).orElseThrow(()->notFound("Vendor not found"));}
    private VendorResponse toResponse(Vendor v){return new VendorResponse(v.getId(),v.getOrganisation().getId(),v.getName(),v.getRegistrationNumber(),v.getContactPerson(),v.getEmail(),v.getPhoneNumber(),v.getAddress(),v.getCity(),v.getState(),v.getCountry(),v.getPostalCode(),v.getStatus(),v.getCreatedAt(),v.getUpdatedAt());}
    private String clean(String s){return s==null||s.isBlank()?null:s.trim();}
    private String normalizeOptionalEmail(String s){return s==null||s.isBlank()?null:s.trim().toLowerCase(Locale.ROOT);}
    private ResponseStatusException notFound(String m){return new ResponseStatusException(HttpStatus.NOT_FOUND,m);}
    private ResponseStatusException forbidden(String m){return new ResponseStatusException(HttpStatus.FORBIDDEN,m);}
    private ResponseStatusException conflict(String m){return new ResponseStatusException(HttpStatus.CONFLICT,m);}
    private ResponseStatusException badRequest(String m){return new ResponseStatusException(HttpStatus.BAD_REQUEST,m);}
}
