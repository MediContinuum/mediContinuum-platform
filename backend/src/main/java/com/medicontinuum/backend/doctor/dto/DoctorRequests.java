package com.medicontinuum.backend.doctor.dto;

import java.math.BigDecimal;
import com.medicontinuum.backend.doctor.enums.DoctorStatus;
import jakarta.validation.constraints.*;

public final class DoctorRequests {
    private DoctorRequests() {}
    public record Create(
        @NotBlank @Size(max=120) String speciality,
        @NotBlank @Size(max=100) String licenseNumber,
        @Size(max=200) String qualification,
        @Min(0) @Max(70) int yearsExperience,
        @DecimalMin("0.00") BigDecimal consultationFee,
        @Size(max=2000) String bio,
        @Size(max=100) String city,
        @Size(max=100) String state
    ) {}
    public record Update(
        @Size(min=2,max=120) String speciality,
        @Size(max=200) String qualification,
        @Min(0) @Max(70) Integer yearsExperience,
        @DecimalMin("0.00") BigDecimal consultationFee,
        @Size(max=2000) String bio,
        @Size(max=100) String city,
        @Size(max=100) String state
    ) {}
    public record Status(@NotNull DoctorStatus status) {}
}
