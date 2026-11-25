
<div align="center">

<br/>
<p align="center">
  <img src="https://res.cloudinary.com/debzdkdon/image/upload/v1795584814/logo_xpmsbv.jpg" alt="MediContinuum Logo" width="250">
</p>
# MediContinuum

### Intelligent Medication Continuity & Healthcare Management Platform

**Connecting Patients • Empowering Families • Transforming Healthcare**


<br/>

[![Java](https://img.shields.io/badge/Java-25-orange?style=for-the-badge&logo=openjdk)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-Backend-6DB33F?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

<br/>

**Project Status: Initial Development**

</div>

---

## About the Project

MediContinuum is an intelligent healthcare management platform designed to connect patients, families, healthcare organisations, pharmacies, and medicine vendors through a unified medication and inventory ecosystem.

The platform focuses on the complete medication lifecycle — from prescription management and daily medicine consumption to inventory monitoring, predictive replenishment, and healthcare supply-chain coordination.

Our goal is to build a connected healthcare ecosystem that makes medication management smarter, more reliable, and more accessible.

## The Problem

Healthcare medication management is often fragmented:

- Patients struggle to maintain consistent medication schedules.
- Families lack visibility into medication adherence.
- Medicine inventory is frequently tracked manually.
- Pharmacies and hospitals face stock shortages and expiry issues.
- Medicine replenishment is often reactive.
- Communication between patients, pharmacies, and suppliers is disconnected.

## Our Solution

MediContinuum integrates these workflows into a single platform.

| Problem | Proposed Solution |
|---|---|
| Medication tracking | Digital medication schedules |
| Family coordination | Permission-based family access |
| Medicine shortages | Automated inventory monitoring |
| Expiry management | Batch and expiry tracking |
| Manual medicine updates | Voice and image-assisted updates |
| Stock prediction | AI/ML-powered forecasting |
| Procurement | Vendor and purchase-order coordination |

---

## Core Features

### 01. Patient Management
- Patient registration and authentication.
- Personal medical profiles.
- Prescription management.
- Medicine inventory.
- Doctor appointment management.

### 02. Family Healthcare Coordination
- Family member management.
- Patient-authorised access.
- Medication adherence monitoring.
- Family notifications.
- Shared healthcare coordination.

### 03. Smart Medication Tracking
- Daily medication schedules.
- Dose confirmation.
- Missed-dose tracking.
- Text-based medication updates.
- Voice-based and image-based updates.
- Medication history and adherence analytics.

### 04. Intelligent Medicine Inventory
- Real-time stock monitoring.
- Automatic inventory updates after confirmed consumption.
- Customisable minimum stock thresholds.
- Low-stock notifications.
- Batch and expiry management.
- Inventory history.

### 05. Healthcare Organisation Management
- Organisation registration.
- Patient and staff management.
- Centralised medicine inventory.
- Pharmacy coordination.
- Organisation-level analytics.

### 06. Vendor & Procurement Management
- Vendor registration.
- Medicine catalogue management.
- Purchase order generation.
- Supplier coordination.
- Delivery tracking.
- Replenishment workflows.

### 07. AI-Powered Intelligence
- OCR-based medicine information extraction.
- Voice-based medication updates.
- Predictive stockout forecasting.
- Inventory anomaly detection.
- Medicine demand forecasting.
- Intelligent inventory recommendations.

---

## System Architecture

<div align="center">

</div>

MediContinuum follows a modular monolithic architecture with Spring Boot as its primary backend.

| Layer | Technology | Responsibility |
|---|---|---|
| Frontend | React + TypeScript | User interfaces and dashboards |
| Backend | Java + Spring Boot | Business logic and REST APIs |
| Database | PostgreSQL | Persistent data management |
| AI Engine | Python | OCR, voice and predictive analytics |
| Infrastructure | Docker | Containerisation and deployment |

---

## Technology Stack

<div align="center">

| Category | Technologies |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Backend | Java, Spring Boot |
| ORM | Spring Data JPA, Hibernate |
| Security | Spring Security |
| Database | PostgreSQL |
| AI/ML | Python, Machine Learning |
| API | REST APIs |
| Containerisation | Docker |
| Testing | JUnit, Mockito, Postman |
| Version Control | Git, GitHub |
| CI/CD | GitHub Actions |

</div>

---

## Repository Structure

```text
medicontinuum-platform/
│
├── backend/
│   └── Spring Boot application
│
├── frontend/
│   └── React + TypeScript application
│
├── ai-engine/
│   └── Python AI/ML engine
│
├── infrastructure/
│   ├── docker/
│   └── deployment/
│
├── docs/
│   ├── assets/
│   ├── architecture/
│   ├── database/
│   ├── api/
│   └── development/
│
├── .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
│
├── docker-compose.yml
├── .gitignore
├── LICENSE
└── README.md
```

---

## Medication Lifecycle

```text
       PATIENT REGISTRATION
                |
                v
       PRESCRIPTION CREATION
                |
                v
        MEDICINE INVENTORY
                |
                v
       DAILY MEDICATION PLAN
                |
                v
       PATIENT CONFIRMS DOSE
                |
                v
       INVENTORY AUTO-UPDATE
                |
                v
         STOCK MONITORING
                |
         +------+------+
         |             |
      Available      Low Stock
         |             |
         v             v
       Continue     ALERT
                       |
                       v
               REPLENISHMENT
                       |
                       v
                PHARMACY/VENDOR
                       |
                       v
                 STOCK UPDATED
```

---

## Application Screenshots

<div align="center">

### Patient Dashboard


### Organisation Dashboard

</div>

---

## Development Roadmap

- [ ] Project architecture and database design
- [ ] Authentication and authorisation
- [ ] Patient management
- [ ] Family management and permissions
- [ ] Medicine catalogue and prescriptions
- [ ] Medication scheduling and adherence
- [ ] Patient inventory management
- [ ] Low-stock notifications
- [ ] Healthcare organisation management
- [ ] Vendor and procurement management
- [ ] React dashboards
- [ ] OCR-based medicine scanning
- [ ] Voice-based medication updates
- [ ] Predictive stock forecasting
- [ ] Inventory anomaly detection
- [ ] Testing and security hardening
- [ ] Production deployment

---

## Security & Privacy

Patient privacy and data protection are fundamental to MediContinuum.

Planned security measures:

- Secure authentication and authorisation.
- Role-based access control.
- Patient-controlled permissions.
- Organisation-level data isolation.
- Encrypted communication.
- Secure password storage.
- Audit logging.
- Input validation.
- Protected document access.

---

## Getting Started

### Prerequisites

- Java 25
- Node.js and npm
- Python 3.11+
- PostgreSQL
- Docker
- Git

### Clone the Repository

```bash
git clone https://github.com/MediContinuum/medicontinuum-platform.git

cd medicontinuum-platform
```

### Run Backend

```bash
cd backend

./mvnw spring-boot:run
```

Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

### Run Frontend

```bash
cd frontend

npm install

npm run dev
```

### Run AI Engine

```bash
cd ai-engine

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

Refer to the individual module documentation for environment configuration.

---

## Contribution Guidelines

MediContinuum is developed collaboratively by a team of four contributors.

### Branching Strategy

```text
main
  |
  └── develop
        |
        ├── feature/authentication
        ├── feature/patient-management
        ├── feature/inventory
        ├── feature/frontend
        └── feature/ai-engine
```

### Contribution Workflow

1. Create a feature branch.
2. Implement your assigned functionality.
3. Commit and push changes.
4. Create a Pull Request.
5. Participate in code review.
6. Merge after approval and successful tests.

---

## Development Team

| Member | Responsibility |
|---|---|
| Member 1 | Backend Architecture & Integration |
| Member 2 | Patient & Medication Management |
| Member 3 | Frontend Development |
| Member 4 | AI/ML Engineering |

---
<video controls src="20261125-1723-27.6481395.mp4" title="Title"></video>
## Future Scope

- Healthcare interoperability.
- ABDM ecosystem integration, subject to applicable requirements and approvals.
- Wearable healthcare device integration.
- Advanced predictive analytics.
- Multi-organisation healthcare coordination.
- Intelligent pharmacy recommendations.
- Advanced medicine supply-chain analytics.

---

## Our Vision

<div align="center">

# MediContinuum

### Continuity in Care. Intelligence in Healthcare.

**Making Healthcare More Connected, Intelligent, and Continuous.**

<br/>

*Built with dedication by the MediContinuum Team.*

</div>
