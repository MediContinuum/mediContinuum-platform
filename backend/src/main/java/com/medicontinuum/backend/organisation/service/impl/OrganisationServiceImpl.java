package com.medicontinuum.backend.organisation.service.impl;

import java.util.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.medicontinuum.backend.organisation.dto.*;
import com.medicontinuum.backend.organisation.entity.*;
import com.medicontinuum.backend.organisation.enums.*;
import com.medicontinuum.backend.organisation.mapper.OrganisationMapper;
import com.medicontinuum.backend.organisation.repository.*;
import com.medicontinuum.backend.organisation.service.OrganisationService;
import com.medicontinuum.backend.patient.entity.Patient;
import com.medicontinuum.backend.patient.repository.PatientRepository;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.enums.*;
import com.medicontinuum.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor @Transactional
public class OrganisationServiceImpl implements OrganisationService {
    private final OrganisationRepository organisations;
    private final OrganisationMembershipRepository memberships;
    private final OrganisationPatientRepository organisationPatients;
    private final UserRepository users;
    private final PatientRepository patients;
    private final OrganisationMapper mapper;

    @Override public OrganisationResponses.Organisation create(String email, OrganisationRequests.Create r) {
        User creator=activeUser(email);
        if(!platformAdmin(creator) && !creator.getRoles().contains(UserRole.ORGANISATION_ADMIN)) throw forbidden("ORGANISATION_ADMIN or PLATFORM_ADMIN is required to register an organisation");
        String registration=clean(r.registrationNumber());
        if(registration!=null && organisations.existsByRegistrationNumberIgnoreCase(registration)) throw conflict("Registration number is already in use");
        Organisation o=new Organisation(); o.setName(r.name().trim()); o.setRegistrationNumber(registration); o.setType(r.type()); o.setStatus(OrganisationStatus.PENDING_VERIFICATION);
        o.setContactEmail(clean(r.contactEmail())); o.setContactPhone(clean(r.contactPhone())); o.setWebsite(clean(r.website())); o.setAddressLine(clean(r.addressLine()));
        o.setCity(clean(r.city())); o.setState(clean(r.state())); o.setCountry(clean(r.country())); o.setPostalCode(clean(r.postalCode())); o.setCreatedBy(creator);
        try {
            Organisation saved=organisations.saveAndFlush(o);
            OrganisationMembership owner=new OrganisationMembership(); owner.setOrganisation(saved); owner.setUser(creator); owner.setRole(OrganisationMemberRole.OWNER); owner.setStatus(OrganisationMemberStatus.ACTIVE); memberships.save(owner);
            return mapper.toOrganisation(saved);
        } catch(DataIntegrityViolationException ex) { throw conflict("Organisation registration number is already in use"); }
    }

    @Override @Transactional(readOnly=true) public List<OrganisationResponses.Organisation> mine(String email) {
        User user=activeUser(email);
        return memberships.findByUser_IdAndStatusOrderByCreatedAtDesc(user.getId(),OrganisationMemberStatus.ACTIVE).stream().map(OrganisationMembership::getOrganisation).map(mapper::toOrganisation).toList();
    }
    @Override @Transactional(readOnly=true) public OrganisationResponses.Organisation get(String email, UUID id) {
        User actor=activeUser(email); Organisation o=organisation(id); requireAccess(actor,id); return mapper.toOrganisation(o);
    }
    @Override public OrganisationResponses.Organisation update(String email, UUID id, OrganisationRequests.Update r) {
        User actor=activeUser(email); Organisation o=organisation(id); requireAdmin(actor,id);
        if(r.name()!=null)o.setName(r.name().trim());
        if(r.registrationNumber()!=null){String v=clean(r.registrationNumber()); if(v!=null&&organisations.existsByRegistrationNumberIgnoreCaseAndIdNot(v,id))throw conflict("Registration number is already in use"); o.setRegistrationNumber(v);}
        if(r.type()!=null)o.setType(r.type()); if(r.contactEmail()!=null)o.setContactEmail(clean(r.contactEmail())); if(r.contactPhone()!=null)o.setContactPhone(clean(r.contactPhone()));
        if(r.website()!=null)o.setWebsite(clean(r.website())); if(r.addressLine()!=null)o.setAddressLine(clean(r.addressLine())); if(r.city()!=null)o.setCity(clean(r.city())); if(r.state()!=null)o.setState(clean(r.state())); if(r.country()!=null)o.setCountry(clean(r.country())); if(r.postalCode()!=null)o.setPostalCode(clean(r.postalCode()));
        return mapper.toOrganisation(organisations.save(o));
    }
    @Override public OrganisationResponses.Organisation updateStatus(UUID id, OrganisationRequests.Status r) { Organisation o=organisation(id); o.setStatus(r.status()); return mapper.toOrganisation(organisations.save(o)); }

    @Override @Transactional(readOnly=true) public List<OrganisationResponses.Member> members(String email, UUID id) {
        User actor=activeUser(email); organisation(id); requireAccess(actor,id);
        return memberships.findByOrganisation_IdAndStatusOrderByCreatedAtAsc(id,OrganisationMemberStatus.ACTIVE).stream().map(mapper::toMember).toList();
    }
    @Override public OrganisationResponses.Member addMember(String email, UUID id, OrganisationRequests.AddMember r) {
        User actor=activeUser(email); Organisation org=organisation(id); requireAdmin(actor,id); activeOrganisation(org);
        if(r.role()==OrganisationMemberRole.OWNER)throw badRequest("OWNER is assigned only during organisation creation");
        if(r.role()==OrganisationMemberRole.ADMIN)requireOwner(actor,id);
        User target=users.findByGlobalUserId(r.globalUserId()).orElseThrow(()->notFound("User not found for Global MediContinuum ID"));
        if(target.getStatus()!=UserStatus.ACTIVE)throw conflict("Inactive users cannot be added"); validateRole(target,r.role());
        OrganisationMembership m=memberships.findByOrganisation_IdAndUser_Id(id,target.getId()).orElseGet(OrganisationMembership::new);
        if(m.getId()!=null && m.getStatus()!=OrganisationMemberStatus.REMOVED)throw conflict("User is already a member");
        m.setOrganisation(org);m.setUser(target);m.setRole(r.role());m.setStatus(OrganisationMemberStatus.ACTIVE);
        try{return mapper.toMember(memberships.saveAndFlush(m));}catch(DataIntegrityViolationException ex){throw conflict("User is already a member");}
    }
    @Override public OrganisationResponses.Member updateMemberRole(String email, UUID id, UUID membershipId, OrganisationRequests.MemberRole r) {
        User actor=activeUser(email);requireAdmin(actor,id); if(r.role()==OrganisationMemberRole.OWNER)throw badRequest("Ownership transfer must use a separate workflow");
        OrganisationMembership target=activeMembership(id,membershipId); if(target.getRole()==OrganisationMemberRole.OWNER)throw conflict("Owner role cannot be changed here");
        if(r.role()==OrganisationMemberRole.ADMIN||target.getRole()==OrganisationMemberRole.ADMIN)requireOwner(actor,id);
        validateRole(target.getUser(),r.role());target.setRole(r.role());return mapper.toMember(memberships.save(target));
    }
    @Override public void removeMember(String email, UUID id, UUID membershipId) {
        User actor=activeUser(email);requireAdmin(actor,id);OrganisationMembership target=activeMembership(id,membershipId);
        if(target.getRole()==OrganisationMemberRole.OWNER)throw conflict("Organisation owner cannot be removed"); if(target.getRole()==OrganisationMemberRole.ADMIN)requireOwner(actor,id);
        target.setStatus(OrganisationMemberStatus.REMOVED);memberships.save(target);
    }

    @Override @Transactional(readOnly=true) public List<OrganisationResponses.Patient> patients(String email, UUID id) {
        User actor=activeUser(email);organisation(id);requireAccess(actor,id);
        return organisationPatients.findByOrganisation_IdAndStatusOrderByCreatedAtDesc(id,OrganisationPatientStatus.ACTIVE).stream().map(mapper::toPatient).toList();
    }
    @Override public OrganisationResponses.Patient addPatient(String email, UUID id, OrganisationRequests.AddPatient r) {
        User actor=activeUser(email);Organisation org=organisation(id);requireAdmin(actor,id);activeOrganisation(org);
        Patient patient=patients.findById(r.patientId()).orElseThrow(()->notFound("Patient not found"));
        if(patient.getUser().getStatus()!=UserStatus.ACTIVE)throw conflict("Inactive patient cannot be linked");
        OrganisationPatient link=organisationPatients.findByOrganisation_IdAndPatient_Id(id,patient.getId()).orElseGet(OrganisationPatient::new);
        if(link.getId()!=null&&link.getStatus()==OrganisationPatientStatus.ACTIVE)throw conflict("Patient is already linked");
        link.setOrganisation(org);link.setPatient(patient);link.setAssignedBy(actor);link.setStatus(OrganisationPatientStatus.ACTIVE);
        try{return mapper.toPatient(organisationPatients.saveAndFlush(link));}catch(DataIntegrityViolationException ex){throw conflict("Patient is already linked");}
    }
    @Override public void removePatient(String email, UUID id, UUID patientId) {
        User actor=activeUser(email);requireAdmin(actor,id);
        OrganisationPatient link=organisationPatients.findByOrganisation_IdAndPatient_Id(id,patientId).orElseThrow(()->notFound("Patient link not found"));
        if(link.getStatus()==OrganisationPatientStatus.INACTIVE)throw conflict("Patient is already unlinked");link.setStatus(OrganisationPatientStatus.INACTIVE);organisationPatients.save(link);
    }
    @Override @Transactional(readOnly=true) public OrganisationResponses.Dashboard dashboard(String email, UUID id) {
        User actor=activeUser(email);Organisation o=organisation(id);requireAccess(actor,id);
        var ms=OrganisationMemberStatus.ACTIVE;var ps=OrganisationPatientStatus.ACTIVE;
        return new OrganisationResponses.Dashboard(o.getId(),o.getName(),o.getType(),o.getStatus(),memberships.countByOrganisation_IdAndStatus(id,ms),memberships.countByOrganisation_IdAndRoleAndStatus(id,OrganisationMemberRole.DOCTOR,ms),memberships.countByOrganisation_IdAndRoleAndStatus(id,OrganisationMemberRole.NURSE,ms),memberships.countByOrganisation_IdAndRoleAndStatus(id,OrganisationMemberRole.PHARMACIST,ms),organisationPatients.countByOrganisation_IdAndStatus(id,ps));
    }

    private User activeUser(String email) {
        if(email==null||email.isBlank())throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Authenticated email is missing");
        User u=users.findByEmailIgnoreCase(email).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Authenticated user not found"));
        if(u.getStatus()!=UserStatus.ACTIVE)throw forbidden("Inactive users cannot access organisation resources");return u;
    }
    private Organisation organisation(UUID id){return organisations.findById(id).orElseThrow(()->notFound("Organisation not found"));}
    private OrganisationMembership activeMembership(UUID orgId,UUID memberId){return memberships.findByIdAndOrganisation_Id(memberId,orgId).filter(m->m.getStatus()==OrganisationMemberStatus.ACTIVE).orElseThrow(()->notFound("Active membership not found"));}
    private OrganisationMembership accessMembership(User actor,UUID orgId){if(platformAdmin(actor))return null;return memberships.findByOrganisation_IdAndUser_Id(orgId,actor.getId()).filter(m->m.getStatus()==OrganisationMemberStatus.ACTIVE).orElseThrow(()->forbidden("You are not an active member of this organisation"));}
    private void requireAccess(User actor,UUID orgId){accessMembership(actor,orgId);}
    private void requireAdmin(User actor,UUID orgId){OrganisationMembership m=accessMembership(actor,orgId);if(m!=null&&m.getRole()!=OrganisationMemberRole.OWNER&&m.getRole()!=OrganisationMemberRole.ADMIN)throw forbidden("Organisation owner or admin permission is required");}
    private void requireOwner(User actor,UUID orgId){OrganisationMembership m=accessMembership(actor,orgId);if(m!=null&&m.getRole()!=OrganisationMemberRole.OWNER)throw forbidden("Only owner or platform admin can manage organisation admins");}
    private boolean platformAdmin(User u){return u.getRoles()!=null&&u.getRoles().contains(UserRole.PLATFORM_ADMIN);}
    private void activeOrganisation(Organisation o){if(o.getStatus()!=OrganisationStatus.ACTIVE)throw conflict("Organisation must be ACTIVE before members or patients can be added");}
    private void validateRole(User u,OrganisationMemberRole role){UserRole required=switch(role){case ADMIN->UserRole.ORGANISATION_ADMIN;case DOCTOR->UserRole.DOCTOR;case NURSE->UserRole.NURSE;case PHARMACIST->UserRole.PHARMACIST;case OWNER,STAFF,VIEWER->null;};if(required!=null&&(u.getRoles()==null||!u.getRoles().contains(required)))throw badRequest("User does not have required platform role: "+required);}
    private String clean(String s){return s==null||s.isBlank()?null:s.trim();}
    private ResponseStatusException notFound(String m){return new ResponseStatusException(HttpStatus.NOT_FOUND,m);}
    private ResponseStatusException conflict(String m){return new ResponseStatusException(HttpStatus.CONFLICT,m);}
    private ResponseStatusException forbidden(String m){return new ResponseStatusException(HttpStatus.FORBIDDEN,m);}
    private ResponseStatusException badRequest(String m){return new ResponseStatusException(HttpStatus.BAD_REQUEST,m);}
}
