package com.medicontinuum.backend.appointment.service;
import java.time.LocalDate;
import java.util.*;
import com.medicontinuum.backend.appointment.dto.*;
import com.medicontinuum.backend.appointment.enums.AppointmentStatus;
public interface AppointmentService{
    AppointmentResponse create(String email,AppointmentRequests.Create request);
    List<AppointmentResponse> list(String email,UUID patientId,UUID doctorId,AppointmentStatus status,LocalDate fromDate,LocalDate toDate);
    AppointmentResponse get(String email,UUID appointmentId);
    AppointmentResponse update(String email,UUID appointmentId,AppointmentRequests.Update request);
    AppointmentResponse updateStatus(String email,UUID appointmentId,AppointmentRequests.Status request);
    void cancel(String email,UUID appointmentId);
}
