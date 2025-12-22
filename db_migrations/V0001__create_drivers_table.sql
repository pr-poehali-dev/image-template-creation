CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    passport_series VARCHAR(10),
    passport_number VARCHAR(20),
    passport_issued_by TEXT,
    passport_issued_date DATE,
    license_series VARCHAR(10),
    license_number VARCHAR(20),
    license_category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_drivers_full_name ON drivers(full_name);
CREATE INDEX idx_drivers_phone ON drivers(phone);