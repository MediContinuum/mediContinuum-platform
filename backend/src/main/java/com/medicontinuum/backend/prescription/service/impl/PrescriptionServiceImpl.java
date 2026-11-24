package com.medicontinuum.backend.prescription.service.impl;

import com.medicontinuum.backend.medicine.entity.Medicine;
import com.medicontinuum.backend.medicine.enums.MedicineStatus;
import com.medicontinuum.backend.medicine.repository.MedicineRepository;

import com.medicontinuum.backend.patient.entity.Patient;
import com.medicontinuum.backend.patient.repository.PatientRepository;

import com.medicontinuum.backend.prescription.dto.CreatePrescriptionItemRequest;
import com.medicontinuum.backend.prescription.dto.CreatePrescriptionRequest;
import com.medicontinuum.backend.prescription.dto.PrescriptionResponse;
import com.medicontinuum.backend.prescription.entity.Prescription;
import com.medicontinuum.backend.prescription.entity.PrescriptionItem;
import com.medicontinuum.backend.prescription.enums.PrescriptionStatus;
import com.medicontinuum.backend.prescription.exception.PrescriptionNotFoundException;
import com.medicontinuum.backend.prescription.mapper.PrescriptionMapper;
import com.medicontinuum.backend.prescription.repository.PrescriptionRepository;
import com.medicontinuum.backend.prescription.service.PrescriptionService;
import com.medicontinuum.backend.prescription.event.PrescriptionStoppedEvent;

import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.repository.UserRepository;
import com.medicontinuum.backend.notification.service.NotificationService;

import lombok.RequiredArgsConstructor;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final MedicineRepository medicineRepository;
    private final UserRepository userRepository;
    private final PrescriptionMapper prescriptionMapper;
    private final NotificationService notificationService;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    public PrescriptionResponse createPrescription(
        String doctorEmail,
        CreatePrescriptionRequest request
    ) {

        // 1. Find patient
        Patient patient = patientRepository.findById(request.patientId())
            .orElseThrow(() ->
                new IllegalArgumentException("Patient not found")
            );

        // 2. Find the authenticated doctor account
        User doctor = userRepository.findByEmailIgnoreCase(doctorEmail)
            .orElseThrow(() ->
                new IllegalArgumentException("Authenticated user not found")
            );

        // 3. Create prescription header
        Prescription prescription = Prescription.builder()
            .patient(patient)
            .prescribedBy(doctor)
            .status(PrescriptionStatus.ACTIVE)
            .notes(request.notes())
            .build();

        // 4. Add all prescribed medicines
        for (CreatePrescriptionItemRequest itemRequest : request.items()) {

            if (itemRequest.endDate().isBefore(itemRequest.startDate())) {
                throw new IllegalArgumentException(
                    "Medicine end date cannot be before start date"
                );
            }

            if (itemRequest.startDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException(
                    "Medicine start date cannot be in the past"
                );
            }

            Medicine medicine = medicineRepository
                .findById(itemRequest.medicineId())
                .orElseThrow(() ->
                    new IllegalArgumentException(
                        "Medicine not found: " + itemRequest.medicineId()
                    )
                );

            if (medicine.getStatus() != MedicineStatus.ACTIVE) {
                throw new IllegalArgumentException(
                    "Inactive medicine cannot be prescribed: "
                        + medicine.getName()
                );
            }

            PrescriptionItem item = PrescriptionItem.builder()
                .medicine(medicine)
                .dosageAmount(itemRequest.dosageAmount())
                .dosageUnit(itemRequest.dosageUnit().trim())
                .frequency(itemRequest.frequency())
                .startDate(itemRequest.startDate())
                .endDate(itemRequest.endDate())
                .instructions(itemRequest.instructions())
                .build();

            prescription.addItem(item);
        }

        // 5. Save prescription and all its items
        Prescription savedPrescription =
            prescriptionRepository.save(prescription);

        notificationService.notifyPrescriptionCreated(
            patient.getUser().getEmail(),
            savedPrescription.getId(),
            doctor.getFullName()
        );

        return prescriptionMapper.toResponse(savedPrescription);
    }

    @Override
    @Transactional(readOnly = true)
    public PrescriptionResponse getPrescriptionById(UUID prescriptionId) {

        Prescription prescription = findPrescription(prescriptionId);

        return prescriptionMapper.toResponse(prescription);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getPrescriptionsByPatient(
        UUID patientId,
        PrescriptionStatus status
    ) {

        List<Prescription> prescriptions;

        if (status == null) {
            prescriptions =
                prescriptionRepository
                    .findByPatient_IdOrderByCreatedAtDesc(patientId);
        } else {
            prescriptions =
                prescriptionRepository
                    .findByPatient_IdAndStatusOrderByCreatedAtDesc(
                        patientId,
                        status
                    );
        }

        return prescriptions.stream()
            .map(prescriptionMapper::toResponse)
            .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrescriptionResponse> getMyIssuedPrescriptions(
        String doctorEmail
    ) {

        User doctor = userRepository.findByEmailIgnoreCase(doctorEmail)
            .orElseThrow(() ->
                new IllegalArgumentException("User not found")
            );

        return prescriptionRepository
            .findByPrescribedBy_IdOrderByCreatedAtDesc(doctor.getId())
            .stream()
            .map(prescriptionMapper::toResponse)
            .toList();
    }

    @Override
    public PrescriptionResponse updatePrescriptionStatus(
        UUID prescriptionId,
        PrescriptionStatus status
    ) {

        Prescription prescription = findPrescription(prescriptionId);

        if (prescription.getStatus() == PrescriptionStatus.CANCELLED
                || prescription.getStatus() == PrescriptionStatus.COMPLETED
                || prescription.getStatus() == PrescriptionStatus.EXPIRED) {

            throw new IllegalArgumentException(
                "A completed, cancelled or expired prescription cannot be changed"
            );
        }

        prescription.setStatus(status);

        Prescription updatedPrescription =
            prescriptionRepository.save(prescription);

        if (status != PrescriptionStatus.ACTIVE) {
            eventPublisher.publishEvent(
                new PrescriptionStoppedEvent(updatedPrescription.getId(), status)
            );
        }

        return prescriptionMapper.toResponse(updatedPrescription);
    }

    private Prescription findPrescription(UUID prescriptionId) {

        return prescriptionRepository.findById(prescriptionId)
            .orElseThrow(() ->
                new PrescriptionNotFoundException(
                    "Prescription not found: " + prescriptionId
                )
            );
    }
}