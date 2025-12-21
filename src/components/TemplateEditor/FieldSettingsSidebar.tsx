import Icon from '../ui/icon';
import { FieldMapping, DB_TABLES } from './types';

interface FieldSettingsSidebarProps {
  sidebarWidth: number;
  selectedText: string;
  selectionRect: { x: number; y: number; width: number; height: number } | null;
  selectedMapping: FieldMapping | null;
  onMouseDown: () => void;
  onCreateField: () => void;
  onUpdateMapping: (id: string, updates: Partial<FieldMapping>) => void;
  onDeleteMapping: (id: string) => void;
  onEditSubField: (mappingId: string, subFieldId: string) => void;
  setSelectedMapping: (mapping: FieldMapping | null) => void;
}

export default function FieldSettingsSidebar({
  sidebarWidth,
  selectedText,
  selectionRect,
  selectedMapping,
  onMouseDown,
  onCreateField,
  onUpdateMapping,
  onDeleteMapping,
  onEditSubField,
  setSelectedMapping
}: FieldSettingsSidebarProps) {
  return (
    <div 
      className="relative border-l bg-gray-50 overflow-y-auto"
      style={{ width: `${sidebarWidth}px` }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors"
        onMouseDown={onMouseDown}
        style={{ zIndex: 10 }}
      />
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-900">Настройка поля</h4>
      </div>
      <div className="p-4">

      {selectedText && selectionRect && !selectedMapping ? (
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-xs font-medium text-gray-600 mb-1">Выделенный текст</div>
            <div className="font-medium text-sm">{selectedText}</div>
          </div>
          <button
            onClick={onCreateField}
            className="w-full px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2 transition-colors text-sm font-medium"
          >
            <Icon name="Plus" size={16} />
            Создать поле
          </button>
        </div>
      ) : null}

      {selectedMapping ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Таблица БД <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedMapping.tableName}
              onChange={(e) => onUpdateMapping(selectedMapping.id, { 
                tableName: e.target.value,
                dbField: ''
              })}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              {DB_TABLES.map(table => (
                <option key={table.name} value={table.name}>{table.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Поле БД <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedMapping.dbField}
              onChange={(e) => onUpdateMapping(selectedMapping.id, { dbField: e.target.value })}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            >
              <option value="">Выберите поле</option>
              {DB_TABLES.find(t => t.name === selectedMapping.tableName)?.fields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Название поля <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={selectedMapping.label}
              onChange={(e) => onUpdateMapping(selectedMapping.id, { label: e.target.value })}
              className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Тип данных</label>
            <select
              value={selectedMapping.fieldType}
              onChange={(e) => onUpdateMapping(selectedMapping.id, { fieldType: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="text">Текст</option>
              <option value="date">Дата</option>
              <option value="number">Число</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Макс. длина (перенос)</label>
            <input
              type="number"
              value={selectedMapping.maxLength || ''}
              onChange={(e) => onUpdateMapping(selectedMapping.id, { maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
              placeholder="Не ограничено"
              className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            />
          </div>

          <div className="pt-3 border-t">
            <h5 className="text-xs font-semibold text-gray-700 mb-2">Дополнительные поля в этой ячейке</h5>
            {selectedMapping.subFields && selectedMapping.subFields.length > 0 ? (
              <div className="space-y-1.5 mb-2">
                {selectedMapping.subFields.map((subField, idx) => (
                  <div key={subField.id} className="p-2 bg-white rounded border border-gray-200 text-xs hover:bg-gray-50 cursor-pointer" onClick={() => onEditSubField(selectedMapping.id, subField.id)}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">{subField.label}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const newSubFields = selectedMapping.subFields?.filter(sf => sf.id !== subField.id) || [];
                          onUpdateMapping(selectedMapping.id, { subFields: newSubFields.length > 0 ? newSubFields : undefined });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                    <div className="text-gray-600">{subField.dbField ? `${subField.tableName}.${subField.dbField}` : 'Не настроено'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 mb-2">Нет доп. полей</p>
            )}
            <button
              onClick={() => {
                const newSubField = {
                  id: Date.now().toString(),
                  dbField: '',
                  label: 'Подполе ' + ((selectedMapping.subFields?.length || 0) + 1),
                  fieldType: 'text' as const,
                  tableName: selectedMapping.tableName
                };
                const currentSubFields = selectedMapping.subFields || [];
                onUpdateMapping(selectedMapping.id, { subFields: [...currentSubFields, newSubField] });
              }}
              className="w-full px-2.5 py-1.5 text-xs bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1.5 font-medium"
            >
              <Icon name="Plus" size={12} />
              Добавить подполе
            </button>
          </div>

          <div className="pt-3 border-t space-y-2">
            <p className="text-xs text-gray-500">
              Значение: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{selectedMapping.tableName}.{selectedMapping.dbField || '???'}</code>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMapping(null)}
                className="flex-1 px-3 py-1.5 text-sm bg-primary text-white border border-primary rounded-lg hover:bg-primary/90 flex items-center justify-center gap-1.5 font-medium"
              >
                <Icon name="Check" size={14} />
                Применить
              </button>
              <button
                onClick={() => onDeleteMapping(selectedMapping.id)}
                className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 flex items-center justify-center gap-1.5 font-medium"
              >
                <Icon name="Trash2" size={14} />
                Удалить
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <Icon name="MousePointerClick" size={48} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Выделите текст в PDF<br />или кликните на цветное поле</p>
        </div>
      )}
      </div>
    </div>
  );
}
