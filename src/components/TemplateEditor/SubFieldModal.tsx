import Icon from '../ui/icon';
import { FieldMapping, DB_TABLES } from './types';

interface SubFieldModalProps {
  editingSubField: { mappingId: string; subFieldId: string } | null;
  mappings: FieldMapping[];
  onClose: () => void;
  onUpdateMapping: (id: string, updates: Partial<FieldMapping>) => void;
}

export default function SubFieldModal({
  editingSubField,
  mappings,
  onClose,
  onUpdateMapping
}: SubFieldModalProps) {
  if (!editingSubField) return null;

  const mapping = mappings.find(m => m.id === editingSubField.mappingId);
  const subField = mapping?.subFields?.find(sf => sf.id === editingSubField.subFieldId);
  
  if (!mapping || !subField) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h4 className="text-lg font-semibold mb-4">Редактирование подполя</h4>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Название</label>
            <input
              type="text"
              value={subField.label}
              onChange={(e) => {
                const newSubFields = mapping.subFields?.map(sf => 
                  sf.id === subField.id ? { ...sf, label: e.target.value } : sf
                );
                onUpdateMapping(mapping.id, { subFields: newSubFields });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Таблица БД</label>
            <select
              value={subField.tableName}
              onChange={(e) => {
                const newSubFields = mapping.subFields?.map(sf => 
                  sf.id === subField.id ? { ...sf, tableName: e.target.value, dbField: '' } : sf
                );
                onUpdateMapping(mapping.id, { subFields: newSubFields });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {DB_TABLES.map(table => (
                <option key={table.name} value={table.name}>{table.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Поле БД</label>
            <select
              value={subField.dbField}
              onChange={(e) => {
                const newSubFields = mapping.subFields?.map(sf => 
                  sf.id === subField.id ? { ...sf, dbField: e.target.value } : sf
                );
                onUpdateMapping(mapping.id, { subFields: newSubFields });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Выберите поле</option>
              {DB_TABLES.find(t => t.name === subField.tableName)?.fields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Тип данных</label>
            <select
              value={subField.fieldType}
              onChange={(e) => {
                const newSubFields = mapping.subFields?.map(sf => 
                  sf.id === subField.id ? { ...sf, fieldType: e.target.value as any } : sf
                );
                onUpdateMapping(mapping.id, { subFields: newSubFields });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="text">Текст</option>
              <option value="date">Дата</option>
              <option value="number">Число</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Макс. длина</label>
            <input
              type="number"
              value={subField.maxLength || ''}
              onChange={(e) => {
                const newSubFields = mapping.subFields?.map(sf => 
                  sf.id === subField.id ? { ...sf, maxLength: e.target.value ? parseInt(e.target.value) : undefined } : sf
                );
                onUpdateMapping(mapping.id, { subFields: newSubFields });
              }}
              placeholder="Не ограничено"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Icon name="Check" size={18} className="inline mr-1" />
              Готово
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
