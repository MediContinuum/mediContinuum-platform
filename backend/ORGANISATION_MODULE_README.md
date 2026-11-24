# MediContinuum Organisation Module (Backend)

This package implements the backend organisation module for the existing Spring Boot project.

## Features
- Organisation registration; new organisations start as `PENDING_VERIFICATION`.
- Platform-admin activation, suspension, or rejection.
- Organisation profile read/update.
- Owner/admin membership and organisation-scoped staff roles.
- Add/remove members using a 16-digit Global MediContinuum ID.
- Link/unlink existing patient profiles without deleting patient accounts.
- Organisation dashboard counts for members, doctors, nurses, pharmacists and patients.

## Prerequisites
This uses existing project classes: `User`, `UserRepository`, `UserRole`, `UserStatus`, `Patient`, and `PatientRepository`. It also uses Spring Security method security, Spring Data JPA, Jakarta Validation and Lombok.

The authenticated principal must return the user's email from `Authentication.getName()`. The current repository's JWT/authentication classes are placeholders, so a working login/JWT flow is still needed before these routes can be used from the browser.

## Roles and access
- User must have global `ORGANISATION_ADMIN` or `PLATFORM_ADMIN` to register an organisation.
- The creator is assigned the organisation-scoped `OWNER` role.
- Organisation member roles are stored in `organisation_memberships`; they are not added to the global `UserRole` set.
- `OWNER` cannot be removed through ordinary member routes.
- Only an owner or platform administrator can assign/manage another `ADMIN`.
- `ADMIN`, `DOCTOR`, `NURSE` and `PHARMACIST` memberships require the matching global role on the target user. `STAFF` and `VIEWER` do not.
- Members/patients can be added only after the organisation status becomes `ACTIVE`.

## API endpoints
| Method | Endpoint |
|---|---|
| POST | `/api/organisations` |
| GET | `/api/organisations/me` |
| GET | `/api/organisations/{id}` |
| PATCH | `/api/organisations/{id}` |
| PATCH | `/api/organisations/{id}/status` (platform admin) |
| GET/POST | `/api/organisations/{id}/members` |
| PATCH/DELETE | `/api/organisations/{id}/members/{membershipId}` |
| GET/POST | `/api/organisations/{id}/patients` |
| DELETE | `/api/organisations/{id}/patients/{patientId}` |
| GET | `/api/organisations/{id}/dashboard` |

## Sample JSON
Create organisation:
```json
{
  "name": "MediCare Central Hospital",
  "registrationNumber": "WB-HOSP-2026-001",
  "type": "HOSPITAL",
  "contactEmail": "contact@example.org",
  "contactPhone": "+91 9876543210",
  "website": "https://example.org",
  "addressLine": "12 Central Avenue",
  "city": "Kolkata",
  "state": "West Bengal",
  "country": "India",
  "postalCode": "700001"
}
```

Add organisation member:
```json
{ "globalUserId": "1000000000000002", "role": "DOCTOR" }
```

Link patient:
```json
{ "patientId": "00000000-0000-0000-0000-000000000000" }
```

Activate organisation (platform admin):
```json
{ "status": "ACTIVE" }
```

## Database schema
`backend/src/main/resources/db/migration/V4__create_organisation_module.sql` creates the three organisation tables. The current repository has only partial migrations and does not have a configured full Flyway baseline. Do not assume this script runs automatically. For local development, the existing `spring.jpa.hibernate.ddl-auto=update` can create the new tables from JPA entities. Production should use a reviewed migration strategy.

## Before production
Add integration tests, ownership transfer, invitation/acceptance flow, audit events, notification triggers, and tenant-ownership checks in prescriptions, inventory, procurement, analytics and audit APIs. This module links patients to organisations, but does not automatically make every existing patient endpoint tenant-scoped.
