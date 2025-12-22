CREATE TABLE IF NOT EXISTS t_p35957076_image_template_creat.vehicles (
  id SERIAL PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER,
  license_plate VARCHAR(20) NOT NULL UNIQUE,
  vin VARCHAR(17),
  registration_certificate VARCHAR(50),
  pts_series VARCHAR(10),
  pts_number VARCHAR(20),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicles_license_plate ON t_p35957076_image_template_creat.vehicles(license_plate);
CREATE INDEX idx_vehicles_brand ON t_p35957076_image_template_creat.vehicles(brand);