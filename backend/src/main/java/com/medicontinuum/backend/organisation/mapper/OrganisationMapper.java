package com.medicontinuum.backend.organisation.mapper;
import org.springframework.stereotype.Component;
import com.medicontinuum.backend.organisation.entity.*;
import com.medicontinuum.backend.organisation.dto.OrganisationResponses;
@Component
public class OrganisationMapper {
    public OrganisationResponses.Organisation toOrganisation(Organisation o) {
        return new OrganisationResponses.Organisation(o.getId(),o.getName(),o.getRegistrationNumber(),o.getType(),o.getStatus(),o.getContactEmail(),o.getContactPhone(),o.getWebsite(),o.getAddressLine(),o.getCity(),o.getState(),o.getCountry(),o.getPostalCode(),o.getCreatedBy().getId(),o.getCreatedBy().getFullName(),o.getCreatedAt(),o.getUpdatedAt());
    }
    public OrganisationResponses.Member toMember(OrganisationMembership m) {
        var u=m.getUser();
        return new OrganisationResponses.Member(m.getId(),u.getId(),u.getGlobalUserId(),u.getFullName(),u.getEmail(),u.getPhoneNumber(),m.getRole(),m.getStatus(),m.getCreatedAt(),m.getUpdatedAt());
    }
    public OrganisationResponses.Patient toPatient(OrganisationPatient link) {
        var p=link.getPatient(); var u=p.getUser();
        return new OrganisationResponses.Patient(link.getId(),p.getId(),u.getGlobalUserId(),u.getFullName(),u.getEmail(),u.getPhoneNumber(),p.getCity(),p.getState(),link.getStatus(),link.getCreatedAt());
    }
}
