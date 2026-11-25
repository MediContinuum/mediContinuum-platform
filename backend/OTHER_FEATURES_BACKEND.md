# Other backend features

This branch adds the missing backend modules and connects them to the existing user, patient, medicine, organisation, adherence, inventory, notification and prescription modules.

## Authentication and security

- `POST /api/auth/register` creates a PATIENT user and linked patient profile.
- `POST /api/auth/login` verifies BCrypt password hashes and issues an HS256 JWT.
- `GET /api/auth/me` returns the active authenticated user.
- `POST /api/auth/change-password` verifies the current password, saves a new BCrypt hash and increments the JWT token version.
- The JWT filter validates signature, issuer, expiry, issue time and token version, then loads active roles from PostgreSQL for every authenticated request.
- Set `JWT_SECRET` to a random value of at least 32 UTF-8 bytes. The application intentionally has no committed fallback signing key.
- CORS uses the comma-separated `CORS_ALLOWED_ORIGINS` environment variable.
- `GET /api/health` checks PostgreSQL with `SELECT 1`.

Google OAuth, email verification, refresh tokens and forgot-password/reset tokens are not included; they require their own provider settings and token lifecycle.

## Doctor

- `POST /api/doctors/me`, `GET /api/doctors/me`, `PUT /api/doctors/me`: doctor profile self-service.
- `GET /api/doctors?speciality=&city=`: authenticated active doctor search.
- `GET /api/doctors/{doctorId}`: active doctor detail.
- `PATCH /api/doctors/{doctorId}/status`: platform-admin status management.

## Vendor

- `POST /api/vendors`, `GET /api/vendors`, `GET /api/vendors/{vendorId}`, `PUT /api/vendors/{vendorId}`, `DELETE /api/vendors/{vendorId}`.
- Vendors belong to an organisation. OWNER, ADMIN, PHARMACIST and STAFF memberships can manage vendors.
- When the user belongs to more than one organisation, pass `organisationId` while creating a vendor.

## Procurement and organisation stock

- `POST /api/procurement/orders`, `GET /api/procurement/orders`, `GET /api/procurement/orders/{orderId}`.
- `PATCH /api/procurement/orders/{orderId}/status`, `PATCH /api/procurement/orders/{orderId}/cancel`, `POST /api/procurement/orders/{orderId}/receive`.
- The valid state flow is `DRAFT -> ORDERED -> PARTIALLY_RECEIVED -> RECEIVED`. Cancellation is permitted before any quantity has been received.
- Each receipt is checked against the outstanding quantity on its purchase-order line and creates an organisation stock batch and an immutable received transaction.
- Organisation-owned stock is deliberately separate from patient personal inventory.
- Stock units must match an existing organisation stock item exactly after common alias normalization. No silent mg/mL/tablet conversion occurs.
- Batch expiry dates are retained. The stock value remains unavailable because the existing model does not record acquisition costs by batch.

## Appointments

- Routes match the frontend: POST/GET `/api/appointments`, GET/PUT `/api/appointments/{appointmentId}`, PATCH `/{appointmentId}/status`, PATCH `/{appointmentId}/cancel`.
- Booking checks patient and doctor active status, organisation doctor membership and patient link if an organisation is supplied, and overlapping active appointments for the same doctor or patient.
- Doctor/patient rows are pessimistically locked during booking to serialize overlap checks. Appointment updates/status transitions lock the appointment row.
- Status flow: `SCHEDULED -> CONFIRMED -> COMPLETED`; cancellation and no-show are terminal.
- A patient may book for themself, a doctor may book as the doctor, a platform admin may act platform-wide, and an organisation owner/admin may book for a patient linked to that organisation.

## Analytics

Analytics is computed from current module data, not from a separate unmaintained analytics table.
- `GET /api/analytics/dashboard?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD&organisationId=UUID`
- `GET /api/analytics/patients/{patientId}`
- `GET /api/analytics/inventory?period=7d|30d|90d|12m&organisationId=UUID`
- `GET /api/analytics/adherence?period=...`
- `GET /api/analytics/consumption?period=...`
- `GET /api/analytics/forecast?period=...`
- `GET /api/analytics/organisation?period=...&organisationId=...`
- `GET /api/analytics/patients?period=...&organisationId=...`
- `GET /api/analytics/procurement?period=...&organisationId=...`
- Dose consumption analytics count confirmed TAKEN schedules; they do not sum quantities across different units.
- Forecast projected demand is a dose count. Projected stockout count is intentionally zero/unavailable because dosage/pack conversion and reliable patient inventory cost/availability forecast inputs are not defined.
- Inventory stock value is zero/unavailable; there is no per-batch acquisition-cost field to calculate it correctly.

## Dose-to-inventory integration

- A patient confirming a dose as TAKEN triggers patient inventory consumption in the same transaction.
- The service locks the dose schedule, uses FEFO batch locking, validates that the prescription unit matches the stock unit, and records a unique `dose_inventory_consumptions` row.
- Retried requests do not deduct twice because the unique dose consumption record is checked before deduction and constrained by the database.
- If there is no stock item, insufficient stock, or an unsafe unit mismatch, the operation returns a conflict and the dose update transaction rolls back. Add stock or correct the unit mapping before confirming the dose.
- No cross-unit conversion is guessed by this module.

## Configuration

PowerShell example:

```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/medicontinuum"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "<your-db-password>"
$env:JWT_SECRET = "<random-secret-at-least-32-bytes>"
$env:CORS_ALLOWED_ORIGINS = "http://localhost:5173"
$env:NOTIFICATION_EMAIL_ENABLED = "false"
.mvnw.cmd clean verify
```

SMTP credentials are optional and should be configured only when email delivery is enabled: `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`.

## Database migrations and production boundaries

- `V5__other_backend_features.sql` documents the tables/columns for these new modules. This repository does not currently configure Flyway or an established complete migration baseline, so the SQL file does not run automatically. Local `ddl-auto=update` is non-destructive; production should use a reviewed baseline and sequential versioned migrations.
- Existing patient CRUD, prescriptions, inventory, analytics and other patient APIs still need explicit organisation tenant checks before organisation staff can access them. Vendor/procurement/appointments/organisation analytics in this branch enforce organisation membership; this PR does not silently treat a link as universal authorization.
- Google OAuth, refresh tokens, password-reset flows, organization-owned stock consumption and batch-cost accounting remain separate work.
