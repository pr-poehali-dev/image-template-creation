ALTER TABLE t_p35957076_image_template_creat.vehicles 
  ADD COLUMN IF NOT EXISTS vehicle_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS trailer VARCHAR(20),
  ADD COLUMN IF NOT EXISTS body_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS transport_company VARCHAR(100),
  ADD COLUMN IF NOT EXISTS driver_id INTEGER;

CREATE INDEX IF NOT EXISTS idx_vehicles_driver ON t_p35957076_image_template_creat.vehicles(driver_id);