# MediContinuum Web — patient experience

React 18 + Vite 6 + Tailwind CSS 4. The patient application runs at **http://localhost:5173** and proxies API requests to the Spring Boot backend at **http://localhost:8080**.

## Local setup

1. Start PostgreSQL.
2. Create your local backend environment file and edit its database/JWT values:

   cd backend
   cp .env.example .env

   The backend imports this ignored .env file automatically. Set GEMINI_API_KEY to your Google AI Studio key and keep GEMINI_MODEL=gemini-3.8-flash (or another model enabled for your project). Never put a Gemini key in a VITE_ variable or commit it to Git.
3. Start the backend from the same backend directory:

   ./mvnw spring-boot:run

4. Configure and start the patient frontend:

   cd frontend/medicontinuum-web
   cp .env.example .env
   npm install
   npm run dev

If the backend is not on port 8080, set VITE_BACKEND_PROXY_TARGET in the frontend .env file. The API base path is /api.

## Authentication and AI

- Login uses POST /api/auth/login; session restoration uses GET /api/auth/me.
- Registration uses POST /api/auth/register. The backend creates a PATIENT account and accepts first name, last name, email, password, and phone number only.
- Tokens are held in tab-scoped sessionStorage; an access-token refresh is attempted once after a 401 response.
- Gemini readiness is checked through GET /api/ai/status.
- Guest presentation chat uses POST /api/ai/demo-chat. It has no account or patient context and is subject to a stricter per-client request budget.
- Signed-in chat uses authenticated POST /api/ai/chat. Only live backend inventory and aggregate adherence data are sent; user name, email and Global ID are not sent.
- Both routes use the server-side GEMINI_API_KEY. The API key is never sent to the browser.
- The assistant uses the Google Interactions API with GEMINI_MODEL (default gemini-3.8-flash), checks for a non-empty response, and surfaces configuration, authentication, quota, timeout and upstream errors. It applies healthcare safety instructions and is not a clinician or a substitute for diagnosis or treatment.

## Live backend connections

The current patient frontend connects to:
- Medicine catalogue: GET /api/medicines
- Patient inventory: GET /api/inventory/me, POST /api/inventory/me/batches, and the authenticated consume/threshold routes
- Notifications: GET /api/notifications/me, mark-read and read-all routes
- Vendor directory: GET /api/vendors for authenticated sessions
- Dashboard analytics: GET /api/analytics/dashboard

If a live list cannot be loaded, the affected view shows a visible warning and falls back to demonstration data.

## Presentation demo

Open /demo-network or choose **Kalyani Demo** in app navigation to see synthetic sample patients, doctors, pharmacies, and appointments around Kalyani/Gayeshpur, Nadia, West Bengal. These records are not real people or verified local providers. The default dashboard, adherence, family, and prescription experiences still contain browser-side presentation data where the backend currently does not expose a corresponding patient self-service API.

## Known backend boundaries

- /api/adherence currently has an empty controller. Dose updates displayed in the demo dashboard are local browser state, not persisted in the backend.
- Patient registration does not accept health-profile fields. The backend does not currently expose a patient self-service profile-update endpoint.
- Prescription read/create endpoints are currently restricted to DOCTOR/PLATFORM_ADMIN and do not expose a patient self-service list.
- Prescription OCR and uploaded-image medicine recognition are not wired to a backend OCR service.

Do not present any of these local demo interactions as persisted clinical data.
