package com.medicontinuum.backend.adherence.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.medicontinuum.backend.adherence.dto.AdherenceSummaryResponse;
import com.medicontinuum.backend.adherence.dto.DoseScheduleResponse;
import com.medicontinuum.backend.adherence.dto.GenerateAdherenceScheduleRequest;
import com.medicontinuum.backend.adherence.dto.ScheduleGenerationResponse;
import com.medicontinuum.backend.adherence.entity.DoseSchedule;
import com.medicontinuum.backend.adherence.enums.DoseStatus;
import com.medicontinuum.backend.adherence.repository.DoseScheduleRepository;
import com.medicontinuum.backend.adherence.service.AdherenceService;
import com.medicontinuum.backend.patient.entity.Patient;
import com.medicontinuum.backend.patient.repository.PatientRepository;
import com.medicontinuum.backend.prescription.entity.Prescription;
import com.medicontinuum.backend.prescription.entity.PrescriptionItem;
import com.medicontinuum.backend.prescription.enums.PrescriptionFrequency;
import com.medicontinuum.backend.prescription.enums.PrescriptionStatus;
import com.medicontinuum.backend.prescription.repository.PrescriptionRepository;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.repository.UserRepository;
import com.medicontinuum.backend.notification.service.NotificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdherenceServiceImpl implements AdherenceService {

    private final DoseScheduleRepository doseScheduleRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Value("${adherence.missed-grace-hours:2}")
    private long missedGraceHours;

    // ---------------------------------------------------------
    // 1. Generate schedules from a prescription
    // ---------------------------------------------------------

    @Override
    public ScheduleGenerationResponse generateSchedules(
        String currentUserEmail,
        boolean platformAdmin,
        GenerateAdherenceScheduleRequest request
    ) {

        validateDateRange(request.fromDate(), request.toDate());

        ZoneId zone = resolveZone(request.timeZone());

        User currentUser = userRepository
            .findByEmailIgnoreCase(currentUserEmail)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Authenticated user not found"
            ));

        Prescription prescription = prescriptionRepository
            .findById(request.prescriptionId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Prescription not found"
            ));

        // A doctor can generate schedules only for their own prescription.
        // A platform admin can generate schedules for any prescription.
        if (!platformAdmin &&
            !prescription.getPrescribedBy().getId()
                .equals(currentUser.getId())) {

            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You cannot generate schedules for another doctor's prescription"
            );
        }

        if (prescription.getStatus() != PrescriptionStatus.ACTIVE) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Schedules can only be generated for active prescriptions"
            );
        }

        int createdCount = 0;
        int existingCount = 0;
        int skippedItemCount = 0;

        List<String> skippedItems = new ArrayList<>();

        for (PrescriptionItem item : prescription.getItems()) {

            List<LocalTime> times = getScheduleTimes(item.getFrequency());

            // CUSTOM and AS_NEEDED do not have automatic schedules.
            if (times.isEmpty()) {
                skippedItemCount++;
                skippedItems.add(
                    item.getMedicine().getName()
                        + " - " + item.getFrequency()
                        + " does not have automatic scheduling"
                );
                continue;
            }

            LocalDate startDate = item.getStartDate()
                .isAfter(request.fromDate())
                ? item.getStartDate()
                : request.fromDate();

            LocalDate endDate = item.getEndDate()
                .isBefore(request.toDate())
                ? item.getEndDate()
                : request.toDate();

            // Requested range does not overlap this medicine's dates.
            if (startDate.isAfter(endDate)) {
                continue;
            }

            for (
                LocalDate date = startDate;
                !date.isAfter(endDate);
                date = date.plusDays(1)
            ) {

                for (LocalTime time : times) {

                    OffsetDateTime scheduledAt = date
                        .atTime(time)
                        .atZone(zone)
                        .toOffsetDateTime();

                    boolean alreadyExists =
                        doseScheduleRepository
                            .existsByPrescriptionItem_IdAndScheduledAt(
                                item.getId(),
                                scheduledAt
                            );

                    if (alreadyExists) {
                        existingCount++;
                        continue;
                    }

                    DoseSchedule schedule = DoseSchedule.builder()
                        .prescriptionItem(item)
                        .scheduledAt(scheduledAt)
                        .status(DoseStatus.PENDING)
                        .build();

                    doseScheduleRepository.save(schedule);

                    createdCount++;
                }
            }
        }

        return new ScheduleGenerationResponse(
            prescription.getId(),
            createdCount,
            existingCount,
            skippedItemCount,
            skippedItems
        );
    }

    // ---------------------------------------------------------
    // 2. Get schedules for the logged-in patient
    // ---------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<DoseScheduleResponse> getMySchedules(
        String currentUserEmail,
        LocalDate fromDate,
        LocalDate toDate,
        String timeZone
    ) {

        validateDateRange(fromDate, toDate);

        Patient patient = findPatientForUser(currentUserEmail);

        List<DoseSchedule> schedules = findSchedules(
            patient.getId(),
            fromDate,
            toDate,
            timeZone
        );

        return schedules.stream()
            .map(this::toResponse)
            .toList();
    }

    // ---------------------------------------------------------
    // 3. Get adherence summary for logged-in patient
    // ---------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public AdherenceSummaryResponse getMySummary(
        String currentUserEmail,
        LocalDate fromDate,
        LocalDate toDate,
        String timeZone
    ) {

        validateDateRange(fromDate, toDate);

        Patient patient = findPatientForUser(currentUserEmail);

        List<DoseSchedule> schedules = findSchedules(
            patient.getId(),
            fromDate,
            toDate,
            timeZone
        );

        return calculateSummary(schedules, fromDate, toDate);
    }

    // ---------------------------------------------------------
    // 4. Get schedules for a patient - admin operation
    // ---------------------------------------------------------

    @Override
    @Transactional(readOnly = true)
    public List<DoseScheduleResponse> getPatientSchedules(
        UUID patientId,
        LocalDate fromDate,
        LocalDate toDate,
        String timeZone
    ) {

        validateDateRange(fromDate, toDate);

        if (!patientRepository.existsById(patientId)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Patient not found"
            );
        }

        return findSchedules(patientId, fromDate, toDate, timeZone)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    // ---------------------------------------------------------
    // 5. Patient marks a dose as TAKEN or SKIPPED
    // ---------------------------------------------------------

    @Override
    public DoseScheduleResponse updateDoseStatus(
        String currentUserEmail,
        UUID doseScheduleId,
        DoseStatus status,
        String patientNote
    ) {

        if (status != DoseStatus.TAKEN &&
            status != DoseStatus.SKIPPED) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "You can only update a dose to TAKEN or SKIPPED"
            );
        }

        Patient patient = findPatientForUser(currentUserEmail);

        DoseSchedule schedule = doseScheduleRepository
            .findById(doseScheduleId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Dose schedule not found"
            ));

        UUID schedulePatientId = schedule
            .getPrescriptionItem()
            .getPrescription()
            .getPatient()
            .getId();

        if (!schedulePatientId.equals(patient.getId())) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You cannot update another patient's dose"
            );
        }

        if (schedule.getStatus() == DoseStatus.TAKEN ||
            schedule.getStatus() == DoseStatus.SKIPPED) {

            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "This dose has already been confirmed"
            );
        }

        // MISSED can be corrected if the patient reports a late dose.
        schedule.setStatus(status);

        if (status == DoseStatus.TAKEN) {
            schedule.setTakenAt(OffsetDateTime.now());
        } else {
            schedule.setTakenAt(null);
        }

        schedule.setPatientNote(trimToNull(patientNote));

        DoseSchedule saved = doseScheduleRepository.save(schedule);

        return toResponse(saved);
    }

    // ---------------------------------------------------------
    // 6. Automatically mark overdue doses as MISSED
    // ---------------------------------------------------------

    @Override
    public int markOverdueDosesAsMissed() {

        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        OffsetDateTime cutoff = now.minusHours(missedGraceHours);

        List<DoseSchedule> overdueSchedules =
            doseScheduleRepository
                .findTop100ByStatusAndScheduledAtBeforeOrderByScheduledAtAsc(
                    DoseStatus.PENDING,
                    cutoff
                );

        for (DoseSchedule schedule : overdueSchedules) {

            schedule.setStatus(DoseStatus.MISSED);
            doseScheduleRepository.save(schedule);

            PrescriptionItem item = schedule.getPrescriptionItem();
            Patient patient = item.getPrescription().getPatient();

            notificationService.notifyMissedDose(
                patient.getUser().getEmail(),
                schedule.getId(),
                item.getMedicine().getName(),
                schedule.getScheduledAt()
            );
        }

        return overdueSchedules.size();
    }

    // ---------------------------------------------------------
    // Helper: Find patient profile of logged-in user
    // ---------------------------------------------------------

    private Patient findPatientForUser(String email) {

        User user = userRepository
            .findByEmailIgnoreCase(email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "User not found"
            ));

        return patientRepository
            .findByUser_Id(user.getId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Patient profile not found for this user"
            ));
    }

    // ---------------------------------------------------------
    // Helper: Fetch schedules in a local date range
    // ---------------------------------------------------------

    private List<DoseSchedule> findSchedules(
        UUID patientId,
        LocalDate fromDate,
        LocalDate toDate,
        String timeZone
    ) {

        ZoneId zone = resolveZone(timeZone);

        OffsetDateTime from = fromDate
            .atStartOfDay(zone)
            .toOffsetDateTime();

        OffsetDateTime to = toDate
            .plusDays(1)
            .atStartOfDay(zone)
            .toOffsetDateTime();

        return doseScheduleRepository
            .findByPrescriptionItem_Prescription_Patient_IdAndScheduledAtGreaterThanEqualAndScheduledAtLessThanOrderByScheduledAtAsc(
                patientId,
                from,
                to
            );
    }

    // ---------------------------------------------------------
    // Helper: Frequency to default dose times
    // ---------------------------------------------------------

    private List<LocalTime> getScheduleTimes(
        PrescriptionFrequency frequency
    ) {

        return switch (frequency) {

            case ONCE_DAILY ->
                List.of(LocalTime.of(9, 0));

            case TWICE_DAILY ->
                List.of(
                    LocalTime.of(9, 0),
                    LocalTime.of(21, 0)
                );

            case THREE_TIMES_DAILY ->
                List.of(
                    LocalTime.of(8, 0),
                    LocalTime.of(14, 0),
                    LocalTime.of(20, 0)
                );

            case FOUR_TIMES_DAILY ->
                List.of(
                    LocalTime.of(6, 0),
                    LocalTime.of(12, 0),
                    LocalTime.of(18, 0),
                    LocalTime.of(22, 0)
                );

            case EVERY_MORNING ->
                List.of(LocalTime.of(8, 0));

            case EVERY_NIGHT ->
                List.of(LocalTime.of(21, 0));

            case EVERY_8_HOURS ->
                List.of(
                    LocalTime.of(6, 0),
                    LocalTime.of(14, 0),
                    LocalTime.of(22, 0)
                );

            case EVERY_12_HOURS ->
                List.of(
                    LocalTime.of(8, 0),
                    LocalTime.of(20, 0)
                );

            case AS_NEEDED, CUSTOM ->
                List.of();
        };
    }

    // ---------------------------------------------------------
    // Helper: Calculate adherence summary
    // ---------------------------------------------------------

    private AdherenceSummaryResponse calculateSummary(
        List<DoseSchedule> schedules,
        LocalDate fromDate,
        LocalDate toDate
    ) {

        long total = schedules.size();

        long taken = schedules.stream()
            .filter(s -> s.getStatus() == DoseStatus.TAKEN)
            .count();

        long skipped = schedules.stream()
            .filter(s -> s.getStatus() == DoseStatus.SKIPPED)
            .count();

        long missed = schedules.stream()
            .filter(s -> s.getStatus() == DoseStatus.MISSED)
            .count();

        long pending = schedules.stream()
            .filter(s -> s.getStatus() == DoseStatus.PENDING)
            .count();

        long confirmedOrDue = taken + skipped + missed;

        BigDecimal percentage = confirmedOrDue == 0
            ? BigDecimal.ZERO
            : BigDecimal.valueOf(taken)
                .multiply(BigDecimal.valueOf(100))
                .divide(
                    BigDecimal.valueOf(confirmedOrDue),
                    2,
                    RoundingMode.HALF_UP
                );

        return new AdherenceSummaryResponse(
            fromDate,
            toDate,
            total,
            taken,
            skipped,
            missed,
            pending,
            percentage
        );
    }

    // ---------------------------------------------------------
    // Helper: Convert entity to DTO
    // ---------------------------------------------------------

    private DoseScheduleResponse toResponse(DoseSchedule schedule) {

        PrescriptionItem item = schedule.getPrescriptionItem();

        return new DoseScheduleResponse(
            schedule.getId(),
            item.getPrescription().getId(),
            item.getId(),
            item.getMedicine().getId(),
            item.getMedicine().getName(),
            item.getMedicine().getGenericName(),
            item.getMedicine().getStrength(),
            item.getDosageAmount().toPlainString(),
            item.getDosageUnit(),
            item.getFrequency().name(),
            schedule.getScheduledAt(),
            schedule.getStatus(),
            schedule.getTakenAt(),
            schedule.getPatientNote()
        );
    }

    // ---------------------------------------------------------
    // Helper: Validate dates
    // ---------------------------------------------------------

    private void validateDateRange(
        LocalDate fromDate,
        LocalDate toDate
    ) {

        if (fromDate == null || toDate == null ||
            fromDate.isAfter(toDate)) {

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid date range"
            );
        }

        long days = ChronoUnit.DAYS.between(fromDate, toDate) + 1;

        if (days > 90) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "A maximum date range of 90 days is allowed per request"
            );
        }
    }

    // ---------------------------------------------------------
    // Helper: Validate timezone
    // ---------------------------------------------------------

    private ZoneId resolveZone(String timeZone) {

        try {
            return ZoneId.of(timeZone);
        } catch (DateTimeException exception) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid time zone. Example: Asia/Kolkata"
            );
        }
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }
}