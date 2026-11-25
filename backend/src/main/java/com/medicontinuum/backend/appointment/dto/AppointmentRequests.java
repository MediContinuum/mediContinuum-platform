package com.medicontinuum.backend.appointment.dto;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;
import com.medicontinuum.backend.appointment.enums.*;
import jakarta.validation.constraints.*;
public final class AppointmentRequests {
    private AppointmentRequests(){}
    public record Create(
        @NotNull UUID patientId,
        @NotNull UUID doctorId,
        UUID organisationId,
        @NotNull LocalDate appointmentDate,
        @NotNull LocalTime startTime,
        @NotNull LocalTime endTime,
        @Size(max=500) String reason,
        AppointmentType type
    ){}
    public record Update(
        LocalDate appointmentDate,
        LocalTime startTime,
        LocalTime endTime,
        @Size(max=500) String reason,
        @Size(max=2000) String notes,
        AppointmentType type
    ){}
    public record Status(@NotNull AppointmentStatus status){}
}
