# Notification module setup

## What is implemented

The backend stores in-app notifications in PostgreSQL. Email is optional and is controlled by `notification.email.enabled`.

- Prescription creation creates a `PRESCRIPTION_CREATED` notification for the patient.
- The missed-dose scheduler marks overdue pending doses as `MISSED` in batches of 100 and creates one `MISSED_DOSE` notification for each dose.
- Adding stock, consuming stock, or changing a stock threshold checks the resulting usable quantity and creates a `LOW_STOCK` notification when the threshold is reached.
- A daily scheduler creates `EXPIRY_WARNING` notifications for positive-quantity batches expiring within the configured warning window.
- Deduplication keys prevent repeated alerts for the same dose, prescription, batch expiry, or inventory item/day.
- The email worker processes pending mail asynchronously, records the result, and retries failures with a capped exponential delay. The default maximum is five attempts.
- In-app notification reads, counts, mark-as-read, mark-all-as-read, and delete remain available when email is disabled.

## Gmail SMTP setup (local development)

Google currently requires 2-Step Verification before an App Password can be created. Google also recommends using Sign in with Google where the integration supports it. See [Google's App Password documentation](https://support.google.com/accounts/answer/185833) and [2-Step Verification setup](https://support.google.com/accounts/answer/185839).

1. Use a dedicated sender mailbox for the application.
2. Enable 2-Step Verification for that Google account.
3. Open the Google Account App Passwords page and create an App Password for this application. Copy the generated 16-digit App Password. Do not use your normal Gmail password.
4. Set the environment variables in the same terminal that will start Spring Boot:

```bash
export NOTIFICATION_EMAIL_ENABLED=true
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587
export MAIL_USERNAME='your-sender@gmail.com'
export MAIL_PASSWORD='your-16-character-app-password'
export MAIL_FROM='your-sender@gmail.com'
```

Do not commit these values or put the app password in `application.properties`.

For local development without SMTP, leave `NOTIFICATION_EMAIL_ENABLED=false`. In-app notifications continue to work; notification email status is recorded as `DISABLED` for events that requested email.

## Application properties

The repository's `application.properties` reads database and SMTP credentials from environment variables. Set the database values too:

```bash
export DB_URL='jdbc:postgresql://localhost:5432/medicontinuum'
export DB_USERNAME='your-postgres-user'
export DB_PASSWORD='your-database-password'
```

The main defaults are:

| Property | Default | Purpose |
|---|---:|---|
| `notification.email.enabled` | `false` | Global SMTP switch |
| `notification.email.delivery-delay-ms` | `30000` | Email worker polling delay |
| `notification.email.max-attempts` | `5` | Maximum failed delivery attempts |
| `adherence.missed-grace-hours` | `2` | How late a dose can be before being marked missed |
| `adherence.missed-check-delay-ms` | `60000` | Missed-dose scheduler delay |
| `inventory.expiry-warning-days` | `30` | Expiry notification window |
| `inventory.expiry-warning-cron` | `0 0 9 * * *` | Daily expiry check time |
| `app.time-zone` | `Asia/Kolkata` | Scheduler timezone |

Start the backend from the `backend` directory:

```bash
./mvnw clean spring-boot:run
```

The local Hibernate setting is `spring.jpa.hibernate.ddl-auto=update`; it adds the new email retry columns to an existing notification table. Do not use Hibernate schema auto-update as the production migration strategy.

## Notification REST API

All endpoints are under `/api/notifications` and require an authenticated Spring Security principal. The service uses `Authentication.getName()` as the recipient email and scopes every read/update/delete to that user's database ID.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/me?page=0&size=20&unreadOnly=false` | Paginated inbox |
| GET | `/me/summary` | Total, unread, and read counts |
| PATCH | `/me/{notificationId}/read` | Mark one notification read |
| PATCH | `/me/read-all` | Mark every unread notification read |
| DELETE | `/me/{notificationId}` | Delete one notification |

Example:

```bash
curl -H "Authorization: Bearer $ACCESS_TOKEN" \
  "http://localhost:8080/api/notifications/me?page=0&size=20"
```

The bearer-token example assumes a JWT authentication implementation is configured. The public `main` branch inspected for this work still has placeholder JWT filter/service and authentication service classes; completing the app's login/JWT path and connecting a real React notification UI must be done against the actual frontend/auth implementation before claiming browser-to-database end-to-end readiness.

## Manual verification

1. Create a prescription for a patient. Check the patient's notifications inbox for `PRESCRIPTION_CREATED`.
2. Create a scheduled dose and allow it to pass the configured grace period. Check for `MISSED_DOSE`.
3. Consume stock or lower the threshold so available stock is at or below the threshold. Check for `LOW_STOCK`.
4. Create a positive-quantity batch whose expiry date is within the configured window. Run the expiry scheduler or wait for its daily cron. Check for `EXPIRY_WARNING`.
5. With SMTP enabled, inspect `email_delivery_status`, `email_attempt_count`, `email_sent_at`, and `email_failure_reason` in the `notifications` table. With SMTP disabled, check that in-app records are still created.

## Operational limitations to address before production

- This scheduler is intended for a single application instance. For multi-instance or high-volume deployments, use a dedicated outbox/queue with atomic claiming, dead-letter handling, and delivery metrics.
- SMTP delivery is at-least-once: if SMTP accepts a message but the database commit fails, a retry can send a duplicate.
- The current repository does not yet contain persisted per-user notification preferences, web-push/device-token endpoints, or a working React authentication/notification interface.
- Replace `ddl-auto=update` with reviewed versioned schema migrations before production.
- Rotate any database credential that has previously been committed to Git history; removing it from the latest file does not erase it from old commits.
