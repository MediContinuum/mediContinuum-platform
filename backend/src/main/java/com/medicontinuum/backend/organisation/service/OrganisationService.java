package com.medicontinuum.backend.organisation.service;
import java.util.*;
import com.medicontinuum.backend.organisation.dto.OrganisationRequests;
import com.medicontinuum.backend.organisation.dto.OrganisationResponses;
public interface OrganisationService {
    OrganisationResponses.Organisation create(String email, OrganisationRequests.Create request);
    List<OrganisationResponses.Organisation> mine(String email);
    OrganisationResponses.Organisation get(String email, UUID organisationId);
    OrganisationResponses.Organisation update(String email, UUID organisationId, OrganisationRequests.Update request);
    OrganisationResponses.Organisation updateStatus(UUID organisationId, OrganisationRequests.Status request);
    List<OrganisationResponses.Member> members(String email, UUID organisationId);
    OrganisationResponses.Member addMember(String email, UUID organisationId, OrganisationRequests.AddMember request);
    OrganisationResponses.Member updateMemberRole(String email, UUID organisationId, UUID membershipId, OrganisationRequests.MemberRole request);
    void removeMember(String email, UUID organisationId, UUID membershipId);
    List<OrganisationResponses.Patient> patients(String email, UUID organisationId);
    OrganisationResponses.Patient addPatient(String email, UUID organisationId, OrganisationRequests.AddPatient request);
    void removePatient(String email, UUID organisationId, UUID patientId);
    OrganisationResponses.Dashboard dashboard(String email, UUID organisationId);
}
