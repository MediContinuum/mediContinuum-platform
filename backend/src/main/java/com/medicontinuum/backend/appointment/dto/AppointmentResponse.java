package com.medicontinuum.backend.appointment.dto;
import java.time.*;
import java.util.UUID;
import com.medicontinuum.backend.appointment.enums.*;
public record AppointmentResponse(
    UUID id,UUID patientId,String patientName,UUID doctorId,String doctorName,
    UUID organisationId,String organisationName,LocalDate appointmentDate,
    LocalTime startTime,LocalTime endTime,String reason,String notes,
    AppointmentStatus status,AppointmentType type,LocalDateTime createdAt,LocalDateTime updatedAt
){}
