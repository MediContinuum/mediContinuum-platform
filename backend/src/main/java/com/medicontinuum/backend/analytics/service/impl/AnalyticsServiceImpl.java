package com.medicontinuum.backend.analytics.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.medicontinuum.backend.analytics.dto.AnalyticsResponses.*;
import com.medicontinuum.backend.analytics.service.AnalyticsService;
import com.medicontinuum.backend.appointment.entity.Appointment;
import com.medicontinuum.backend.appointment.repository.AppointmentRepository;
import com.medicontinuum.backend.adherence.entity.DoseSchedule;
import com.medicontinuum.backend.adherence.enums.DoseStatus;
import com.medicontinuum.backend.adherence.repository.DoseScheduleRepository;
import com.medicontinuum.backend.doctor.repository.DoctorRepository;
import com.medicontinuum.backend.inventory.entity.*;
import com.medicontinuum.backend.inventory.repository.*;
import com.medicontinuum.backend.organisation.entity.*;
import com.medicontinuum.backend.organisation.enums.*;
import com.medicontinuum.backend.organisation.repository.*;
import com.medicontinuum.backend.organisationstock.entity.*;
import com.medicontinuum.backend.organisationstock.repository.*;
import com.medicontinuum.backend.patient.entity.Patient;
import com.medicontinuum.backend.patient.repository.PatientRepository;
import com.medicontinuum.backend.procurement.entity.Procurement;
import com.medicontinuum.backend.procurement.enums.ProcurementStatus;
import com.medicontinuum.backend.procurement.repository.ProcurementRepository;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.user.enums.*;
import com.medicontinuum.backend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsServiceImpl implements AnalyticsService {
    private final UserRepository users;
    private final PatientRepository patients;
    private final OrganisationRepository organisations;
    private final OrganisationMembershipRepository memberships;
    private final OrganisationPatientRepository organisationPatients;
    private final AppointmentRepository appointments;
    private final DoctorRepository doctors;
    private final DoseScheduleRepository doseSchedules;
    private final InventoryItemRepository inventoryItems;
    private final InventoryBatchRepository inventoryBatches;
    private final InventoryTransactionRepository inventoryTransactions;
    private final OrganisationStockRepository organisationStocks;
    private final OrganisationStockBatchRepository organisationStockBatches;
    private final ProcurementRepository procurementOrders;

    @Value("${app.time-zone:Asia/Kolkata}")
    private String appTimeZone;

    @Override
    public DashboardAnalytics dashboard(String email, LocalDate fromDate, LocalDate toDate, UUID organisationId) {
        User actor=activeUser(email);
        PeriodRange range=explicitRange(fromDate,toDate);
        Optional<Patient> patient=patients.findByUser_Id(actor.getId());
        if(patient.isPresent() && organisationId == null){
            List<Appointment> patientAppointments=appointments.findByPatient_IdAndStartAtBetweenOrderByStartAtAsc(patient.get().getId(),range.from().atStartOfDay(),range.to().plusDays(1).atStartOfDay());
            List<DoseSchedule> doses=findDoses(patient.get().getId(),range);
            long taken=doses.stream().filter(d->d.getStatus()==DoseStatus.TAKEN).count();
            long due=doses.stream().filter(d->d.getStatus()==DoseStatus.TAKEN||d.getStatus()==DoseStatus.MISSED||d.getStatus()==DoseStatus.SKIPPED).count();
            double rate=percentage(taken,due);
            return new DashboardAnalytics(
                List.of(metric("Appointments",patientAppointments.size()),metric("Doses taken",taken),metric("Adherence rate",rate)),
                pointsByDate(patientAppointments,a->a.getStartAt().toLocalDate(),a->1.0,range),
                List.of(new Category("Taken",taken,percentage(taken,Math.max(1,due))),new Category("Missed",doses.stream().filter(d->d.getStatus()==DoseStatus.MISSED).count(),percentage(doses.stream().filter(d->d.getStatus()==DoseStatus.MISSED).count(),Math.max(1,due))))
            );
        }
        Organisation org=selectOrganisation(actor,organisationId);
        OrganisationAnalytics data=organisationData(org,range);
        ProcurementAnalytics procurement=procurementData(org,range);
        InventoryAnalytics inventory=organisationInventory(org,range);
        return new DashboardAnalytics(
            List.of(metric("Patients",data.totalPatients()),metric("Appointments",data.totalAppointments()),metric("Purchase orders",procurement.totalOrders()),metric("Low stock items",inventory.lowStockItems())),
            data.appointmentsTrend(),
            List.of(new Category("Active patients",data.activePatients(),percentage(data.activePatients(),Math.max(1,data.totalPatients()))),new Category("Low stock",inventory.lowStockItems(),percentage(inventory.lowStockItems(),Math.max(1,inventory.totalItems()))))
        );
    }

    @Override
    public PatientAnalytics patient(String email,UUID patientId,LocalDate fromDate,LocalDate toDate){
        User actor=activeUser(email);
        Patient patient=patients.findById(patientId).orElseThrow(()->notFound("Patient not found"));
        ensurePatientAccess(actor,patient);
        PeriodRange range=explicitRange(fromDate,toDate);
        List<DoseSchedule> doses=findDoses(patientId,range);
        List<Appointment> patientAppointments=appointments.findByPatient_IdAndStartAtBetweenOrderByStartAtAsc(patientId,range.from().atStartOfDay(),range.to().plusDays(1).atStartOfDay());
        long taken=doses.stream().filter(d->d.getStatus()==DoseStatus.TAKEN).count();
        long missed=doses.stream().filter(d->d.getStatus()==DoseStatus.MISSED).count();
        long confirmed=taken+missed+doses.stream().filter(d->d.getStatus()==DoseStatus.SKIPPED).count();
        return new PatientAnalytics(patientId.toString(),
            List.of(metric("Appointments",patientAppointments.size()),metric("Doses taken",taken),metric("Missed doses",missed),metric("Adherence rate",percentage(taken,confirmed))),
            groupDoseTrend(doses,range));
    }

    @Override
    public InventoryAnalytics inventory(String email,String period,UUID organisationId){
        User actor=activeUser(email);PeriodRange range=periodRange(period);
        Optional<Patient> patient=patients.findByUser_Id(actor.getId());
        if(patient.isPresent() && organisationId == null)return patientInventory(patient.get(),range);
        return organisationInventory(selectOrganisation(actor,organisationId),range);
    }

    @Override
    public AdherenceAnalytics adherence(String email,String period){
        User actor=activeUser(email);Patient patient=patients.findByUser_Id(actor.getId()).orElseThrow(()->forbidden("Patient profile is required for adherence analytics"));
        PeriodRange range=periodRange(period);List<DoseSchedule> doses=findDoses(patient.getId(),range);
        long taken=doses.stream().filter(d->d.getStatus()==DoseStatus.TAKEN).count();
        long missed=doses.stream().filter(d->d.getStatus()==DoseStatus.MISSED).count();
        long scheduled=doses.stream().filter(d->d.getStatus()!=DoseStatus.CANCELLED).count();
        long denominator=taken+missed+doses.stream().filter(d->d.getStatus()==DoseStatus.SKIPPED).count();
        return new AdherenceAnalytics(percentage(taken,denominator),missed,taken,scheduled,groupDoseTrend(doses,range));
    }

    @Override
    public ConsumptionAnalytics consumption(String email,String period){
        User actor=activeUser(email);Patient patient=patients.findByUser_Id(actor.getId()).orElseThrow(()->forbidden("Patient profile is required for consumption analytics"));
        PeriodRange range=periodRange(period);
        List<DoseSchedule> taken=findDoses(patient.getId(),range).stream().filter(d->d.getStatus()==DoseStatus.TAKEN).toList();
        Map<LocalDate,Double> counts=taken.stream().collect(Collectors.groupingBy(d->d.getScheduledAt().atZoneSameInstant(ZoneId.of(appTimeZone)).toLocalDate(),Collectors.summingDouble(d->1.0)));
        List<Point> points=buildDailyPoints(counts,range);
        double total=taken.size();double days=Math.max(1,ChronoUnit.DAYS.between(range.from(),range.to())+1);
        return new ConsumptionAnalytics(points,total,total/days);
    }

    @Override
    public ForecastAnalytics forecast(String email,String period){
        User actor=activeUser(email);Patient patient=patients.findByUser_Id(actor.getId()).orElseThrow(()->forbidden("Patient profile is required for medication demand forecast"));
        PeriodRange range=periodRange(period);int horizon=30;
        List<DoseSchedule> taken=findDoses(patient.getId(),range).stream().filter(d->d.getStatus()==DoseStatus.TAKEN).toList();
        double daily=taken.size()/(double)Math.max(1,ChronoUnit.DAYS.between(range.from(),range.to())+1);
        double projected=daily*horizon;
        List<Point> points=new ArrayList<>(buildDailyPoints(taken.stream().collect(Collectors.groupingBy(d->d.getScheduledAt().atZoneSameInstant(ZoneId.of(appTimeZone)).toLocalDate(),Collectors.summingDouble(d->1.0))),range));
        for(int i=1;i<=7;i++)points.add(new Point(range.to().plusDays(i).toString(),Math.round(daily*100.0)/100.0,0));
        // Dose units and pack sizes are not reliably convertible in the current prescription schema.
        // Do not fabricate a medicine-stockout estimate from dose counts alone.
        return new ForecastAnalytics(points,Math.round(projected*100.0)/100.0,0,false,horizon);
    }

    @Override
    public OrganisationAnalytics organisation(String email,String period,UUID organisationId){
        User actor=activeUser(email);Organisation org=selectOrganisation(actor,organisationId);return organisationData(org,periodRange(period));
    }

    @Override
    public PatientAnalyticsData patients(String email,String period,UUID organisationId){
        User actor=activeUser(email);Organisation org=selectOrganisation(actor,organisationId);PeriodRange range=periodRange(period);
        List<OrganisationPatient> links=organisationPatients.findByOrganisation_IdOrderByCreatedAtDesc(org.getId());
        long total=links.size(),active=links.stream().filter(p->p.getStatus()==OrganisationPatientStatus.ACTIVE).count();
        long added=links.stream().filter(p->inRange(p.getCreatedAt().toLocalDate(),range)).count();
        Map<LocalDate,Double> growth=links.stream().filter(p->inRange(p.getCreatedAt().toLocalDate(),range)).collect(Collectors.groupingBy(p->p.getCreatedAt().toLocalDate(),Collectors.summingDouble(p->1.0)));
        return new PatientAnalyticsData(total,active,added,
            List.of(new Point("Active",active,0),new Point("Inactive",total-active,0)),
            buildDailyPoints(growth,range));
    }

    @Override
    public ProcurementAnalytics procurement(String email,String period,UUID organisationId){
        User actor=activeUser(email);Organisation org=selectOrganisation(actor,organisationId);return procurementData(org,periodRange(period));
    }

    private OrganisationAnalytics organisationData(Organisation org,PeriodRange range){
        List<OrganisationPatient> links=organisationPatients.findByOrganisation_IdOrderByCreatedAtDesc(org.getId());
        long totalPatients=links.size(),activePatients=links.stream().filter(p->p.getStatus()==OrganisationPatientStatus.ACTIVE).count();
        long doctorCount=memberships.findByOrganisation_IdAndStatusOrderByCreatedAtAsc(org.getId(),OrganisationMemberStatus.ACTIVE).stream().filter(m->m.getRole()==OrganisationMemberRole.DOCTOR).count();
        List<Appointment> appts=appointments.findByOrganisation_IdInAndStartAtBetweenOrderByStartAtAsc(List.of(org.getId()),range.from().atStartOfDay(),range.to().plusDays(1).atStartOfDay());
        return new OrganisationAnalytics(totalPatients,activePatients,doctorCount,appts.size(),pointsByDate(appts,a->a.getStartAt().toLocalDate(),a->1.0,range),
            buildDailyPoints(links.stream().filter(p->inRange(p.getCreatedAt().toLocalDate(),range)).collect(Collectors.groupingBy(p->p.getCreatedAt().toLocalDate(),Collectors.summingDouble(p->1.0))),range));
    }

    private ProcurementAnalytics procurementData(Organisation org,PeriodRange range){
        List<Procurement> all=procurementOrders.findByOrganisation_IdInOrderByCreatedAtDesc(List.of(org.getId()));
        List<Procurement> recent=all.stream().filter(o->inRange(o.getCreatedAt().toLocalDate(),range)).toList();
        long pending=recent.stream().filter(o->o.getStatus()==ProcurementStatus.DRAFT||o.getStatus()==ProcurementStatus.ORDERED||o.getStatus()==ProcurementStatus.PARTIALLY_RECEIVED).count();
        long completed=recent.stream().filter(o->o.getStatus()==ProcurementStatus.RECEIVED).count();
        BigDecimal spend=recent.stream().filter(o->o.getStatus()!=ProcurementStatus.CANCELLED).map(Procurement::getTotalAmount).reduce(BigDecimal.ZERO,BigDecimal::add);
        Map<LocalDate,Double> spendByDate=recent.stream().filter(o->o.getStatus()!=ProcurementStatus.CANCELLED).collect(Collectors.groupingBy(o->o.getCreatedAt().toLocalDate(),Collectors.summingDouble(o->o.getTotalAmount().doubleValue())));
        Map<LocalDate,Double> ordersByDate=recent.stream().collect(Collectors.groupingBy(o->o.getCreatedAt().toLocalDate(),Collectors.summingDouble(o->1.0)));
        return new ProcurementAnalytics(recent.size(),pending,completed,spend.doubleValue(),buildDailyPoints(spendByDate,range),buildDailyPoints(ordersByDate,range));
    }

    private InventoryAnalytics patientInventory(Patient patient,PeriodRange range){
        List<InventoryItem> inventory=inventoryItems.findByPatient_Id(patient.getId());LocalDate today=LocalDate.now(ZoneId.of(appTimeZone));
        int low=0,empty=0,expiring=0;Map<String,Long> categories=new TreeMap<>();
        for(InventoryItem item:inventory){
            List<InventoryBatch> batches=inventoryBatches.findByInventoryItem_IdOrderByExpiryDateAsc(item.getId());BigDecimal available=BigDecimal.ZERO;
            for(InventoryBatch b:batches){
                if(!b.getExpiryDate().isBefore(today))available=available.add(b.getQuantityRemaining());
                if(b.getQuantityRemaining().compareTo(BigDecimal.ZERO)>0&&!b.getExpiryDate().isBefore(today)&&!b.getExpiryDate().isAfter(today.plusDays(30)))expiring++;
            }
            if(available.compareTo(item.getLowStockThreshold())<=0)low++;if(available.compareTo(BigDecimal.ZERO)<=0)empty++;
            categories.merge(item.getMedicine().getDosageForm().name(),1L,Long::sum);
        }
        List<InventoryTransaction> transactions=inventory.stream().flatMap(i->inventoryTransactions.findByInventoryItem_IdOrderByCreatedAtDesc(i.getId()).stream()).filter(t->inRange(t.getCreatedAt().toLocalDate(),range)).toList();
        Map<LocalDate,Double> movements=transactions.stream().collect(Collectors.groupingBy(t->t.getCreatedAt().toLocalDate(),Collectors.summingDouble(t->1.0)));
        return new InventoryAnalytics(inventory.size(),low,expiring,empty,0.0,false,buildDailyPoints(movements,range),toCategoryPoints(categories));
    }

    private InventoryAnalytics organisationInventory(Organisation org,PeriodRange range){
        List<OrganisationStock> stock=organisationStocks.findByOrganisation_IdOrderByMedicine_NameAsc(org.getId());
        LocalDate today=LocalDate.now(ZoneId.of(appTimeZone));int low=0,empty=0,expiring=0;Map<String,Long> categories=new TreeMap<>();
        for(OrganisationStock s:stock){
            List<OrganisationStockBatch> batches=organisationStockBatches.findByStockItem_IdOrderByExpiryDateAsc(s.getId());BigDecimal available=BigDecimal.ZERO;
            for(OrganisationStockBatch b: batches){
                if(!b.getExpiryDate().isBefore(today))available=available.add(b.getQuantityRemaining());
                if(b.getQuantityRemaining().compareTo(BigDecimal.ZERO)>0&&!b.getExpiryDate().isBefore(today)&&!b.getExpiryDate().isAfter(today.plusDays(30)))expiring++;
            }
            if(available.compareTo(s.getLowStockThreshold())<=0)low++;if(available.compareTo(BigDecimal.ZERO)<=0)empty++;
            categories.merge(s.getMedicine().getDosageForm().name(),1L,Long::sum);
        }
        return new InventoryAnalytics(stock.size(),low,expiring,empty,0.0,false,List.of(),toCategoryPoints(categories));
    }

    private List<CategoryPoint> toCategoryPoints(Map<String,Long> categories){
        long total=categories.values().stream().mapToLong(Long::longValue).sum();
        return categories.entrySet().stream().map(e->new CategoryPoint(e.getKey(),e.getValue(),0,e.getKey(),e.getValue(),percentage(e.getValue(),Math.max(1,total)))).toList();
    }
    private List<DoseSchedule> findDoses(UUID patientId,PeriodRange range){
        ZoneId zone=ZoneId.of(appTimeZone);OffsetDateTime from=range.from().atStartOfDay(zone).toOffsetDateTime();OffsetDateTime to=range.to().plusDays(1).atStartOfDay(zone).toOffsetDateTime();
        return doseSchedules.findByPrescriptionItem_Prescription_Patient_IdAndScheduledAtGreaterThanEqualAndScheduledAtLessThanOrderByScheduledAtAsc(patientId,from,to);
    }
    private List<Point> groupDoseTrend(List<DoseSchedule> doses,PeriodRange range){
        Map<LocalDate,Double> counts=doses.stream().filter(d->d.getStatus()==DoseStatus.TAKEN).collect(Collectors.groupingBy(d->d.getScheduledAt().atZoneSameInstant(ZoneId.of(appTimeZone)).toLocalDate(),Collectors.summingDouble(d->1.0)));
        return buildDailyPoints(counts,range);
    }
    private <T> List<Point> pointsByDate(List<T> source,Function<T,LocalDate> date,Function<T,Double> value,PeriodRange range){
        Map<LocalDate,Double> map=source.stream().collect(Collectors.groupingBy(date,Collectors.summingDouble(value::apply)));return buildDailyPoints(map,range);
    }
    private List<Point> buildDailyPoints(Map<LocalDate,Double> map,PeriodRange range){
        List<Point> points=new ArrayList<>();long days=ChronoUnit.DAYS.between(range.from(),range.to())+1;
        if(days<=31){
            for(LocalDate d=range.from();!d.isAfter(range.to());d=d.plusDays(1))points.add(new Point(d.toString(),map.getOrDefault(d,0.0),0));
        }else{
            for(int i=0;i<12;i++){
                LocalDate bucketStart=range.from().plusMonths(i);if(bucketStart.isAfter(range.to()))break;
                LocalDate bucketEnd=bucketStart.plusMonths(1).minusDays(1);
                double sum=map.entrySet().stream().filter(e->!e.getKey().isBefore(bucketStart)&&!e.getKey().isAfter(bucketEnd)).mapToDouble(Map.Entry::getValue).sum();
                points.add(new Point(bucketStart.getMonth().toString().substring(0,3),sum,0));
            }
        }
        return points;
    }
    private Metric metric(String label,double value){return new Metric(label,value,0,0,null);}
    private double percentage(double n,double d){return d<=0?0:BigDecimal.valueOf(n*100.0/d).setScale(2,RoundingMode.HALF_UP).doubleValue();}
    private boolean inRange(LocalDate date,PeriodRange range){return !date.isBefore(range.from())&&!date.isAfter(range.to());}
    private PeriodRange periodRange(String value){
        LocalDate to=LocalDate.now(ZoneId.of(appTimeZone));
        return switch(value==null?"30d":value){
            case "7d"->new PeriodRange(to.minusDays(6),to);
            case "30d"->new PeriodRange(to.minusDays(29),to);
            case "90d"->new PeriodRange(to.minusDays(89),to);
            case "12m"->new PeriodRange(to.minusMonths(12).plusDays(1),to);
            default->throw bad("period must be one of 7d, 30d, 90d or 12m");
        };
    }
    private PeriodRange explicitRange(LocalDate from,LocalDate to){
        LocalDate end=to==null?LocalDate.now(ZoneId.of(appTimeZone)):to;LocalDate start=from==null?end.minusDays(29):from;
        if(start.isAfter(end)||ChronoUnit.DAYS.between(start,end)>366)throw bad("Invalid analytics date range");
        return new PeriodRange(start,end);
    }
    private Organisation selectOrganisation(User actor,UUID id){
        if(id!=null){
            Organisation org=organisations.findById(id)
                .filter(o->o.getStatus()==OrganisationStatus.ACTIVE)
                .orElseThrow(()->notFound("Active organisation not found"));
            if(!actor.getRoles().contains(UserRole.PLATFORM_ADMIN)){
                memberships.findByOrganisation_IdAndUser_Id(id,actor.getId())
                    .filter(m->m.getStatus()==OrganisationMemberStatus.ACTIVE&&analyticsRole(m.getRole()))
                    .orElseThrow(()->forbidden("Organisation analytics access required"));
            }
            return org;
        }

        List<Organisation> accessible;
        if(actor.getRoles().contains(UserRole.PLATFORM_ADMIN)){
            accessible=organisations.findAll().stream()
                .filter(o->o.getStatus()==OrganisationStatus.ACTIVE).toList();
        }else{
            accessible=memberships.findByUser_IdAndStatusOrderByCreatedAtDesc(actor.getId(),OrganisationMemberStatus.ACTIVE).stream()
                .filter(m->analyticsRole(m.getRole()))
                .map(OrganisationMembership::getOrganisation)
                .filter(o->o.getStatus()==OrganisationStatus.ACTIVE)
                .distinct().toList();
        }
        if(accessible.isEmpty())throw forbidden("An active organisation analytics membership is required");
        if(accessible.size()>1)throw bad("organisationId is required when the user can access multiple organisations");
        return accessible.get(0);
    }
    private boolean analyticsRole(OrganisationMemberRole role){
        return role==OrganisationMemberRole.OWNER||role==OrganisationMemberRole.ADMIN
            ||role==OrganisationMemberRole.DOCTOR||role==OrganisationMemberRole.NURSE
            ||role==OrganisationMemberRole.PHARMACIST;
    }
    private void ensurePatientAccess(User actor,Patient patient){
        if(actor.getRoles().contains(UserRole.PLATFORM_ADMIN)||actor.getId().equals(patient.getUser().getId()))return;
        boolean linked=memberships.findByUser_IdAndStatusOrderByCreatedAtDesc(actor.getId(),OrganisationMemberStatus.ACTIVE).stream()
            .filter(m->m.getRole()==OrganisationMemberRole.OWNER||m.getRole()==OrganisationMemberRole.ADMIN||m.getRole()==OrganisationMemberRole.DOCTOR||m.getRole()==OrganisationMemberRole.NURSE)
            .anyMatch(m->organisationPatients.findByOrganisation_IdAndPatient_Id(m.getOrganisation().getId(),patient.getId()).filter(p->p.getStatus()==OrganisationPatientStatus.ACTIVE).isPresent());
        if(!linked)throw forbidden("Patient analytics access is not granted");
    }
    private User activeUser(String email){return users.findByEmailIgnoreCase(email).filter(u->u.getStatus()==UserStatus.ACTIVE).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Authenticated user is unavailable"));}
    private ResponseStatusException notFound(String m){return new ResponseStatusException(HttpStatus.NOT_FOUND,m);}
    private ResponseStatusException forbidden(String m){return new ResponseStatusException(HttpStatus.FORBIDDEN,m);}
    private ResponseStatusException bad(String m){return new ResponseStatusException(HttpStatus.BAD_REQUEST,m);}
    private record PeriodRange(LocalDate from,LocalDate to){}
}
