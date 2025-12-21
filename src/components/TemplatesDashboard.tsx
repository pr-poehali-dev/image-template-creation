import { useState, useRef, useEffect } from 'react';
import Icon from './ui/icon';
import TemplateEditor, { TemplateWithMappings, FieldMapping } from './TemplateEditor';
import ExcelTemplateEditor, { ExcelTemplateWithMappings, ExcelColumnMapping } from './ExcelTemplateEditor';

export interface TemplateField {
  name: string;
  label: string;
  type: 'text' | 'date' | 'textarea' | 'number';
  required: boolean;
  section: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  fields: TemplateField[];
  pdfPreviewUrl?: string;
  pdfFile?: File;
  excelFile?: File;
  templateType: 'pdf' | 'excel';
  excelSheetName?: string;
  pdfMappings?: FieldMapping[];
  excelMappings?: ExcelColumnMapping[];
}

const STORAGE_KEY = 'poehali_templates';
const FILE_CACHE_KEY = 'poehali_template_files';

interface StoredTemplate extends Omit<ReportTemplate, 'pdfFile' | 'excelFile'> {
  pdfFileId?: string;
  excelFileId?: string;
  pdfMappings?: FieldMapping[];
  excelMappings?: ExcelColumnMapping[];
}

export default function TemplatesDashboard() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [fileCache] = useState<Map<string, File>>(new Map());

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (stored) {
      try {
        const storedTemplates: StoredTemplate[] = JSON.parse(stored);
        const restored: ReportTemplate[] = storedTemplates.map(st => {
          const template: ReportTemplate = {
            id: st.id,
            name: st.name,
            description: st.description,
            createdAt: st.createdAt,
            fields: st.fields,
            templateType: st.templateType,
            pdfPreviewUrl: st.pdfPreviewUrl,
            excelSheetName: st.excelSheetName,
            pdfMappings: st.pdfMappings,
            excelMappings: st.excelMappings
          };
          if (st.pdfFileId && fileCache.has(st.pdfFileId)) {
            template.pdfFile = fileCache.get(st.pdfFileId);
          }
          if (st.excelFileId && fileCache.has(st.excelFileId)) {
            template.excelFile = fileCache.get(st.excelFileId);
          }
          return template;
        });
        setTemplates(restored);
      } catch (e) {
        console.error('Ошибка загрузки шаблонов:', e);
        setTemplates([]);
      }
    } else {
      const defaultTemplate: ReportTemplate = {
        id: '1',
        name: 'Договор-заявка на перевозку',
        description: 'Стандартный шаблон договора-заявки для транспортных компаний',
        createdAt: '2025-12-21',
        templateType: 'pdf',
        fields: [
          { name: 'number', label: 'Номер договора', type: 'text', required: true, section: 'Основное' },
          { name: 'date', label: 'Дата', type: 'date', required: true, section: 'Основное' },
          { name: 'customerName', label: 'Заказчик', type: 'text', required: true, section: 'Заказчик' },
          { name: 'customerInn', label: 'ИНН', type: 'text', required: true, section: 'Заказчик' },
          { name: 'carrierName', label: 'Перевозчик', type: 'text', required: true, section: 'Перевозчик' },
          { name: 'cargoName', label: 'Груз', type: 'text', required: true, section: 'Груз' },
          { name: 'amount', label: 'Сумма', type: 'text', required: true, section: 'Оплата' }
        ]
      };
      setTemplates([defaultTemplate]);
    }
  }, []);

  useEffect(() => {
    const toStore: StoredTemplate[] = templates.map(t => {
      const stored: StoredTemplate = {
        id: t.id,
        name: t.name,
        description: t.description,
        createdAt: t.createdAt,
        fields: t.fields,
        templateType: t.templateType,
        pdfPreviewUrl: t.pdfPreviewUrl,
        excelSheetName: t.excelSheetName,
        pdfMappings: t.pdfMappings,
        excelMappings: t.excelMappings
      };
      if (t.pdfFile) {
        stored.pdfFileId = t.id + '_pdf';
        fileCache.set(stored.pdfFileId, t.pdfFile);
      }
      if (t.excelFile) {
        stored.excelFileId = t.id + '_excel';
        fileCache.set(stored.excelFileId, t.excelFile);
      }
      return stored;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [templates]);

  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<TemplateWithMappings | null>(null);
  const [editingExcelTemplate, setEditingExcelTemplate] = useState<ExcelTemplateWithMappings | null>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);

  const handleUploadPDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Пожалуйста, загрузите PDF файл');
      return;
    }

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const base64Data = base64.split(',')[1];

        const response = await fetch('https://functions.poehali.dev/8eb81581-d997-4368-abcd-924530939855', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64Data })
        });

        const result = await response.json();
        
        if (result.success && result.data) {
          const detectedFields: TemplateField[] = [];
          
          Object.keys(result.data).forEach((key) => {
            if (result.data[key]) {
              let section = 'Основное';
              if (key.startsWith('customer')) section = 'Заказчик';
              else if (key.startsWith('carrier')) section = 'Перевозчик';
              else if (key.startsWith('cargo') || key.startsWith('body') || key.includes('weight') || key.includes('volume')) section = 'Груз';
              else if (key.startsWith('loading')) section = 'Погрузка';
              else if (key.startsWith('unloading')) section = 'Разгрузка';
              else if (key.startsWith('amount') || key.startsWith('payment')) section = 'Оплата';
              else if (key.startsWith('driver')) section = 'Водитель';
              else if (key.startsWith('vehicle') || key.startsWith('trailer')) section = 'ТС';
              
              detectedFields.push({
                name: key,
                label: key,
                type: key.includes('date') ? 'date' : key.includes('address') || key.includes('conditions') ? 'textarea' : 'text',
                required: true,
                section
              });
            }
          });

          const newTemplate: ReportTemplate = {
            id: Date.now().toString(),
            name: `Шаблон ${file.name.replace('.pdf', '')}`,
            description: `Автоматически распознан из PDF`,
            createdAt: new Date().toISOString().split('T')[0],
            fields: detectedFields,
            pdfPreviewUrl: base64,
            pdfFile: file,
            templateType: 'pdf'
          };

          setTemplates([...templates, newTemplate]);
          alert(`Шаблон успешно создан! Распознано полей: ${detectedFields.length}`);
        } else {
          alert('Не удалось распознать шаблон из PDF');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Ошибка загрузки PDF:', error);
      alert('Ошибка при загрузке файла');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Удалить этот шаблон?')) {
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  const handleViewTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
  };

  const handleEditTemplate = (template: ReportTemplate) => {
    if (template.templateType === 'excel') {
      if (!template.excelFile) {
        alert('Excel файл недоступен');
        return;
      }
      setEditingExcelTemplate({
        id: template.id,
        name: template.name,
        excelFile: template.excelFile,
        sheetName: template.excelSheetName || '',
        mappings: template.excelMappings || []
      });
    } else {
      if (!template.pdfFile && !template.pdfPreviewUrl) {
        alert('PDF файл недоступен');
        return;
      }
      setEditingTemplate({
        id: template.id,
        name: template.name,
        pdfUrl: template.pdfFile || template.pdfPreviewUrl || '',
        mappings: template.pdfMappings || []
      });
    }
  };

  const handleUploadExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.name.match(/\.(xlsx|xls)$/i)) {
      alert('Пожалуйста, загрузите Excel файл (.xlsx или .xls)');
      return;
    }

    const newTemplate: ReportTemplate = {
      id: Date.now().toString(),
      name: `Шаблон ${file.name.replace(/\.(xlsx|xls)$/i, '')}`,
      description: 'Распознано из Excel',
      createdAt: new Date().toISOString().split('T')[0],
      fields: [],
      excelFile: file,
      templateType: 'excel'
    };

    setTemplates([...templates, newTemplate]);
    alert(`Excel шаблон создан! Откройте редактор для настройки колонок`);
    
    if (excelInputRef.current) {
      excelInputRef.current.value = '';
    }
  };

  const handleSaveMappings = (mappings: FieldMapping[]) => {
    if (!editingTemplate) return;
    
    const updatedTemplates = templates.map(t => {
      if (t.id === editingTemplate.id) {
        const fields: TemplateField[] = mappings
          .filter(m => m.dbField)
          .map(m => ({
            name: m.dbField,
            label: m.label || m.selectedText || 'Поле',
            type: m.fieldType === 'date' ? 'date' : m.fieldType === 'number' ? 'number' : 'text',
            required: true,
            section: m.tableName
          }));
        
        return { ...t, fields, pdfMappings: mappings };
      }
      return t;
    });
    
    setTemplates(updatedTemplates);
    alert(`Сохранено ${mappings.filter(m => m.dbField).length} полей`);
    setEditingTemplate(null);
  };

  const handleSaveExcelMappings = (mappings: ExcelColumnMapping[], sheetName: string) => {
    if (!editingExcelTemplate) return;
    
    const updatedTemplates = templates.map(t => {
      if (t.id === editingExcelTemplate.id) {
        const fields: TemplateField[] = mappings
          .filter(m => m.dbField)
          .map(m => ({
            name: m.dbField,
            label: m.columnName,
            type: m.fieldType === 'date' ? 'date' : m.fieldType === 'number' ? 'number' : 'text',
            required: true,
            section: m.tableName
          }));
        
        return {
          ...t,
          fields,
          excelSheetName: sheetName,
          excelMappings: mappings
        };
      }
      return t;
    });
    
    setTemplates(updatedTemplates);
    console.log('Сохранены Excel маппинги:', mappings);
    alert(`Сохранено ${mappings.length} колонок для Excel шаблона`);
    setEditingExcelTemplate(null);
  };

  const groupFieldsBySection = (fields: TemplateField[]) => {
    const grouped: Record<string, TemplateField[]> = {};
    fields.forEach(field => {
      if (!grouped[field.section]) {
        grouped[field.section] = [];
      }
      grouped[field.section].push(field);
    });
    return grouped;
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Шаблоны отчетов</h3>
          <p className="text-sm text-gray-600 mt-1">Загрузите PDF или Excel для создания шаблона</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Icon name="FileText" size={20} />
            {isLoading ? 'Загрузка...' : 'Загрузить PDF'}
          </button>
          <button
            onClick={() => excelInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Icon name="Sheet" size={20} />
            Загрузить Excel
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleUploadPDF}
          className="hidden"
        />
        <input
          ref={excelInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleUploadExcel}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon name={template.templateType === 'excel' ? 'Sheet' : 'FileText'} size={20} className={template.templateType === 'excel' ? 'text-green-600' : 'text-primary'} />
                <h4 className="font-semibold text-gray-900">{template.name}</h4>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                {template.templateType === 'excel' ? 'Excel' : 'PDF'}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Icon name="Calendar" size={14} />
              <span>{template.createdAt}</span>
              <span className="mx-2">•</span>
              <Icon name="List" size={14} />
              <span>{template.fields.length} полей</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEditTemplate(template)}
                className="flex-1 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Редактор
              </button>
              <button
                onClick={() => handleViewTemplate(template)}
                className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Icon name="Eye" size={16} />
              </button>
              <button
                onClick={() => handleDeleteTemplate(template.id)}
                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingTemplate && (
        <TemplateEditor
          template={editingTemplate}
          onSave={handleSaveMappings}
          onClose={() => setEditingTemplate(null)}
        />
      )}

      {editingExcelTemplate && (
        <ExcelTemplateEditor
          template={editingExcelTemplate}
          onSave={handleSaveExcelMappings}
          onClose={() => setEditingExcelTemplate(null)}
        />
      )}

      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">{selectedTemplate.name}</h3>
              <button onClick={() => setSelectedTemplate(null)} className="text-gray-400 hover:text-gray-600">
                <Icon name="X" size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Описание</h4>
                <p className="text-gray-600">{selectedTemplate.description}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold mb-3">Структура полей ({selectedTemplate.fields.length})</h4>
                {Object.entries(groupFieldsBySection(selectedTemplate.fields)).map(([section, fields]) => (
                  <div key={section} className="mb-4">
                    <h5 className="text-sm font-semibold text-gray-700 mb-2 bg-gray-50 px-3 py-1 rounded">{section}</h5>
                    <div className="pl-4 space-y-1">
                      {fields.map((field) => (
                        <div key={field.name} className="flex items-center gap-2 text-sm">
                          <Icon name={field.required ? 'CheckCircle2' : 'Circle'} size={14} className={field.required ? 'text-green-600' : 'text-gray-400'} />
                          <span className="text-gray-700">{field.label}</span>
                          <span className="text-gray-400">({field.type})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {selectedTemplate.pdfPreviewUrl && (
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Превью PDF</h4>
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <p className="text-sm text-gray-600">PDF файл загружен и готов к использованию</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}