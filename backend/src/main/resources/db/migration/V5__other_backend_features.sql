-- Additional MediContinuum backend business modules.
-- This reference migration expects the existing V1-V4 core tables and JPA-managed inventory/adherence tables (users, patients, medicines,
-- organisations, memberships, organisation_patients, inventory, dose_schedules)
-- to exist. Flyway is not currently configured in this repository; do not assume
-- the file runs automatically. Review and apply using your chosen migration process.

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_refresh_token_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_token_expiry ON refresh_tokens(expires_at);

CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE RESTRICT,
    speciality VARCHAR(120) NOT NULL,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    qualification VARCHAR(200),
    years_experience INTEGER NOT NULL,
    consultation_fee NUMERIC(12,2),
    bio VARCHAR(2000),
    city VARCHAR(100),
    state VARCHAR(100),
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_doctor_speciality ON doctors(speciality);
CREATE INDEX IF NOT EXISTS idx_doctor_city ON doctors(city);
CREATE INDEX IF NOT EXISTS idx_doctor_status ON doctors(status);

CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE RESTRICT,
    name VARCHAR(150) NOT NULL,
    registration_number VARCHAR(100),
    contact_person VARCHAR(100),
    email VARCHAR(150),
    phone_number VARCHAR(25),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    status VARCHAR(20) NOT NULL,
    created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_vendor_org_name UNIQUE (organisation_id, name)
);
CREATE INDEX IF NOT EXISTS idx_vendor_org_status ON vendors(organisation_id, status);
CREATE INDEX IF NOT EXISTS idx_vendor_name ON vendors(name);

CREATE TABLE IF NOT EXISTS procurement_orders (
    id UUID PRIMARY KEY,
    order_number VARCHAR(40) NOT NULL UNIQUE,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(30) NOT NULL,
    expected_delivery_date DATE,
    total_amount NUMERIC(14,2) NOT NULL,
    notes VARCHAR(1000),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_procurement_org_created ON procurement_orders(organisation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_procurement_vendor ON procurement_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_procurement_status ON procurement_orders(status);

CREATE TABLE IF NOT EXISTS procurement_order_items (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES procurement_orders(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE RESTRICT,
    ordered_quantity NUMERIC(14,3) NOT NULL,
    received_quantity NUMERIC(14,3) NOT NULL DEFAULT 0,
    stock_unit VARCHAR(40) NOT NULL,
    unit_price NUMERIC(14,2) NOT NULL DEFAULT 0,
    line_total NUMERIC(14,2) NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_procurement_item_order ON procurement_order_items(order_id);

CREATE TABLE IF NOT EXISTS organisation_stock (
    id UUID PRIMARY KEY,
    organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE RESTRICT,
    stock_unit VARCHAR(40) NOT NULL,
    low_stock_threshold NUMERIC(14,3) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_org_stock_medicine UNIQUE (organisation_id, medicine_id)
);
CREATE INDEX IF NOT EXISTS idx_org_stock_org ON organisation_stock(organisation_id);

CREATE TABLE IF NOT EXISTS organisation_stock_batches (
    id UUID PRIMARY KEY,
    stock_item_id UUID NOT NULL REFERENCES organisation_stock(id) ON DELETE CASCADE,
    batch_number VARCHAR(100),
    expiry_date DATE NOT NULL,
    quantity_received NUMERIC(14,3) NOT NULL,
    quantity_remaining NUMERIC(14,3) NOT NULL,
    received_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT uk_org_stock_batch_number UNIQUE (stock_item_id, batch_number)
);
CREATE INDEX IF NOT EXISTS idx_org_stock_batch_item_expiry ON organisation_stock_batches(stock_item_id, expiry_date);
CREATE INDEX IF NOT EXISTS idx_org_stock_batch_expiry ON organisation_stock_batches(expiry_date);

CREATE TABLE IF NOT EXISTS organisation_stock_transactions (
    id UUID PRIMARY KEY,
    stock_item_id UUID NOT NULL REFERENCES organisation_stock(id) ON DELETE RESTRICT,
    batch_id UUID NOT NULL REFERENCES organisation_stock_batches(id) ON DELETE RESTRICT,
    performed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    transaction_type VARCHAR(30) NOT NULL,
    quantity NUMERIC(14,3) NOT NULL,
    notes VARCHAR(500),
    created_at TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_org_stock_tx_item_date ON organisation_stock_transactions(stock_item_id, created_at);
CREATE INDEX IF NOT EXISTS idx_org_stock_tx_batch ON organisation_stock_transactions(batch_id);

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    organisation_id UUID REFERENCES organisations(id) ON DELETE RESTRICT,
    created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    start_at TIMESTAMP NOT NULL,
    end_at TIMESTAMP NOT NULL,
    reason VARCHAR(500),
    notes VARCHAR(2000),
    status VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT ck_appointment_time CHECK (end_at > start_at)
);
CREATE INDEX IF NOT EXISTS idx_appointment_patient_start ON appointments(patient_id, start_at);
CREATE INDEX IF NOT EXISTS idx_appointment_doctor_start ON appointments(doctor_id, start_at);
CREATE INDEX IF NOT EXISTS idx_appointment_org_start ON appointments(organisation_id, start_at);
CREATE INDEX IF NOT EXISTS idx_appointment_status ON appointments(status);

CREATE TABLE IF NOT EXISTS dose_inventory_consumptions (
    id UUID PRIMARY KEY,
    dose_schedule_id UUID NOT NULL UNIQUE REFERENCES dose_schedules(id) ON DELETE RESTRICT,
    inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
    quantity NUMERIC(12,2) NOT NULL,
    unit VARCHAR(40) NOT NULL,
    consumed_at TIMESTAMP NOT NULL,
    CONSTRAINT ck_dose_inventory_quantity CHECK (quantity > 0)
);
CREATE INDEX IF NOT EXISTS idx_dose_inventory_consumption_item ON dose_inventory_consumptions(inventory_item_id);
