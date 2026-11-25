package com.medicontinuum.backend.appointment.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import com.medicontinuum.backend.appointment.dto.*;
import com.medicontinuum.backend.appointment.enums.AppointmentStatus;
import com.medicontinuum.backend.appointment.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/appointments") @RequiredArgsConstructor
public class AppointmentController{
    private final AppointmentService service;
    @PostMapping @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AppointmentResponse> create(Authentication a,@Valid @RequestBody AppointmentRequests.Create r){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(a.getName(),r));}
    @GetMapping @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AppointmentResponse>> list(Authentication a,@RequestParam(required=false) UUID patientId,@RequestParam(required=false) UUID doctorId,@RequestParam(required=false) AppointmentStatus status,@RequestParam(required=false) LocalDate fromDate,@RequestParam(required=false) LocalDate toDate){return ResponseEntity.ok(service.list(a.getName(),patientId,doctorId,status,fromDate,toDate));}
    @GetMapping("/{appointmentId}") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AppointmentResponse> get(Authentication a,@PathVariable UUID appointmentId){return ResponseEntity.ok(service.get(a.getName(),appointmentId));}
    @PutMapping("/{appointmentId}") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AppointmentResponse> update(Authentication a,@PathVariable UUID appointmentId,@Valid @RequestBody AppointmentRequests.Update r){return ResponseEntity.ok(service.update(a.getName(),appointmentId,r));}
    @PatchMapping("/{appointmentId}/status") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AppointmentResponse> status(Authentication a,@PathVariable UUID appointmentId,@Valid @RequestBody AppointmentRequests.Status r){return ResponseEntity.ok(service.updateStatus(a.getName(),appointmentId,r));}
    @PatchMapping("/{appointmentId}/cancel") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> cancel(Authentication a,@PathVariable UUID appointmentId){service.cancel(a.getName(),appointmentId);return ResponseEntity.noContent().build();}
}
