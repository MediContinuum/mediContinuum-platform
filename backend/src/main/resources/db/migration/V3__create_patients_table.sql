CREATE TABLE patients (

    id UUID PRIMARY KEY,

    user_id UUID NOT NULL UNIQUE,

    date_of_birth DATE,

    gender VARCHAR(30),

    blood_group VARCHAR(20),

    address_line VARCHAR(255),

    city VARCHAR(100),

    state VARCHAR(100),

    country VARCHAR(100),

    postal_code VARCHAR(20),

    emergency_contact_name VARCHAR(100),

    emergency_contact_phone VARCHAR(20),

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_patient_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_patients_city
    ON patients(city);

CREATE INDEX idx_patients_country
    ON patients(country);