package com.medicontinuum.backend.appointment.entity;

import java.time.LocalDateTime;
import java.util.UUID;
import com.medicontinuum.backend.appointment.enums.*;
import com.medicontinuum.backend.doctor.entity.Doctor;
import com.medicontinuum.backend.organisation.entity.Organisation;
import com.medicontinuum.backend.patient.entity.Patient;
import com.medicontinuum.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="appointments",indexes={
    @Index(name="idx_appointment_patient_start",columnList="patient_id,start_at"),
    @Index(name="idx_appointment_doctor_start",columnList="doctor_id,start_at"),
    @Index(name="idx_appointment_org_start",columnList="organisation_id,start_at"),
    @Index(name="idx_appointment_status",columnList="status")
})
@Getter @Setter @NoArgsConstructor
public class Appointment {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="patient_id",nullable=false) private Patient patient;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="doctor_id",nullable=false) private Doctor doctor;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="organisation_id") private Organisation organisation;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="created_by_user_id",nullable=false) private User createdBy;
    @Column(name="start_at",nullable=false) private LocalDateTime startAt;
    @Column(name="end_at",nullable=false) private LocalDateTime endAt;
    @Column(length=500) private String reason;
    @Column(length=2000) private String notes;
    @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private AppointmentStatus status=AppointmentStatus.SCHEDULED;
    @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private AppointmentType type=AppointmentType.IN_PERSON;
    @Column(name="created_at",nullable=false,updatable=false) private LocalDateTime createdAt;
    @Column(name="updated_at",nullable=false) private LocalDateTime updatedAt;
    @PrePersist void onCreate(){LocalDateTime now=LocalDateTime.now();createdAt=now;updatedAt=now;if(status==null)status=AppointmentStatus.SCHEDULED;if(type==null)type=AppointmentType.IN_PERSON;}
    @PreUpdate void onUpdate(){updatedAt=LocalDateTime.now();}
}
