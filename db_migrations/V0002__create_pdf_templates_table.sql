CREATE TABLE IF NOT EXISTS t_p35957076_image_template_creat.pdf_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template_type VARCHAR(50) DEFAULT 'pdf',
    pdf_url TEXT,
    fields JSONB NOT NULL DEFAULT '[]',
    pdf_mappings JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pdf_templates_created_at ON t_p35957076_image_template_creat.pdf_templates(created_at DESC);