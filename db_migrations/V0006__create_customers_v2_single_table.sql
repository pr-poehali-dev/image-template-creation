-- Создаем новую таблицу со всеми данными в JSONB
CREATE TABLE customers_v2 (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    prefix VARCHAR(3),
    is_seller BOOLEAN DEFAULT FALSE,
    is_buyer BOOLEAN DEFAULT FALSE,
    is_carrier BOOLEAN DEFAULT FALSE,
    inn VARCHAR(12),
    kpp VARCHAR(9),
    ogrn VARCHAR(15),
    legal_address TEXT,
    postal_address TEXT,
    actual_address TEXT,
    director_name VARCHAR(255),
    bank_accounts JSONB DEFAULT '[]',
    delivery_addresses JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_v2_inn ON customers_v2(inn);
CREATE INDEX idx_customers_v2_company_name ON customers_v2(company_name);