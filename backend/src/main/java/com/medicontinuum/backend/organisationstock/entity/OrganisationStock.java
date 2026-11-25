package com.medicontinuum.backend.organisationstock.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import com.medicontinuum.backend.medicine.entity.Medicine;
import com.medicontinuum.backend.organisation.entity.Organisation;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="organisation_stock",uniqueConstraints=@UniqueConstraint(name="uk_org_stock_medicine",columnNames={"organisation_id","medicine_id"}),indexes=@Index(name="idx_org_stock_org",columnList="organisation_id"))
@Getter @Setter @NoArgsConstructor
public class OrganisationStock {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="organisation_id",nullable=false) private Organisation organisation;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="medicine_id",nullable=false) private Medicine medicine;
    @Column(name="stock_unit",nullable=false,length=40) private String stockUnit;
    @Column(name="low_stock_threshold",nullable=false,precision=14,scale=3) private BigDecimal lowStockThreshold=BigDecimal.ZERO;
    @Column(name="created_at",nullable=false,updatable=false) private LocalDateTime createdAt;
    @Column(name="updated_at",nullable=false) private LocalDateTime updatedAt;
    @PrePersist void onCreate(){LocalDateTime now=LocalDateTime.now();createdAt=now;updatedAt=now;if(lowStockThreshold==null)lowStockThreshold=BigDecimal.ZERO;}
    @PreUpdate void onUpdate(){updatedAt=LocalDateTime.now();}
}
