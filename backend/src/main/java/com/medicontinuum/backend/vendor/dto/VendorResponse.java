package com.medicontinuum.backend.vendor.dto;
import java.time.LocalDateTime;
import java.util.UUID;
import com.medicontinuum.backend.vendor.enums.VendorStatus;
public record VendorResponse(
    UUID id, UUID organisationId, String name, String registrationNumber,
    String contactPerson, String email, String phoneNumber, String address,
    String city, String state, String country, String postalCode,
    VendorStatus status, LocalDateTime createdAt, LocalDateTime updatedAt
){}
