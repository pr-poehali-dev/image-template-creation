-- Таблица контрагентов
CREATE TABLE customers (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица банковских счетов
CREATE TABLE customer_bank_accounts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    bank_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    bik VARCHAR(9) NOT NULL,
    corr_account VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица адресов доставки
CREATE TABLE customer_delivery_addresses (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица контактных лиц для адресов доставки
CREATE TABLE delivery_address_contacts (
    id SERIAL PRIMARY KEY,
    delivery_address_id INTEGER NOT NULL REFERENCES customer_delivery_addresses(id),
    contact_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для ускорения поиска
CREATE INDEX idx_customers_inn ON customers(inn);
CREATE INDEX idx_customers_company_name ON customers(company_name);
CREATE INDEX idx_customer_bank_accounts_customer_id ON customer_bank_accounts(customer_id);
CREATE INDEX idx_customer_delivery_addresses_customer_id ON customer_delivery_addresses(customer_id);
CREATE INDEX idx_delivery_address_contacts_delivery_address_id ON delivery_address_contacts(delivery_address_id);