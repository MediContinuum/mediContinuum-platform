package com.medicontinuum.backend.vendor.controller;

import java.util.List;
import java.util.UUID;
import com.medicontinuum.backend.vendor.dto.*;
import com.medicontinuum.backend.vendor.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/vendors") @RequiredArgsConstructor
public class VendorController {
    private final VendorService service;
    @PostMapping @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VendorResponse> create(Authentication a,@Valid @RequestBody VendorRequests.Create r){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(a.getName(),r));}
    @GetMapping @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<VendorResponse>> list(Authentication a){return ResponseEntity.ok(service.list(a.getName()));}
    @GetMapping("/{vendorId}") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VendorResponse> get(Authentication a,@PathVariable UUID vendorId){return ResponseEntity.ok(service.get(a.getName(),vendorId));}
    @PutMapping("/{vendorId}") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VendorResponse> update(Authentication a,@PathVariable UUID vendorId,@Valid @RequestBody VendorRequests.Update r){return ResponseEntity.ok(service.update(a.getName(),vendorId,r));}
    @DeleteMapping("/{vendorId}") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(Authentication a,@PathVariable UUID vendorId){service.deactivate(a.getName(),vendorId);return ResponseEntity.noContent().build();}
}
