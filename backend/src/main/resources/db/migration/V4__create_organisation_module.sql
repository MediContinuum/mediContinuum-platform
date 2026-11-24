CREATE TABLE organisations (
    id UUID PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    registration_number VARCHAR(100),
    organisation_type VARCHAR(40) NOT NULL,
    status VARCHAR(30) NOT NULL,
    contact_email VARCHAR(150),
    contact_phone VARCHAR(25),
    website VARCHAR(255),
    address_line VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_organisation_registration_number UNIQUE (registration_number)
);
CREATE INDEX idx_organisation_name ON organisations(name);
CREATE INDEX idx_organisation_status ON organisations(status);
CREATE INDEX idx_organisation_city ON organisations(city);

CREATE TABLE organisation_memberships (
    id UUID PRIMARY KEY,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    role VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_organisation_membership_user UNIQUE (organisation_id, user_id)
);
CREATE INDEX idx_org_membership_org_status ON organisation_memberships(organisation_id,status);
CREATE INDEX idx_org_membership_user_status ON organisation_memberships(user_id,status);

CREATE TABLE organisation_patients (
    id UUID PRIMARY KEY,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    assigned_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_organisation_patient UNIQUE (organisation_id,patient_id)
);
CREATE INDEX idx_org_patient_org_status ON organisation_patients(organisation_id,status);
CREATE INDEX idx_org_patient_patient ON organisation_patients(patient_id);
