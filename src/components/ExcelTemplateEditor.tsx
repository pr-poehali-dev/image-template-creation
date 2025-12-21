import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Icon from './ui/icon';

export interface ExcelColumnMapping {
  columnIndex: number;
  columnLetter: string;
  columnName: string;
  dbField: string;
  tableName: string;
  fieldType: 'text' | 'date' | 'number';
  sampleData: string[];
}

export interface ExcelTemplateWithMappings {
  id: string;
  name: string;
  description?: string;
  excelFile: File;
  sheetName: string;
  mappings: ExcelColumnMapping[];
}

interface ExcelTemplateEditorProps {
  template: ExcelTemplateWithMappings;
  onSave: (mappings: ExcelColumnMapping[], sheetName: string, name: string, description: string) => void;
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

export default function ExcelTemplateEditor({ template, onSave, onClose }: ExcelTemplateEditorProps) {
  const [workbookData, setWorkbookData] = useState<any[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<ExcelColumnMapping[]>(template.mappings || []);
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [sheets, setSheets] = useState<string[]>([]);
  const [currentSheet, setCurrentSheet] = useState<string>(template.sheetName || '');
  const [templateName, setTemplateName] = useState(template.name);
  const [templateDescription, setTemplateDescription] = useState(template.description || '');

  useEffect(() => {
    loadExcelFile();
  }, []);

  useEffect(() => {
    if (currentSheet && sheets.length > 0) {
      loadSheetData();
    }
  }, [currentSheet]);

  const loadExcelFile = async () => {
    try {
      const arrayBuffer = await template.excelFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      
      setSheets(workbook.SheetNames);
      const firstSheet = workbook.SheetNames[0];
      setCurrentSheet(firstSheet);

      const worksheet = workbook.Sheets[firstSheet];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length > 0) {
        const headerRow = jsonData[0].map((h: any) => String(h || ''));
        setHeaders(headerRow);
        setWorkbookData(jsonData.slice(1));

        const autoMappings: ExcelColumnMapping[] = headerRow.map((colName, index) => {
          const sampleData = jsonData.slice(1, 6).map(row => String(row[index] || '')).filter(v => v);
          
          return {
            columnIndex: index,
            columnLetter: getColumnLetter(index),
            columnName: colName,
            dbField: '',
            tableName: 'customers',
            fieldType: 'text',
            sampleData
          };
        });

        setMappings(autoMappings);
      }
    } catch (error) {
      console.error('Ошибка загрузки Excel:', error);
      alert('Не удалось загрузить Excel файл');
    }
  };

  const loadSheetData = async () => {
    try {
      const arrayBuffer = await template.excelFile.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[currentSheet];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length > 0) {
        const headerRow = jsonData[0].map((h: any) => String(h || ''));
        setHeaders(headerRow);
        setWorkbookData(jsonData.slice(1));

        const autoMappings: ExcelColumnMapping[] = headerRow.map((colName, index) => {
          const sampleData = jsonData.slice(1, 6).map(row => String(row[index] || '')).filter(v => v);
          
          return {
            columnIndex: index,
            columnLetter: getColumnLetter(index),
            columnName: colName,
            dbField: '',
            tableName: 'customers',
            fieldType: 'text',
            sampleData
          };
        });

        setMappings(autoMappings);
      }
    } catch (error) {
      console.error('Ошибка загрузки листа:', error);
    }
  };

  const getColumnLetter = (index: number): string => {
    let letter = '';
    let num = index;
    while (num >= 0) {
      letter = String.fromCharCode((num % 26) + 65) + letter;
      num = Math.floor(num / 26) - 1;
    }
    return letter;
  };

  const handleUpdateMapping = (columnIndex: number, updates: Partial<ExcelColumnMapping>) => {
    setMappings(mappings.map(m => 
      m.columnIndex === columnIndex ? { ...m, ...updates } : m
    ));
  };

  const handleSave = () => {
    const configuredMappings = mappings.filter(m => m.dbField);
    if (configuredMappings.length === 0) {
      alert('Настройте хотя бы одну колонку');
      return;
    }
    onSave(configuredMappings, currentSheet, templateName, templateDescription);
  };

  const selectedMapping = selectedColumn !== null && mappings.length > selectedColumn
    ? mappings[selectedColumn] 
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex-1 mr-4">
            <div className="grid grid-cols-2 gap-3 mb-2">
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
            <p className="text-xs text-gray-600">Кликните на заголовок колонки для настройки привязки к БД</p>
          </div>
          <div className="flex items-center gap-2">
            {sheets.length > 1 && (
              <select
                value={currentSheet}
                onChange={(e) => setCurrentSheet(e.target.value)}
                className="px-3 py-2 border rounded-lg"
              >
                {sheets.map(sheet => (
                  <option key={sheet} value={sheet}>{sheet}</option>
                ))}
              </select>
            )}
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
          <div className="flex-1 overflow-auto bg-gray-50 p-4">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border bg-gray-100 px-2 py-2 text-xs font-semibold w-12 sticky left-0 z-10">
                        #
                      </th>
                      {headers.map((header, index) => {
                        const mapping = mappings.length > index ? mappings[index] : undefined;
                        const isConfigured = mapping?.dbField;
                        const isSelected = selectedColumn === index;
                        
                        return (
                          <th
                            key={index}
                            onClick={() => setSelectedColumn(index)}
                            className={`border px-3 py-2 cursor-pointer transition-colors min-w-[150px] ${
                              isSelected 
                                ? 'bg-blue-100 border-blue-500 border-2' 
                                : isConfigured 
                                  ? 'bg-green-50 hover:bg-green-100' 
                                  : 'bg-red-50 hover:bg-red-100'
                            }`}
                          >
                            <div className="flex flex-col items-start gap-1">
                              <div className="flex items-center gap-2 w-full">
                                <span className="font-mono text-xs text-gray-500">{getColumnLetter(index)}</span>
                                <span className="font-semibold text-sm">{header}</span>
                                {isConfigured ? (
                                  <Icon name="Check" size={14} className="text-green-600 ml-auto" />
                                ) : (
                                  <Icon name="AlertCircle" size={14} className="text-red-600 ml-auto" />
                                )}
                              </div>
                              {isConfigured && (
                                <div className="text-xs text-gray-600 font-normal">
                                  → {mapping.tableName}.{mapping.dbField}
                                </div>
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {workbookData.slice(0, 20).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="border bg-gray-50 px-2 py-1 text-xs text-gray-500 text-center sticky left-0 z-10">
                          {rowIndex + 1}
                        </td>
                        {headers.map((_, colIndex) => {
                          const isSelected = selectedColumn === colIndex;
                          return (
                            <td
                              key={colIndex}
                              className={`border px-3 py-2 text-sm ${
                                isSelected ? 'bg-blue-50' : ''
                              }`}
                            >
                              {String(row[colIndex] || '')}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {workbookData.length > 20 && (
                <div className="p-3 text-sm text-gray-500 text-center border-t bg-gray-50">
                  Показано 20 из {workbookData.length} строк
                </div>
              )}
            </div>
          </div>

          <div className="w-80 border-l bg-white overflow-y-auto p-4">
            <h4 className="font-semibold mb-4">
              Настройка колонок ({mappings.filter(m => m.dbField).length}/{mappings.length})
            </h4>

            {selectedMapping ? (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Колонка</div>
                  <div className="font-semibold">{selectedMapping.columnLetter}: {selectedMapping.columnName}</div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Таблица БД</label>
                  <select
                    value={selectedMapping.tableName}
                    onChange={(e) => handleUpdateMapping(selectedMapping.columnIndex, { 
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
                    onChange={(e) => handleUpdateMapping(selectedMapping.columnIndex, { dbField: e.target.value })}
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
                    onChange={(e) => handleUpdateMapping(selectedMapping.columnIndex, { fieldType: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="text">Текст</option>
                    <option value="date">Дата</option>
                    <option value="number">Число</option>
                  </select>
                </div>

                {selectedMapping.sampleData.length > 0 && (
                  <div className="p-3 bg-gray-50 border rounded-lg">
                    <div className="text-xs font-medium text-gray-600 mb-2">Примеры данных:</div>
                    <div className="space-y-1">
                      {selectedMapping.sampleData.slice(0, 3).map((sample, i) => (
                        <div key={i} className="text-sm text-gray-700 truncate">• {sample}</div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="text-xs text-gray-500 mb-2">
                    Значение: <code className="bg-gray-100 px-1 rounded">
                      {selectedMapping.tableName}.{selectedMapping.dbField || '???'}
                    </code>
                  </div>
                  <button
                    onClick={() => handleUpdateMapping(selectedMapping.columnIndex, { dbField: '', tableName: 'customers' })}
                    className="w-full px-3 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50"
                  >
                    Сбросить настройки
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Icon name="MousePointerClick" size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Выберите колонку в таблице<br />для настройки привязки к БД</p>
              </div>
            )}

            <div className="mt-6 pt-6 border-t">
              <h5 className="font-medium mb-2">Все колонки</h5>
              <div className="space-y-2">
                {mappings.map(mapping => (
                  <div
                    key={mapping.columnIndex}
                    onClick={() => setSelectedColumn(mapping.columnIndex)}
                    className={`p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedColumn === mapping.columnIndex ? 'bg-blue-50 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-gray-500">{mapping.columnLetter}</span>
                        <span className="text-sm font-medium">{mapping.columnName}</span>
                      </div>
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}