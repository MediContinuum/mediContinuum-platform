package com.medicontinuum.backend.doctor.service.impl;

import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.medicontinuum.backend.doctor.dto.*;
import com.medicontinuum.backend.doctor.entity.Doctor;
import com.medicontinuum.backend.doctor.enums.DoctorStatus;
import com.medicontinuum.backend.doctor.repository.DoctorRepository;
import com.medicontinuum.backend.doctor.service.DoctorService;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.enums.UserRole;
import com.medicontinuum.backend.user.enums.UserStatus;
import com.medicontinuum.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor @Transactional
public class DoctorServiceImpl implements DoctorService {
    private final DoctorRepository doctors;
    private final UserRepository users;

    @Override
    public DoctorResponse createMyProfile(String email, DoctorRequests.Create r) {
        User user=activeUser(email);
        if(!user.getRoles().contains(UserRole.DOCTOR)) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"A DOCTOR role is required");
        if(doctors.findByUser_Id(user.getId()).isPresent()) throw new ResponseStatusException(HttpStatus.CONFLICT,"Doctor profile already exists");
        if(doctors.existsByLicenseNumberIgnoreCase(r.licenseNumber().trim())) throw new ResponseStatusException(HttpStatus.CONFLICT,"License number is already registered");
        Doctor d=new Doctor(); d.setUser(user); d.setSpeciality(r.speciality().trim()); d.setLicenseNumber(r.licenseNumber().trim());
        d.setQualification(clean(r.qualification()));d.setYearsExperience(r.yearsExperience());d.setConsultationFee(r.consultationFee());
        d.setBio(clean(r.bio()));d.setCity(clean(r.city()));d.setState(clean(r.state()));d.setStatus(DoctorStatus.ACTIVE);
        return toResponse(doctors.save(d));
    }
    @Override @Transactional(readOnly=true)
    public DoctorResponse getMyProfile(String email) {
        User user=activeUser(email);
        return doctors.findByUser_Id(user.getId()).map(this::toResponse)
            .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Doctor profile not found"));
    }
    @Override
    public DoctorResponse updateMyProfile(String email, DoctorRequests.Update r) {
        User user=activeUser(email);
        Doctor d=doctors.findByUser_Id(user.getId()).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Doctor profile not found"));
        if(r.speciality()!=null)d.setSpeciality(r.speciality().trim());
        if(r.qualification()!=null)d.setQualification(clean(r.qualification()));
        if(r.yearsExperience()!=null)d.setYearsExperience(r.yearsExperience());
        if(r.consultationFee()!=null)d.setConsultationFee(r.consultationFee());
        if(r.bio()!=null)d.setBio(clean(r.bio()));
        if(r.city()!=null)d.setCity(clean(r.city()));
        if(r.state()!=null)d.setState(clean(r.state()));
        return toResponse(doctors.save(d));
    }
    @Override @Transactional(readOnly=true)
    public List<DoctorResponse> search(String speciality,String city) {
        return doctors.searchActive(DoctorStatus.ACTIVE,clean(speciality),clean(city)).stream().map(this::toResponse).toList();
    }
    @Override @Transactional(readOnly=true)
    public DoctorResponse getById(UUID id) {
        return doctors.findById(id).filter(d->d.getStatus()==DoctorStatus.ACTIVE).map(this::toResponse)
            .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Active doctor profile not found"));
    }
    @Override
    public DoctorResponse updateStatus(UUID id,DoctorRequests.Status r) {
        Doctor d=doctors.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Doctor profile not found"));
        d.setStatus(r.status());return toResponse(doctors.save(d));
    }
    private User activeUser(String email) {
        return users.findByEmailIgnoreCase(email).filter(u->u.getStatus()==UserStatus.ACTIVE)
            .orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Authenticated user is unavailable"));
    }
    private DoctorResponse toResponse(Doctor d) {
        User u=d.getUser();
        return new DoctorResponse(d.getId(),u.getId(),u.getGlobalUserId(),u.getFullName(),u.getEmail(),u.getPhoneNumber(),d.getSpeciality(),d.getLicenseNumber(),d.getQualification(),d.getYearsExperience(),d.getConsultationFee(),d.getBio(),d.getCity(),d.getState(),d.getStatus(),d.getCreatedAt(),d.getUpdatedAt());
    }
    private String clean(String s){return s==null||s.isBlank()?null:s.trim();}
}
