package com.medicontinuum.backend.adherence.service;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.medicontinuum.backend.adherence.service.AdherenceService;
import com.medicontinuum.backend.prescription.event.PrescriptionStoppedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class PrescriptionStoppedListener {

    private final AdherenceService adherenceService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onPrescriptionStopped(PrescriptionStoppedEvent event) {
        int cancelled = adherenceService.cancelPendingSchedules(
            event.prescriptionId()
        );

        log.info(
            "Cancelled {} pending dose schedule(s) after prescription {} became {}",
            cancelled,
            event.prescriptionId(),
            event.status()
        );
    }
}
