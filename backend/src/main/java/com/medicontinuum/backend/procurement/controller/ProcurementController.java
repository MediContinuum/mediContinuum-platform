package com.medicontinuum.backend.procurement.controller;

import java.util.List;
import java.util.UUID;
import com.medicontinuum.backend.procurement.dto.*;
import com.medicontinuum.backend.procurement.service.ProcurementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/procurement/orders") @RequiredArgsConstructor
public class ProcurementController{
    private final ProcurementService service;
    @PostMapping @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProcurementResponse> create(Authentication a,@Valid @RequestBody ProcurementRequests.Create r){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(a.getName(),r));}
    @GetMapping @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ProcurementResponse>> list(Authentication a){return ResponseEntity.ok(service.list(a.getName()));}
    @GetMapping("/{orderId}") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProcurementResponse> get(Authentication a,@PathVariable UUID orderId){return ResponseEntity.ok(service.get(a.getName(),orderId));}
    @PatchMapping("/{orderId}/status") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProcurementResponse> status(Authentication a,@PathVariable UUID orderId,@Valid @RequestBody ProcurementRequests.UpdateStatus r){return ResponseEntity.ok(service.updateStatus(a.getName(),orderId,r));}
    @PatchMapping("/{orderId}/cancel") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> cancel(Authentication a,@PathVariable UUID orderId){service.cancel(a.getName(),orderId);return ResponseEntity.noContent().build();}
    @PostMapping("/{orderId}/receive") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProcurementResponse> receive(Authentication a,@PathVariable UUID orderId,@Valid @RequestBody ProcurementRequests.Receive r){return ResponseEntity.ok(service.receive(a.getName(),orderId,r));}
}
