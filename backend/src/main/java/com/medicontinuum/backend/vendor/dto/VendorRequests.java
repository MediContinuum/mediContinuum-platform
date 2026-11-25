package com.medicontinuum.backend.vendor.dto;
import java.util.UUID;
import com.medicontinuum.backend.vendor.enums.VendorStatus;
import jakarta.validation.constraints.*;
public final class VendorRequests {
    private VendorRequests(){}
    public record Create(
        UUID organisationId,
        @NotBlank @Size(max=150) String name,
        @Size(max=100) String registrationNumber,
        @Size(max=100) String contactPerson,
        @Email @Size(max=150) String email,
        @Pattern(regexp="^[+0-9() .-]{7,25}$") String phoneNumber,
        @Size(max=255) String address,
        @Size(max=100) String city,
        @Size(max=100) String state,
        @Size(max=100) String country,
        @Size(max=20) String postalCode
    ){}
    public record Update(
        @Size(min=2,max=150) String name,
        @Size(max=100) String registrationNumber,
        @Size(max=100) String contactPerson,
        @Email @Size(max=150) String email,
        @Pattern(regexp="^[+0-9() .-]{7,25}$") String phoneNumber,
        @Size(max=255) String address,
        @Size(max=100) String city,
        @Size(max=100) String state,
        @Size(max=100) String country,
        @Size(max=20) String postalCode,
        VendorStatus status
    ){}
}
