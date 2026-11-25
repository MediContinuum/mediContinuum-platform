package com.medicontinuum.backend.doctor.service;
import java.util.List;
import java.util.UUID;
import com.medicontinuum.backend.doctor.dto.*;
public interface DoctorService {
    DoctorResponse createMyProfile(String email, DoctorRequests.Create request);
    DoctorResponse getMyProfile(String email);
    DoctorResponse updateMyProfile(String email, DoctorRequests.Update request);
    List<DoctorResponse> search(String speciality, String city);
    DoctorResponse getById(UUID doctorId);
    DoctorResponse updateStatus(UUID doctorId, DoctorRequests.Status request);
}
