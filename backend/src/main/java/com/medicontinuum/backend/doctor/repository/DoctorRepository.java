package com.medicontinuum.backend.doctor.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import com.medicontinuum.backend.doctor.entity.Doctor;
import com.medicontinuum.backend.doctor.enums.DoctorStatus;

public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    Optional<Doctor> findByUser_Id(UUID userId);
    boolean existsByLicenseNumberIgnoreCase(String licenseNumber);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT d FROM Doctor d WHERE d.id=:id")
    Optional<Doctor> findByIdForUpdate(@Param("id") UUID id);

    @Query("""
        SELECT d FROM Doctor d JOIN FETCH d.user u
        WHERE d.status = :status
          AND (:speciality IS NULL OR LOWER(d.speciality) LIKE LOWER(CONCAT('%', :speciality, '%')))
          AND (:city IS NULL OR LOWER(d.city) = LOWER(:city))
        ORDER BY d.yearsExperience DESC, u.fullName ASC
    """)
    List<Doctor> searchActive(
        @Param("status") DoctorStatus status,
        @Param("speciality") String speciality,
        @Param("city") String city
    );
}
