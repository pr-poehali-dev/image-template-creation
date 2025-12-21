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
}

export interface TemplateWithMappings {
  id: string;
  name: string;
  pdfUrl: string | File;
  mappings: FieldMapping[];
}

interface TemplateEditorProps {
  template: TemplateWithMappings;
  onSave: (mappings: FieldMapping[]) => void;
  onClose: () => void;
}

const DB_TABLES = [
  { name: 'customers', label: 'Заказчики', fields: ['name', 'inn', 'ogrn', 'address', 'phone', 'email'] },
  { name: 'carriers', label: 'Перевозчики', fields: ['name', 'inn', 'ogrn', 'address', 'phone', 'email'] },
  { name: 'cargo', label: 'Грузы', fields: ['name', 'weight', 'volume', 'type', 'conditions'] },
  { name: 'routes', label: 'Маршруты', fields: ['loading_address', 'loading_date', 'unloading_address', 'unloading_date'] },
  { name: 'drivers', label: 'Водители', fields: ['name', 'passport', 'license', 'phone'] },
  { name: 'vehicles', label: 'ТС', fields: ['model', 'number', 'trailer_number', 'body_type'] },
  { name: 'contracts', label: 'Договоры', fields: ['number', 'date', 'amount', 'payment_terms'] }
];

export default function TemplateEditor({ template, onSave, onClose }: TemplateEditorProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mappings, setMappings] = useState<FieldMapping[]>(template.mappings || []);
  const [selectedMapping, setSelectedMapping] = useState<FieldMapping | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1.0);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);
    setDrawStart({ x, y });
    setCurrentRect({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !drawStart || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentRect({
      x: Math.min(drawStart.x, x),
      y: Math.min(drawStart.y, y),
      width: Math.abs(x - drawStart.x),
      height: Math.abs(y - drawStart.y)
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentRect || currentRect.width < 10 || currentRect.height < 10) {
      setIsDrawing(false);
      setDrawStart(null);
      setCurrentRect(null);
      return;
    }

    const newMapping: FieldMapping = {
      id: Date.now().toString(),
      x: currentRect.x,
      y: currentRect.y,
      width: currentRect.width,
      height: currentRect.height,
      page: currentPage,
      dbField: '',
      label: 'Новое поле',
      fieldType: 'text',
      tableName: 'customers'
    };

    setMappings([...mappings, newMapping]);
    setSelectedMapping(newMapping);
    setIsDrawing(false);
    setDrawStart(null);
    setCurrentRect(null);
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
    onSave(mappings);
  };

  const getFieldColor = (mapping: FieldMapping) => {
    if (!mapping.dbField) return 'rgba(220, 38, 38, 0.3)';
    return 'rgba(34, 197, 94, 0.3)';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-xl font-semibold">{template.name}</h3>
            <p className="text-sm text-gray-600">Кликните и перетащите для создания поля. Красные = не настроены, зеленые = настроены</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
              className="p-2 hover:bg-gray-100 rounded"
              title="Уменьшить"
            >
              <Icon name="ZoomOut" size={20} />
            </button>
            <span className="text-sm font-mono">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale(s => Math.min(2, s + 0.1))}
              className="p-2 hover:bg-gray-100 rounded"
              title="Увеличить"
            >
              <Icon name="ZoomIn" size={20} />
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Icon name="Save" size={20} />
              Сохранить
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
              <Icon name="X" size={24} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-auto bg-gray-100 p-4">
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <Icon name="ChevronLeft" size={20} />
                </button>
                <span className="text-sm">
                  Страница {currentPage} из {numPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))}
                  disabled={currentPage === numPages}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <Icon name="ChevronRight" size={20} />
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <div
                ref={containerRef}
                className="relative bg-white shadow-lg cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
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
                      className={`absolute border-2 cursor-pointer transition-all ${
                        selectedMapping?.id === mapping.id ? 'border-blue-500' : 'border-red-500'
                      }`}
                      style={{
                        left: mapping.x * scale,
                        top: mapping.y * scale,
                        width: mapping.width * scale,
                        height: mapping.height * scale,
                        backgroundColor: getFieldColor(mapping)
                      }}
                      title={mapping.label}
                    >
                      <div className="absolute -top-6 left-0 bg-white px-1 py-0.5 text-xs border rounded shadow-sm whitespace-nowrap">
                        {mapping.label}
                      </div>
                    </div>
                  ))}

                {currentRect && (
                  <div
                    className="absolute border-2 border-blue-500 bg-blue-500/20 pointer-events-none"
                    style={{
                      left: currentRect.x,
                      top: currentRect.y,
                      width: currentRect.width,
                      height: currentRect.height
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="w-80 border-l bg-white overflow-y-auto p-4">
            <h4 className="font-semibold mb-4">Настройка полей ({mappings.length})</h4>

            {selectedMapping ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Название поля</label>
                  <input
                    type="text"
                    value={selectedMapping.label}
                    onChange={(e) => handleUpdateMapping(selectedMapping.id, { label: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Таблица БД</label>
                  <select
                    value={selectedMapping.tableName}
                    onChange={(e) => handleUpdateMapping(selectedMapping.id, { 
                      tableName: e.target.value,
                      dbField: ''
                    })}
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
                    value={selectedMapping.dbField}
                    onChange={(e) => handleUpdateMapping(selectedMapping.id, { dbField: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="">Выберите поле</option>
                    {DB_TABLES.find(t => t.name === selectedMapping.tableName)?.fields.map(field => (
                      <option key={field} value={field}>{field}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Тип данных</label>
                  <select
                    value={selectedMapping.fieldType}
                    onChange={(e) => handleUpdateMapping(selectedMapping.id, { fieldType: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="text">Текст</option>
                    <option value="date">Дата</option>
                    <option value="number">Число</option>
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 mb-2">
                    Значение будет: <code className="bg-gray-100 px-1 rounded">{selectedMapping.tableName}.{selectedMapping.dbField || '???'}</code>
                  </p>
                  <button
                    onClick={() => handleDeleteMapping(selectedMapping.id)}
                    className="w-full px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 flex items-center justify-center gap-2"
                  >
                    <Icon name="Trash2" size={16} />
                    Удалить поле
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Icon name="MousePointerClick" size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Нарисуйте прямоугольник на PDF<br />или выберите существующее поле</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t">
              <h5 className="font-medium mb-2">Все поля</h5>
              <div className="space-y-2">
                {mappings.length === 0 ? (
                  <p className="text-sm text-gray-500">Полей пока нет</p>
                ) : (
                  mappings.map(mapping => (
                    <div
                      key={mapping.id}
                      onClick={() => setSelectedMapping(mapping)}
                      className={`p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                        selectedMapping?.id === mapping.id ? 'bg-blue-50 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{mapping.label}</span>
                        {mapping.dbField ? (
                          <Icon name="Check" size={14} className="text-green-600" />
                        ) : (
                          <Icon name="AlertCircle" size={14} className="text-red-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {mapping.dbField ? `${mapping.tableName}.${mapping.dbField}` : 'Не настроено'}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}