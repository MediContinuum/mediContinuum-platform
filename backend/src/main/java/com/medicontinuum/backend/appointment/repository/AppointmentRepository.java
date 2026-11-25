package com.medicontinuum.backend.appointment.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import com.medicontinuum.backend.appointment.entity.Appointment;
import com.medicontinuum.backend.appointment.enums.AppointmentStatus;

public interface AppointmentRepository extends JpaRepository<Appointment,UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Appointment a WHERE a.id=:id")
    Optional<Appointment> findByIdForUpdate(@Param("id") UUID id);

    @Query("""
        SELECT CASE WHEN COUNT(a)>0 THEN true ELSE false END FROM Appointment a
        WHERE a.doctor.id=:doctorId AND a.status IN :statuses
          AND a.startAt < :endAt AND a.endAt > :startAt
    """)
    boolean hasDoctorOverlap(@Param("doctorId") UUID doctorId,@Param("startAt") LocalDateTime startAt,@Param("endAt") LocalDateTime endAt,@Param("statuses") Collection<AppointmentStatus> statuses);

    @Query("""
        SELECT CASE WHEN COUNT(a)>0 THEN true ELSE false END FROM Appointment a
        WHERE a.patient.id=:patientId AND a.status IN :statuses
          AND a.startAt < :endAt AND a.endAt > :startAt
    """)
    boolean hasPatientOverlap(@Param("patientId") UUID patientId,@Param("startAt") LocalDateTime startAt,@Param("endAt") LocalDateTime endAt,@Param("statuses") Collection<AppointmentStatus> statuses);

    @Query("""
        SELECT CASE WHEN COUNT(a)>0 THEN true ELSE false END FROM Appointment a
        WHERE a.id<>:appointmentId AND a.doctor.id=:doctorId AND a.status IN :statuses
          AND a.startAt < :endAt AND a.endAt > :startAt
    """)
    boolean hasOtherDoctorOverlap(@Param("appointmentId") UUID appointmentId,@Param("doctorId") UUID doctorId,@Param("startAt") LocalDateTime startAt,@Param("endAt") LocalDateTime endAt,@Param("statuses") Collection<AppointmentStatus> statuses);

    @Query("""
        SELECT CASE WHEN COUNT(a)>0 THEN true ELSE false END FROM Appointment a
        WHERE a.id<>:appointmentId AND a.patient.id=:patientId AND a.status IN :statuses
          AND a.startAt < :endAt AND a.endAt > :startAt
    """)
    boolean hasOtherPatientOverlap(@Param("appointmentId") UUID appointmentId,@Param("patientId") UUID patientId,@Param("startAt") LocalDateTime startAt,@Param("endAt") LocalDateTime endAt,@Param("statuses") Collection<AppointmentStatus> statuses);

    List<Appointment> findByPatient_IdAndStartAtBetweenOrderByStartAtAsc(UUID patientId,LocalDateTime from,LocalDateTime to);
    List<Appointment> findByDoctor_IdAndStartAtBetweenOrderByStartAtAsc(UUID doctorId,LocalDateTime from,LocalDateTime to);
    List<Appointment> findByOrganisation_IdInAndStartAtBetweenOrderByStartAtAsc(Collection<UUID> organisationIds,LocalDateTime from,LocalDateTime to);
}
