package com.medicontinuum.backend.doctor.controller;

import java.util.List;
import java.util.UUID;
import com.medicontinuum.backend.doctor.dto.*;
import com.medicontinuum.backend.doctor.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/doctors") @RequiredArgsConstructor
public class DoctorController {
    private final DoctorService service;
    @PostMapping("/me") @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<DoctorResponse> create(Authentication a,@Valid @RequestBody DoctorRequests.Create r){return ResponseEntity.status(HttpStatus.CREATED).body(service.createMyProfile(a.getName(),r));}
    @GetMapping("/me") @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<DoctorResponse> me(Authentication a){return ResponseEntity.ok(service.getMyProfile(a.getName()));}
    @PutMapping("/me") @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<DoctorResponse> update(Authentication a,@Valid @RequestBody DoctorRequests.Update r){return ResponseEntity.ok(service.updateMyProfile(a.getName(),r));}
    @GetMapping @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DoctorResponse>> search(@RequestParam(required=false) String speciality,@RequestParam(required=false) String city){return ResponseEntity.ok(service.search(speciality,city));}
    @GetMapping("/{doctorId}") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DoctorResponse> get(@PathVariable UUID doctorId){return ResponseEntity.ok(service.getById(doctorId));}
    @PatchMapping("/{doctorId}/status") @PreAuthorize("hasAuthority('PLATFORM_ADMIN')")
    public ResponseEntity<DoctorResponse> status(@PathVariable UUID doctorId,@Valid @RequestBody DoctorRequests.Status r){return ResponseEntity.ok(service.updateStatus(doctorId,r));}
}
