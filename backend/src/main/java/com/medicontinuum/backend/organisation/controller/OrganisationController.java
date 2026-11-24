package com.medicontinuum.backend.organisation.controller;

import java.util.*;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.medicontinuum.backend.organisation.dto.OrganisationRequests;
import com.medicontinuum.backend.organisation.dto.OrganisationResponses;
import com.medicontinuum.backend.organisation.service.OrganisationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController @RequestMapping("/api/organisations") @RequiredArgsConstructor
public class OrganisationController {
    private final OrganisationService service;

    @PostMapping @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrganisationResponses.Organisation> create(@Valid @RequestBody OrganisationRequests.Create request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(auth.getName(),request));
    }
    @GetMapping("/me") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrganisationResponses.Organisation>> mine(Authentication auth) { return ResponseEntity.ok(service.mine(auth.getName())); }
    @GetMapping("/{organisationId}") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrganisationResponses.Organisation> get(@PathVariable UUID organisationId,Authentication auth) { return ResponseEntity.ok(service.get(auth.getName(),organisationId)); }
    @PatchMapping("/{organisationId}") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrganisationResponses.Organisation> update(@PathVariable UUID organisationId,@Valid @RequestBody OrganisationRequests.Update request,Authentication auth) { return ResponseEntity.ok(service.update(auth.getName(),organisationId,request)); }
    @PatchMapping("/{organisationId}/status") @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<OrganisationResponses.Organisation> updateStatus(@PathVariable UUID organisationId,@Valid @RequestBody OrganisationRequests.Status request) { return ResponseEntity.ok(service.updateStatus(organisationId,request)); }

    @GetMapping("/{organisationId}/members") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrganisationResponses.Member>> members(@PathVariable UUID organisationId,Authentication auth) { return ResponseEntity.ok(service.members(auth.getName(),organisationId)); }
    @PostMapping("/{organisationId}/members") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrganisationResponses.Member> addMember(@PathVariable UUID organisationId,@Valid @RequestBody OrganisationRequests.AddMember request,Authentication auth) { return ResponseEntity.status(HttpStatus.CREATED).body(service.addMember(auth.getName(),organisationId,request)); }
    @PatchMapping("/{organisationId}/members/{membershipId}") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrganisationResponses.Member> updateMemberRole(@PathVariable UUID organisationId,@PathVariable UUID membershipId,@Valid @RequestBody OrganisationRequests.MemberRole request,Authentication auth) { return ResponseEntity.ok(service.updateMemberRole(auth.getName(),organisationId,membershipId,request)); }
    @DeleteMapping("/{organisationId}/members/{membershipId}") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> removeMember(@PathVariable UUID organisationId,@PathVariable UUID membershipId,Authentication auth) { service.removeMember(auth.getName(),organisationId,membershipId); return ResponseEntity.noContent().build(); }

    @GetMapping("/{organisationId}/patients") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrganisationResponses.Patient>> patients(@PathVariable UUID organisationId,Authentication auth) { return ResponseEntity.ok(service.patients(auth.getName(),organisationId)); }
    @PostMapping("/{organisationId}/patients") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrganisationResponses.Patient> addPatient(@PathVariable UUID organisationId,@Valid @RequestBody OrganisationRequests.AddPatient request,Authentication auth) { return ResponseEntity.status(HttpStatus.CREATED).body(service.addPatient(auth.getName(),organisationId,request)); }
    @DeleteMapping("/{organisationId}/patients/{patientId}") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> removePatient(@PathVariable UUID organisationId,@PathVariable UUID patientId,Authentication auth) { service.removePatient(auth.getName(),organisationId,patientId); return ResponseEntity.noContent().build(); }

    @GetMapping("/{organisationId}/dashboard") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OrganisationResponses.Dashboard> dashboard(@PathVariable UUID organisationId,Authentication auth) { return ResponseEntity.ok(service.dashboard(auth.getName(),organisationId)); }
}
