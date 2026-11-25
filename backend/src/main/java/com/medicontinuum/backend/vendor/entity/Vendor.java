package com.medicontinuum.backend.vendor.entity;

import java.time.LocalDateTime;
import java.util.UUID;
import com.medicontinuum.backend.organisation.entity.Organisation;
import com.medicontinuum.backend.user.entity.User;
import com.medicontinuum.backend.vendor.enums.VendorStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="vendors", uniqueConstraints=@UniqueConstraint(name="uk_vendor_org_name",columnNames={"organisation_id","name"}), indexes={
    @Index(name="idx_vendor_org_status",columnList="organisation_id,status"),
    @Index(name="idx_vendor_name",columnList="name")
})
@Getter @Setter @NoArgsConstructor
public class Vendor {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="organisation_id",nullable=false) private Organisation organisation;
    @Column(nullable=false,length=150) private String name;
    @Column(name="registration_number",length=100) private String registrationNumber;
    @Column(name="contact_person",length=100) private String contactPerson;
    @Column(length=150) private String email;
    @Column(name="phone_number",length=25) private String phoneNumber;
    @Column(length=255) private String address;
    @Column(length=100) private String city;
    @Column(length=100) private String state;
    @Column(length=100) private String country;
    @Column(name="postal_code",length=20) private String postalCode;
    @Enumerated(EnumType.STRING) @Column(nullable=false,length=20) private VendorStatus status=VendorStatus.ACTIVE;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="created_by_user_id",nullable=false) private User createdBy;
    @Column(name="created_at",nullable=false,updatable=false) private LocalDateTime createdAt;
    @Column(name="updated_at",nullable=false) private LocalDateTime updatedAt;
    @PrePersist void onCreate(){LocalDateTime now=LocalDateTime.now();createdAt=now;updatedAt=now;if(status==null)status=VendorStatus.ACTIVE;}
    @PreUpdate void onUpdate(){updatedAt=LocalDateTime.now();}
}
