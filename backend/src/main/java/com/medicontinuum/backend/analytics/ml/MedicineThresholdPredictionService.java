package com.medicontinuum.backend.analytics.ml;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.medicontinuum.backend.inventory.entity.*;
import com.medicontinuum.backend.inventory.enums.InventoryTransactionType;
import com.medicontinuum.backend.inventory.repository.*;
import com.medicontinuum.backend.organisation.entity.*;
import com.medicontinuum.backend.organisation.enums.*;
import com.medicontinuum.backend.organisation.repository.*;
import com.medicontinuum.backend.organisationstock.entity.*;
import com.medicontinuum.backend.organisationstock.enums.OrganisationStockTransactionType;
import com.medicontinuum.backend.organisationstock.repository.*;
import com.medicontinuum.backend.patient.entity.Patient;
import com.medicontinuum.backend.patient.repository.PatientRepository;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.enums.UserStatus;
import com.medicontinuum.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MedicineThresholdPredictionService {
    private final MedicineDemandModel model = new MedicineDemandModel();

    private final UserRepository users;
    private final PatientRepository patients;
    private final InventoryItemRepository patientInventory;
    private final InventoryBatchRepository patientBatches;
    private final InventoryTransactionRepository patientTransactions;
    private final OrganisationRepository organisations;
    private final OrganisationMembershipRepository memberships;
    private final OrganisationStockRepository organisationStock;
    private final OrganisationStockBatchRepository organisationBatches;
    private final OrganisationStockTransactionRepository organisationTransactions;
    private final Clock clock;

    public MedicineThresholdPredictionResponse predict(
        String email,
        UUID organisationId,
        int historyDays,
        int leadTimeDays,
        double serviceLevel
    ) {
        validate(historyDays, leadTimeDays, serviceLevel);
        User actor = activeUser(email);
        LocalDate today = LocalDate.now(clock);
        LocalDate from = today.minusDays(historyDays - 1L);

        if (organisationId != null) {
            Organisation organisation = requireOrganisationAccess(actor, organisationId);
            List<MedicineThresholdPrediction> results = organisationPredictions(
                organisation, from, today, historyDays, leadTimeDays, serviceLevel
            );
            return new MedicineThresholdPredictionResponse(
                "ORGANISATION", historyDays, leadTimeDays, serviceLevel,
                MedicineDemandModel.VERSION, results
            );
        }

        Patient patient = patients.findByUser_Id(actor.getId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Provide an organisationId to request organisation inventory predictions"
            ));
        List<MedicineThresholdPrediction> results = patientPredictions(
            patient, from, today, historyDays, leadTimeDays, serviceLevel
        );
        return new MedicineThresholdPredictionResponse(
            "PATIENT", historyDays, leadTimeDays, serviceLevel,
            MedicineDemandModel.VERSION, results
        );
    }

    private List<MedicineThresholdPrediction> patientPredictions(
        Patient patient,
        LocalDate from,
        LocalDate today,
        int historyDays,
        int leadTimeDays,
        double serviceLevel
    ) {
        List<InventoryItem> items = patientInventory.findByPatient_Id(patient.getId());
        List<MedicineThresholdPrediction> results = new ArrayList<>();
        for (InventoryItem item : items) {
            LocalDateTime start = from.atStartOfDay();
            LocalDateTime end = today.plusDays(1).atStartOfDay();
            Map<LocalDate, BigDecimal> daily = new HashMap<>();
            patientTransactions.findByInventoryItem_IdAndTransactionTypeAndCreatedAtGreaterThanEqualAndCreatedAtLessThanOrderByCreatedAtAsc(
                    item.getId(), InventoryTransactionType.CONSUMED, start, end
                ).forEach(tx -> daily.merge(tx.getCreatedAt().toLocalDate(), tx.getQuantity(), BigDecimal::add));

            List<BigDecimal> series = dailySeries(from, historyDays, daily);
            BigDecimal available = patientBatches.findByInventoryItem_IdOrderByExpiryDateAsc(item.getId()).stream()
                .filter(batch -> !batch.getExpiryDate().isBefore(today))
                .map(InventoryBatch::getQuantityRemaining)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            MedicineDemandModel.Result prediction = model.predict(
                series, available, item.getLowStockThreshold(), leadTimeDays, serviceLevel
            );
            results.add(toResponse(
                item.getId(), item.getMedicine().getId(), item.getMedicine().getName(),
                item.getMedicine().getStrength(), item.getStockUnit(), available,
                item.getLowStockThreshold(), prediction, historyDays
            ));
        }
        return results;
    }

    private List<MedicineThresholdPrediction> organisationPredictions(
        Organisation organisation,
        LocalDate from,
        LocalDate today,
        int historyDays,
        int leadTimeDays,
        double serviceLevel
    ) {
        List<OrganisationStock> items = organisationStock.findByOrganisation_IdOrderByMedicine_NameAsc(organisation.getId());
        List<MedicineThresholdPrediction> results = new ArrayList<>();
        LocalDateTime start = from.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();

        for (OrganisationStock item : items) {
            Map<LocalDate, BigDecimal> daily = new HashMap<>();
            organisationTransactions.findByStockItem_IdAndTypeAndCreatedAtGreaterThanEqualAndCreatedAtLessThanOrderByCreatedAtAsc(
                    item.getId(), OrganisationStockTransactionType.CONSUMED, start, end
                ).forEach(tx -> daily.merge(tx.getCreatedAt().toLocalDate(), tx.getQuantity(), BigDecimal::add));

            List<BigDecimal> series = dailySeries(from, historyDays, daily);
            BigDecimal available = organisationBatches.findByStockItem_IdOrderByExpiryDateAsc(item.getId()).stream()
                .filter(batch -> !batch.getExpiryDate().isBefore(today))
                .map(OrganisationStockBatch::getQuantityRemaining)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

            MedicineDemandModel.Result prediction = model.predict(
                series, available, item.getLowStockThreshold(), leadTimeDays, serviceLevel
            );
            results.add(toResponse(
                item.getId(), item.getMedicine().getId(), item.getMedicine().getName(),
                item.getMedicine().getStrength(), item.getStockUnit(), available,
                item.getLowStockThreshold(), prediction, historyDays
            ));
        }
        return results;
    }

    private List<BigDecimal> dailySeries(
        LocalDate from,
        int days,
        Map<LocalDate, BigDecimal> daily
    ) {
        List<BigDecimal> values = new ArrayList<>(days);
        for (int i = 0; i < days; i++) {
            values.add(daily.getOrDefault(from.plusDays(i), BigDecimal.ZERO));
        }
        return values;
    }

    private MedicineThresholdPrediction toResponse(
        UUID stockItemId,
        UUID medicineId,
        String name,
        String strength,
        String unit,
        BigDecimal available,
        BigDecimal configured,
        MedicineDemandModel.Result prediction,
        int historyDays
    ) {
        Long cover = prediction.estimatedDaysOfCover();
        return new MedicineThresholdPrediction(
            stockItemId, medicineId, name, strength, unit,
            available, configured, prediction.recommendedThreshold(),
            prediction.averageDailyDemand(), prediction.expectedLeadTimeDemand(),
            prediction.safetyStock(), cover, historyDays,
            prediction.observedConsumptionDays(), prediction.modelTrained(),
            prediction.confidence(), prediction.riskLevel(),
            MedicineDemandModel.VERSION, prediction.explanation()
        );
    }

    private Organisation requireOrganisationAccess(User actor, UUID id) {
        Organisation organisation = organisations.findById(id)
            .filter(org -> org.getStatus() == OrganisationStatus.ACTIVE)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Active organisation not found"));

        if (actor.getRoles().contains(com.medicontinuum.backend.user.enums.UserRole.PLATFORM_ADMIN)) {
            return organisation;
        }

        memberships.findByOrganisation_IdAndUser_Id(id, actor.getId())
            .filter(m -> m.getStatus() == OrganisationMemberStatus.ACTIVE)
            .filter(m -> m.getRole() == OrganisationMemberRole.OWNER
                || m.getRole() == OrganisationMemberRole.ADMIN
                || m.getRole() == OrganisationMemberRole.DOCTOR
                || m.getRole() == OrganisationMemberRole.NURSE
                || m.getRole() == OrganisationMemberRole.PHARMACIST
                || m.getRole() == OrganisationMemberRole.STAFF)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.FORBIDDEN, "Active organisation access is required"
            ));
        return organisation;
    }

    private User activeUser(String email) {
        return users.findByEmailIgnoreCase(email)
            .filter(user -> user.getStatus() == UserStatus.ACTIVE)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Authenticated user is unavailable"
            ));
    }

    private void validate(int historyDays, int leadTimeDays, double serviceLevel) {
        if (historyDays < 30 || historyDays > 180) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "historyDays must be between 30 and 180");
        }
        if (leadTimeDays < 1 || leadTimeDays > 90) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "leadTimeDays must be between 1 and 90");
        }
        if (!Double.isFinite(serviceLevel) || serviceLevel < 0.80 || serviceLevel > 0.99) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "serviceLevel must be between 0.80 and 0.99");
        }
    }
}
