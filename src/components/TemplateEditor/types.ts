export interface FieldMapping {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  dbField: string;
  label: string;
  fieldType: 'text' | 'date' | 'number';
  tableName: string;
  selectedText?: string;
  maxLength?: number;
  subFields?: Array<{
    id: string;
    dbField: string;
    label: string;
    fieldType: 'text' | 'date' | 'number';
    tableName: string;
    maxLength?: number;
  }>;
}

export interface TemplateWithMappings {
  id: string;
  name: string;
  description?: string;
  pdfUrl: string | File;
  mappings: FieldMapping[];
}

export const DB_TABLES = [
  { name: 'customers', label: 'Заказчики', fields: ['name', 'inn', 'ogrn', 'address', 'phone', 'email'] },
  { name: 'carriers', label: 'Перевозчики', fields: ['name', 'inn', 'ogrn', 'address', 'phone', 'email'] },
  { name: 'cargo', label: 'Грузы', fields: ['name', 'weight', 'volume', 'type', 'conditions'] },
  { name: 'routes', label: 'Маршруты', fields: ['loading_address', 'loading_date', 'unloading_address', 'unloading_date'] },
  { name: 'drivers', label: 'Водители', fields: ['name', 'passport_series', 'passport_number', 'passport_issued_by', 'passport_issued_date', 'license', 'phone'] },
  { name: 'vehicles', label: 'ТС', fields: ['model', 'number', 'trailer_number', 'body_type'] },
  { name: 'contracts', label: 'Договоры', fields: ['number', 'date', 'amount', 'payment_terms'] }
];
