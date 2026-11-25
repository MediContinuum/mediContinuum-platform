package com.medicontinuum.backend.appointment.service.impl;

import java.time.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.medicontinuum.backend.appointment.dto.*;
import com.medicontinuum.backend.appointment.entity.Appointment;
import com.medicontinuum.backend.appointment.enums.*;
import com.medicontinuum.backend.appointment.repository.AppointmentRepository;
import com.medicontinuum.backend.appointment.service.AppointmentService;
import com.medicontinuum.backend.doctor.entity.Doctor;
import com.medicontinuum.backend.doctor.enums.DoctorStatus;
import com.medicontinuum.backend.doctor.repository.DoctorRepository;
import com.medicontinuum.backend.organisation.entity.Organisation;
import com.medicontinuum.backend.organisation.entity.OrganisationMembership;
import com.medicontinuum.backend.organisation.enums.*;
import com.medicontinuum.backend.organisation.repository.*;
import com.medicontinuum.backend.patient.entity.Patient;
import com.medicontinuum.backend.patient.repository.PatientRepository;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.enums.*;
import com.medicontinuum.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service @RequiredArgsConstructor @Transactional
public class AppointmentServiceImpl implements AppointmentService{
    private static final List<AppointmentStatus> BUSY=List.of(AppointmentStatus.SCHEDULED,AppointmentStatus.CONFIRMED);
    private final AppointmentRepository appointments;
    private final PatientRepository patients;
    private final DoctorRepository doctors;
    private final OrganisationRepository organisations;
    private final OrganisationMembershipRepository memberships;
    private final OrganisationPatientRepository organisationPatients;
    private final UserRepository users;
    @Value("${app.time-zone:Asia/Kolkata}") private String appTimeZone;

    @Override public AppointmentResponse create(String email,AppointmentRequests.Create r){
        User actor=activeUser(email);
        // Lock doctor first, then patient; every booking/update uses this order to avoid lock inversion.
        Doctor doctor=doctors.findByIdForUpdate(r.doctorId()).filter(d->d.getStatus()==DoctorStatus.ACTIVE).orElseThrow(()->notFound("Active doctor profile not found"));
        Patient patient=patients.findByIdForUpdate(r.patientId()).orElseThrow(()->notFound("Patient not found"));
        if(doctor.getUser().getStatus()!=UserStatus.ACTIVE||!doctor.getUser().getRoles().contains(UserRole.DOCTOR))throw conflict("Doctor account is not active");
        LocalDateTime start=LocalDateTime.of(r.appointmentDate(),r.startTime());LocalDateTime end=LocalDateTime.of(r.appointmentDate(),r.endTime());validateTime(start,end);
        Organisation org=null;
        if(r.organisationId()!=null){
            org=organisations.findById(r.organisationId()).filter(o->o.getStatus()==OrganisationStatus.ACTIVE).orElseThrow(()->notFound("Active organisation not found"));
            ensureOrganisationDoctor(org,doctor);ensureOrganisationPatient(org,patient);
        }
        ensureCanBook(actor,patient,doctor,org);
        assertNoOverlap(patient,doctor,start,end,null);
        Appointment a=new Appointment();a.setPatient(patient);a.setDoctor(doctor);a.setOrganisation(org);a.setCreatedBy(actor);
        a.setStartAt(start);a.setEndAt(end);a.setReason(clean(r.reason()));a.setType(r.type()==null?AppointmentType.IN_PERSON:r.type());a.setStatus(AppointmentStatus.SCHEDULED);
        return toResponse(appointments.save(a));
    }

    @Override @Transactional(readOnly=true) public List<AppointmentResponse> list(String email,UUID patientId,UUID doctorId,AppointmentStatus status,LocalDate fromDate,LocalDate toDate){
        User actor=activeUser(email);LocalDate from=fromDate==null?LocalDate.now(ZoneId.of(appTimeZone)).minusDays(30):fromDate;LocalDate to=toDate==null?LocalDate.now(ZoneId.of(appTimeZone)).plusDays(90):toDate;
        if(from.isAfter(to)||Duration.between(from.atStartOfDay(),to.plusDays(1).atStartOfDay()).toDays()>366)throw bad("Invalid appointment date range");
        LocalDateTime fromTime=from.atStartOfDay(),toTime=to.plusDays(1).atStartOfDay();
        List<Appointment> results;
        if(actor.getRoles().contains(UserRole.PLATFORM_ADMIN)){
            if(patientId!=null)results=appointments.findByPatient_IdAndStartAtBetweenOrderByStartAtAsc(patientId,fromTime,toTime);
            else if(doctorId!=null)results=appointments.findByDoctor_IdAndStartAtBetweenOrderByStartAtAsc(doctorId,fromTime,toTime);
            else results=appointments.findAll().stream().filter(a->!a.getStartAt().isBefore(fromTime)&&a.getStartAt().isBefore(toTime)).sorted(Comparator.comparing(Appointment::getStartAt)).toList();
        }else if(actor.getRoles().contains(UserRole.PATIENT)){
            Patient own=patients.findByUser_Id(actor.getId()).orElseThrow(()->forbidden("Patient profile required"));
            if(patientId!=null&&!patientId.equals(own.getId()))throw forbidden("You cannot view another patient's appointments");
            results=appointments.findByPatient_IdAndStartAtBetweenOrderByStartAtAsc(own.getId(),fromTime,toTime);
        }else if(actor.getRoles().contains(UserRole.DOCTOR)){
            Doctor own=doctors.findByUser_Id(actor.getId()).orElseThrow(()->forbidden("Doctor profile required"));
            if(doctorId!=null&&!doctorId.equals(own.getId()))throw forbidden("You can only view your appointments");
            results=appointments.findByDoctor_IdAndStartAtBetweenOrderByStartAtAsc(own.getId(),fromTime,toTime);
        }else{
            List<UUID> orgIds=memberships.findByUser_IdAndStatusOrderByCreatedAtDesc(actor.getId(),OrganisationMemberStatus.ACTIVE).stream()
                .filter(m->m.getOrganisation().getStatus()==OrganisationStatus.ACTIVE&&(m.getRole()==OrganisationMemberRole.OWNER||m.getRole()==OrganisationMemberRole.ADMIN||m.getRole()==OrganisationMemberRole.STAFF||m.getRole()==OrganisationMemberRole.PHARMACIST||m.getRole()==OrganisationMemberRole.NURSE))
                .map(m->m.getOrganisation().getId()).toList();
            if(orgIds.isEmpty())throw forbidden("Appointment access is not granted");
            results=appointments.findByOrganisation_IdInAndStartAtBetweenOrderByStartAtAsc(orgIds,fromTime,toTime);
        }
        return results.stream().filter(a->status==null||a.getStatus()==status).map(this::toResponse).toList();
    }
    @Override @Transactional(readOnly=true) public AppointmentResponse get(String email,UUID id){User actor=activeUser(email);Appointment a=find(id);requireCanView(actor,a);return toResponse(a);}
    @Override public AppointmentResponse update(String email,UUID id,AppointmentRequests.Update r){
        User actor=activeUser(email);Appointment a=findForUpdate(id);requireCanManage(actor,a);
        if(a.getStatus()==AppointmentStatus.CANCELLED||a.getStatus()==AppointmentStatus.COMPLETED||a.getStatus()==AppointmentStatus.NO_SHOW)throw conflict("A closed appointment cannot be edited");
        LocalDate date=r.appointmentDate()==null?a.getStartAt().toLocalDate():r.appointmentDate();
        LocalTime startTime=r.startTime()==null?a.getStartAt().toLocalTime():r.startTime();LocalTime endTime=r.endTime()==null?a.getEndAt().toLocalTime():r.endTime();
        LocalDateTime start=LocalDateTime.of(date,startTime),end=LocalDateTime.of(date,endTime);validateTime(start,end);
        Doctor lockedDoctor=doctors.findByIdForUpdate(a.getDoctor().getId()).orElseThrow(()->notFound("Doctor not found"));
        Patient lockedPatient=patients.findByIdForUpdate(a.getPatient().getId()).orElseThrow(()->notFound("Patient not found"));
        assertNoOverlap(lockedPatient,lockedDoctor,start,end,a.getId());
        a.setStartAt(start);a.setEndAt(end);if(r.reason()!=null)a.setReason(clean(r.reason()));if(r.notes()!=null)a.setNotes(clean(r.notes()));if(r.type()!=null)a.setType(r.type());
        return toResponse(appointments.save(a));
    }
    @Override public AppointmentResponse updateStatus(String email,UUID id,AppointmentRequests.Status r){
        User actor=activeUser(email);Appointment a=findForUpdate(id);requireCanManage(actor,a);AppointmentStatus current=a.getStatus(),next=r.status();
        if(current==AppointmentStatus.CANCELLED||current==AppointmentStatus.COMPLETED||current==AppointmentStatus.NO_SHOW)throw conflict("Appointment is already closed");
        boolean valid=(current==AppointmentStatus.SCHEDULED&&(next==AppointmentStatus.CONFIRMED||next==AppointmentStatus.CANCELLED))
            ||(current==AppointmentStatus.CONFIRMED&&(next==AppointmentStatus.COMPLETED||next==AppointmentStatus.CANCELLED||next==AppointmentStatus.NO_SHOW));
        if(!valid)throw conflict("Invalid appointment status transition from "+current+" to "+next);
        a.setStatus(next);return toResponse(appointments.save(a));
    }
    @Override public void cancel(String email,UUID id){
        User actor=activeUser(email);Appointment a=findForUpdate(id);
        boolean patientOwner=a.getPatient().getUser().getId().equals(actor.getId());
        if(!patientOwner)requireCanManage(actor,a);
        if(a.getStatus()==AppointmentStatus.COMPLETED||a.getStatus()==AppointmentStatus.NO_SHOW)throw conflict("Completed appointments cannot be cancelled");
        if(a.getStatus()==AppointmentStatus.CANCELLED)throw conflict("Appointment is already cancelled");
        a.setStatus(AppointmentStatus.CANCELLED);appointments.save(a);
    }
    private void assertNoOverlap(Patient patient,Doctor doctor,LocalDateTime start,LocalDateTime end,UUID excluded){
        boolean doctorBusy=excluded==null?appointments.hasDoctorOverlap(doctor.getId(),start,end,BUSY):appointments.hasOtherDoctorOverlap(excluded,doctor.getId(),start,end,BUSY);
        boolean patientBusy=excluded==null?appointments.hasPatientOverlap(patient.getId(),start,end,BUSY):appointments.hasOtherPatientOverlap(excluded,patient.getId(),start,end,BUSY);
        if(doctorBusy)throw conflict("Doctor already has an overlapping appointment");
        if(patientBusy)throw conflict("Patient already has an overlapping appointment");
    }
    private void ensureCanBook(User actor,Patient patient,Doctor doctor,Organisation organisation){
        if(actor.getRoles().contains(UserRole.PLATFORM_ADMIN))return;
        if(actor.getId().equals(patient.getUser().getId()))return;
        if(actor.getId().equals(doctor.getUser().getId()))return;
        if(organisation==null)throw forbidden("Organisation context is required when booking on behalf of another patient");
        boolean manager=memberships.findByOrganisation_IdAndUser_Id(organisation.getId(),actor.getId())
            .filter(m->m.getStatus()==OrganisationMemberStatus.ACTIVE&&(m.getRole()==OrganisationMemberRole.OWNER||m.getRole()==OrganisationMemberRole.ADMIN))
            .isPresent();
        if(!manager)throw forbidden("Only the patient, assigned doctor, organisation admin or platform admin can book this appointment");
    }
    private void ensureOrganisationDoctor(Organisation org,Doctor doctor){
        boolean linked=memberships.findByOrganisation_IdAndUser_Id(org.getId(),doctor.getUser().getId()).filter(m->m.getStatus()==OrganisationMemberStatus.ACTIVE&&m.getRole()==OrganisationMemberRole.DOCTOR).isPresent();
        if(!linked)throw forbidden("Doctor is not an active member of this organisation");
    }
    private void ensureOrganisationPatient(Organisation org,Patient patient){
        boolean linked=organisationPatients.findByOrganisation_IdAndPatient_Id(org.getId(),patient.getId()).filter(p->p.getStatus()==OrganisationPatientStatus.ACTIVE).isPresent();
        if(!linked)throw forbidden("Patient is not linked to this organisation");
    }
    private void requireCanView(User actor,Appointment a){
        if(actor.getRoles().contains(UserRole.PLATFORM_ADMIN)||a.getPatient().getUser().getId().equals(actor.getId())||a.getDoctor().getUser().getId().equals(actor.getId()))return;
        requireOrganisationMember(actor,a);
    }
    private void requireCanManage(User actor,Appointment a){
        if(actor.getRoles().contains(UserRole.PLATFORM_ADMIN)||a.getDoctor().getUser().getId().equals(actor.getId()))return;
        if(a.getOrganisation()!=null){
            OrganisationMembership m=memberships.findByOrganisation_IdAndUser_Id(a.getOrganisation().getId(),actor.getId()).filter(x->x.getStatus()==OrganisationMemberStatus.ACTIVE).orElseThrow(()->forbidden("Appointment management permission required"));
            if(m.getRole()==OrganisationMemberRole.OWNER||m.getRole()==OrganisationMemberRole.ADMIN)return;
        }
        throw forbidden("Only the doctor, organisation owner/admin or platform admin can manage this appointment");
    }
    private void requireOrganisationMember(User actor,Appointment a){
        if(a.getOrganisation()==null)throw forbidden("You cannot access this appointment");
        memberships.findByOrganisation_IdAndUser_Id(a.getOrganisation().getId(),actor.getId()).filter(m->m.getStatus()==OrganisationMemberStatus.ACTIVE).orElseThrow(()->forbidden("Organisation membership required"));
    }
    private void validateTime(LocalDateTime start,LocalDateTime end){
        if(!end.isAfter(start))throw bad("Appointment end time must be after the start time");
        if(start.isBefore(LocalDateTime.now(ZoneId.of(appTimeZone))))throw bad("Appointment cannot be scheduled in the past");
        if(Duration.between(start,end).toMinutes()>240)throw bad("Appointment duration cannot exceed four hours");
    }
    private User activeUser(String email){return users.findByEmailIgnoreCase(email).filter(u->u.getStatus()==UserStatus.ACTIVE).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Authenticated user is unavailable"));}
    private Appointment find(UUID id){return appointments.findById(id).orElseThrow(()->notFound("Appointment not found"));}
    private Appointment findForUpdate(UUID id){return appointments.findByIdForUpdate(id).orElseThrow(()->notFound("Appointment not found"));}
    private AppointmentResponse toResponse(Appointment a){return new AppointmentResponse(a.getId(),a.getPatient().getId(),a.getPatient().getUser().getFullName(),a.getDoctor().getId(),a.getDoctor().getUser().getFullName(),a.getOrganisation()==null?null:a.getOrganisation().getId(),a.getOrganisation()==null?null:a.getOrganisation().getName(),a.getStartAt().toLocalDate(),a.getStartAt().toLocalTime(),a.getEndAt().toLocalTime(),a.getReason(),a.getNotes(),a.getStatus(),a.getType(),a.getCreatedAt(),a.getUpdatedAt());}
    private String clean(String s){return s==null||s.isBlank()?null:s.trim();}
    private ResponseStatusException notFound(String m){return new ResponseStatusException(HttpStatus.NOT_FOUND,m);}
    private ResponseStatusException forbidden(String m){return new ResponseStatusException(HttpStatus.FORBIDDEN,m);}
    private ResponseStatusException conflict(String m){return new ResponseStatusException(HttpStatus.CONFLICT,m);}
    private ResponseStatusException bad(String m){return new ResponseStatusException(HttpStatus.BAD_REQUEST,m);}
}
