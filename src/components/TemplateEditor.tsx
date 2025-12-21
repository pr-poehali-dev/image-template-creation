import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Icon from './ui/icon';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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

interface TemplateEditorProps {
  template: TemplateWithMappings;
  onSave: (mappings: FieldMapping[], name: string, description: string) => void;
  onClose: () => void;
}

const DB_TABLES = [
  { name: 'customers', label: 'Заказчики', fields: ['name', 'inn', 'ogrn', 'address', 'phone', 'email'] },
  { name: 'carriers', label: 'Перевозчики', fields: ['name', 'inn', 'ogrn', 'address', 'phone', 'email'] },
  { name: 'cargo', label: 'Грузы', fields: ['name', 'weight', 'volume', 'type', 'conditions'] },
  { name: 'routes', label: 'Маршруты', fields: ['loading_address', 'loading_date', 'unloading_address', 'unloading_date'] },
  { name: 'drivers', label: 'Водители', fields: ['name', 'passport_series', 'passport_number', 'passport_issued_by', 'passport_issued_date', 'license', 'phone'] },
  { name: 'vehicles', label: 'ТС', fields: ['model', 'number', 'trailer_number', 'body_type'] },
  { name: 'contracts', label: 'Договоры', fields: ['number', 'date', 'amount', 'payment_terms'] }
];

export default function TemplateEditor({ template, onSave, onClose }: TemplateEditorProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mappings, setMappings] = useState<FieldMapping[]>(template.mappings || []);
  const [selectedMapping, setSelectedMapping] = useState<FieldMapping | null>(null);
  const [templateName, setTemplateName] = useState(template.name);
  const [templateDescription, setTemplateDescription] = useState(template.description || '');
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionRect, setSelectionRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1.0);
  const [editingSubField, setEditingSubField] = useState<{ mappingId: string; subFieldId: string } | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(384);
  const [isResizing, setIsResizing] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      const range = selection.getRangeAt(0);
      const text = selection.toString().trim();
      
      if (text && containerRef.current) {
        const rect = range.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        const selX = (rect.left - containerRect.left) / scale;
        const selY = (rect.top - containerRect.top) / scale;
        const selWidth = rect.width / scale;
        const selHeight = rect.height / scale;
        
        const existingField = mappings.find(m => 
          m.page === currentPage &&
          selX >= m.x && selX <= m.x + m.width &&
          selY >= m.y && selY <= m.y + m.height
        );
        
        if (existingField) {
          setSelectedMapping(existingField);
          setSelectedText('');
          setSelectionRect(null);
        } else {
          setSelectedMapping(null);
          setSelectedText(text);
          setSelectionRect({
            x: selX,
            y: selY,
            width: selWidth,
            height: selHeight
          });
        }
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, [scale, mappings, currentPage]);

  const handleCreateField = () => {
    if (!selectedText || !selectionRect) return;

    const newMapping: FieldMapping = {
      id: Date.now().toString(),
      x: selectionRect.x,
      y: selectionRect.y,
      width: selectionRect.width,
      height: selectionRect.height,
      page: currentPage,
      dbField: '',
      label: selectedText,
      fieldType: 'text',
      tableName: 'customers',
      selectedText: selectedText
    };

    setMappings([...mappings, newMapping]);
    setSelectedMapping(newMapping);
    setSelectedText('');
    setSelectionRect(null);
    window.getSelection()?.removeAllRanges();
  };

  const handleDeleteMapping = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id));
    if (selectedMapping?.id === id) {
      setSelectedMapping(null);
    }
  };

  const handleUpdateMapping = (id: string, updates: Partial<FieldMapping>) => {
    setMappings(mappings.map(m => m.id === id ? { ...m, ...updates } : m));
    if (selectedMapping?.id === id) {
      setSelectedMapping({ ...selectedMapping, ...updates });
    }
  };

  const handleSave = () => {
    onSave(mappings, templateName, templateDescription);
    onClose();
  };

  const getFieldColor = (mapping: FieldMapping) => {
    const hasMainField = !!mapping.dbField;
    const hasAllSubFields = !mapping.subFields || mapping.subFields.every(sf => !!sf.dbField);
    
    if (hasMainField && hasAllSubFields) {
      return 'rgba(34, 197, 94, 0.3)';
    }
    return 'rgba(220, 38, 38, 0.3)';
  };

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 300 && newWidth <= 800) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[95vw] h-[95vh] flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Редактор шаблона</h3>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Icon name="X" size={20} className="text-gray-600" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Название шаблона</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Введите название"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Описание</label>
              <input
                type="text"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Введите описание"
              />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Выделите текст в PDF. Красные = не настроены, зеленые = настроены</p>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-auto bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                  className="p-2 bg-white hover:bg-gray-50 rounded border border-gray-300 transition-colors"
                  title="Уменьшить"
                >
                  <Icon name="ZoomOut" size={18} />
                </button>
                <span className="text-sm font-mono px-3 font-semibold">{Math.round(scale * 100)}%</span>
                <button
                  onClick={() => setScale(s => Math.min(2, s + 0.1))}
                  className="p-2 bg-white hover:bg-gray-50 rounded border border-gray-300 transition-colors"
                  title="Увеличить"
                >
                  <Icon name="ZoomIn" size={18} />
                </button>
              </div>
              
              <div className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg shadow-md">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="ChevronLeft" size={22} />
                </button>
                <span className="text-sm font-bold min-w-[130px] text-center">
                  Страница {currentPage} из {numPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                  disabled={currentPage === numPages}
                  className="p-1 hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Icon name="ChevronRight" size={22} />
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <div
                ref={containerRef}
                className="relative bg-white shadow-lg cursor-text select-text"
                style={{ width: 'fit-content' }}
              >
                <Document file={template.pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page pageNumber={currentPage} scale={scale} />
                </Document>

                {mappings
                  .filter(m => m.page === currentPage)
                  .map(mapping => (
                    <div
                      key={mapping.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMapping(mapping);
                      }}
                      className={`absolute cursor-pointer transition-all ${
                        selectedMapping?.id === mapping.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{
                        left: mapping.x * scale,
                        top: mapping.y * scale,
                        width: mapping.width * scale,
                        height: mapping.height * scale,
                        backgroundColor: getFieldColor(mapping)
                      }}
                      title={mapping.label}
                    />
                  ))}

                {selectionRect && selectedText && (
                  <div
                    className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
                    style={{
                      left: selectionRect.x * scale,
                      top: selectionRect.y * scale,
                      width: selectionRect.width * scale,
                      height: selectionRect.height * scale
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div 
            className="relative border-l bg-gray-50 overflow-y-auto"
            style={{ width: `${sidebarWidth}px` }}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors"
              onMouseDown={handleMouseDown}
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
                  onClick={handleCreateField}
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
                    onChange={(e) => handleUpdateMapping(selectedMapping.id, { 
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
                    onChange={(e) => handleUpdateMapping(selectedMapping.id, { dbField: e.target.value })}
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
                    onChange={(e) => handleUpdateMapping(selectedMapping.id, { label: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Тип данных</label>
                  <select
                    value={selectedMapping.fieldType}
                    onChange={(e) => handleUpdateMapping(selectedMapping.id, { fieldType: e.target.value as any })}
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
                    onChange={(e) => handleUpdateMapping(selectedMapping.id, { maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="Не ограничено"
                    className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                  />
                </div>

                <div className="pt-3 border-t">
                  <h5 className="text-xs font-semibold text-gray-700 mb-2">Дополнительные поля в этой ячейке</h5>
                  {selectedMapping.subFields && selectedMapping.subFields.length > 0 ? (
                    <div className="space-y-1.5 mb-2">
                      {selectedMapping.subFields.map((subField, idx) => (
                        <div key={subField.id} className="p-2 bg-white rounded border border-gray-200 text-xs hover:bg-gray-50 cursor-pointer" onClick={() => setEditingSubField({ mappingId: selectedMapping.id, subFieldId: subField.id })}>
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium">{subField.label}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newSubFields = selectedMapping.subFields?.filter(sf => sf.id !== subField.id) || [];
                                handleUpdateMapping(selectedMapping.id, { subFields: newSubFields.length > 0 ? newSubFields : undefined });
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
                      handleUpdateMapping(selectedMapping.id, { subFields: [...currentSubFields, newSubField] });
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
                      onClick={() => {
                        onSave(mappings);
                      }}
                      className="flex-1 px-3 py-1.5 text-sm bg-primary text-white border border-primary rounded-lg hover:bg-primary/90 flex items-center justify-center gap-1.5 font-medium"
                    >
                      <Icon name="Check" size={14} />
                      Применить
                    </button>
                    <button
                      onClick={() => handleDeleteMapping(selectedMapping.id)}
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
        </div>
        
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-3 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
          >
            <Icon name="Save" size={18} />
            Сохранить
          </button>
        </div>
      </div>

      {editingSubField && (() => {
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
                      const updatedSubFields = mapping.subFields?.map(sf => 
                        sf.id === subField.id ? { ...sf, label: e.target.value } : sf
                      );
                      handleUpdateMapping(mapping.id, { subFields: updatedSubFields });
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Таблица БД</label>
                  <select
                    value={subField.tableName}
                    onChange={(e) => {
                      const updatedSubFields = mapping.subFields?.map(sf => 
                        sf.id === subField.id ? { ...sf, tableName: e.target.value, dbField: '' } : sf
                      );
                      handleUpdateMapping(mapping.id, { subFields: updatedSubFields });
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
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
                      const updatedSubFields = mapping.subFields?.map(sf => 
                        sf.id === subField.id ? { ...sf, dbField: e.target.value } : sf
                      );
                      handleUpdateMapping(mapping.id, { subFields: updatedSubFields });
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
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
                      const updatedSubFields = mapping.subFields?.map(sf => 
                        sf.id === subField.id ? { ...sf, fieldType: e.target.value as any } : sf
                      );
                      handleUpdateMapping(mapping.id, { subFields: updatedSubFields });
                    }}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="text">Текст</option>
                    <option value="date">Дата</option>
                    <option value="number">Число</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Макс. длина (перенос)</label>
                  <input
                    type="number"
                    value={subField.maxLength || ''}
                    onChange={(e) => {
                      const updatedSubFields = mapping.subFields?.map(sf => 
                        sf.id === subField.id ? { ...sf, maxLength: e.target.value ? parseInt(e.target.value) : undefined } : sf
                      );
                      handleUpdateMapping(mapping.id, { subFields: updatedSubFields });
                    }}
                    placeholder="Не ограничено"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => setEditingSubField(null)}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Готово
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}