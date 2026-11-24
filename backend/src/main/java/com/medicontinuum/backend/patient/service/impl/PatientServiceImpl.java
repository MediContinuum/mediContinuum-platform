
package com.medicontinuum.backend.patient.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.medicontinuum.backend.patient.dto.CreatePatientRequest;
import com.medicontinuum.backend.patient.dto.PatientResponse;
import com.medicontinuum.backend.patient.dto.UpdatePatientRequest;
import com.medicontinuum.backend.patient.entity.Patient;
import com.medicontinuum.backend.patient.exception.PatientNotFoundException;
import com.medicontinuum.backend.patient.mapper.PatientMapper;
import com.medicontinuum.backend.patient.repository.PatientRepository;
import com.medicontinuum.backend.patient.service.PatientService;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.enums.UserRole;
import com.medicontinuum.backend.user.enums.UserStatus;
import com.medicontinuum.backend.user.exception.UserNotFoundException;
import com.medicontinuum.backend.user.repository.UserRepository;

@Service
@Transactional
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final PatientMapper patientMapper;

    public PatientServiceImpl(
            PatientRepository patientRepository,
            UserRepository userRepository,
            PatientMapper patientMapper
    ) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.patientMapper = patientMapper;
    }

    // Create a patient profile for an existing user.
    @Override
    public PatientResponse createPatient(CreatePatientRequest request) {

        User user = userRepository
                .findByGlobalUserId(request.globalUserId())
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found with Global ID: "
                                        + request.globalUserId()
                        )
                );

        // Prevent profile creation for inactive users.
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot create a patient profile for an inactive user"
            );
        }

        // A user can have only one patient profile.
        if (patientRepository.existsByUser_Id(user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Patient profile already exists for this user"
            );
        }

        Patient patient = new Patient();

        patient.setUser(user);
        patient.setDateOfBirth(request.dateOfBirth());
        patient.setGender(request.gender());
        patient.setBloodGroup(request.bloodGroup());
        patient.setAddressLine(request.addressLine());
        patient.setCity(request.city());
        patient.setState(request.state());
        patient.setCountry(request.country());
        patient.setPostalCode(request.postalCode());
        patient.setEmergencyContactName(request.emergencyContactName());
        patient.setEmergencyContactPhone(request.emergencyContactPhone());

        // Preserve existing roles and add PATIENT.
        user.getRoles().add(UserRole.PATIENT);

        Patient savedPatient = patientRepository.save(patient);

        return patientMapper.toResponse(savedPatient);
    }

    // Get all patient profiles.
    @Override
    @Transactional(readOnly = true)
    public List<PatientResponse> getAllPatients() {

        return patientRepository.findAll()
                .stream()
                .map(patientMapper::toResponse)
                .toList();
    }

    // Get patient by internal UUID.
    @Override
    @Transactional(readOnly = true)
    public PatientResponse getPatientById(UUID patientId) {

        Patient patient = findPatientById(patientId);

        return patientMapper.toResponse(patient);
    }

    // Get patient by Global MediContinuum ID.
    @Override
    @Transactional(readOnly = true)
    public PatientResponse getPatientByGlobalUserId(String globalUserId) {

        Patient patient = patientRepository
                .findByUser_GlobalUserId(globalUserId)
                .orElseThrow(() ->
                        new PatientNotFoundException(
                                "Patient profile not found for Global ID: "
                                        + globalUserId
                        )
                );

        return patientMapper.toResponse(patient);
    }

    // Update patient profile.
    @Override
    public PatientResponse updatePatient(
            UUID patientId,
            UpdatePatientRequest request
    ) {

        Patient patient = findPatientById(patientId);

        patient.setDateOfBirth(request.dateOfBirth());
        patient.setGender(request.gender());
        patient.setBloodGroup(request.bloodGroup());
        patient.setAddressLine(request.addressLine());
        patient.setCity(request.city());
        patient.setState(request.state());
        patient.setCountry(request.country());
        patient.setPostalCode(request.postalCode());
        patient.setEmergencyContactName(request.emergencyContactName());
        patient.setEmergencyContactPhone(request.emergencyContactPhone());

        Patient updatedPatient = patientRepository.save(patient);

        return patientMapper.toResponse(updatedPatient);
    }

    // Delete patient profile without deleting the User account.
    @Override
    public void deletePatientProfile(UUID patientId) {

        Patient patient = findPatientById(patientId);

        User user = patient.getUser();

        // Remove PATIENT role while preserving other roles.
        user.getRoles().remove(UserRole.PATIENT);

        patientRepository.delete(patient);
    }

    // Reusable patient lookup method.
    private Patient findPatientById(UUID patientId) {

        return patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new PatientNotFoundException(
                                "Patient not found with ID: " + patientId
                        )
                );
    }
}
