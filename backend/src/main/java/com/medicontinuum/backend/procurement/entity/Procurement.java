package com.medicontinuum.backend.procurement.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.medicontinuum.backend.organisation.entity.Organisation;
import com.medicontinuum.backend.procurement.enums.ProcurementStatus;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.vendor.entity.Vendor;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="procurement_orders",uniqueConstraints=@UniqueConstraint(name="uk_procurement_order_number",columnNames="order_number"),indexes={
    @Index(name="idx_procurement_org_created",columnList="organisation_id,created_at"),
    @Index(name="idx_procurement_vendor",columnList="vendor_id"),
    @Index(name="idx_procurement_status",columnList="status")
})
@Getter @Setter @NoArgsConstructor
public class Procurement {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @Column(name="order_number",nullable=false,length=40) private String orderNumber;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="organisation_id",nullable=false) private Organisation organisation;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="vendor_id",nullable=false) private Vendor vendor;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="created_by_user_id",nullable=false) private User createdBy;
    @Enumerated(EnumType.STRING) @Column(nullable=false,length=30) private ProcurementStatus status=ProcurementStatus.DRAFT;
    @Column(name="expected_delivery_date") private LocalDate expectedDeliveryDate;
    @Column(precision=14,scale=2,nullable=false) private BigDecimal totalAmount=BigDecimal.ZERO;
    @Column(length=1000) private String notes;
    @OneToMany(mappedBy="order",cascade=CascadeType.ALL,orphanRemoval=true) private List<ProcurementItem> items=new ArrayList<>();
    @Column(name="created_at",nullable=false,updatable=false) private LocalDateTime createdAt;
    @Column(name="updated_at",nullable=false) private LocalDateTime updatedAt;
    public void addItem(ProcurementItem item){items.add(item);item.setOrder(this);}
    @PrePersist void onCreate(){LocalDateTime now=LocalDateTime.now();createdAt=now;updatedAt=now;if(status==null)status=ProcurementStatus.DRAFT;if(totalAmount==null)totalAmount=BigDecimal.ZERO;}
    @PreUpdate void onUpdate(){updatedAt=LocalDateTime.now();}
}
