import { useState, useRef, useEffect } from 'react';
import Icon from './ui/icon';
import TemplateEditor, { TemplateWithMappings, FieldMapping } from './TemplateEditor';

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
  pdfBase64?: string;
  pdf_base64?: string;
  pdfFile?: File;
  templateType: 'pdf';
  pdfMappings?: FieldMapping[];
}

const API_URL = 'https://functions.poehali.dev/7a16d5d7-0e5e-41bc-b0a7-53decbe50532?resource=templates';

export default function TemplatesDashboard() {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);

  const loadTemplates = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Ошибка загрузки шаблонов:', error);
      setTemplates([]);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<TemplateWithMappings | null>(null);

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

        const recognizeResponse = await fetch('https://functions.poehali.dev/7a16d5d7-0e5e-41bc-b0a7-53decbe50532?resource=pdf-recognize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64Data })
        });

        const result = await recognizeResponse.json();
        
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

          const saveResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: `Шаблон ${file.name.replace('.pdf', '')}`,
              description: 'Автоматически распознан из PDF',
              templateType: 'pdf',
              fields: detectedFields,
              pdfBase64: base64
            })
          });

          if (saveResponse.ok) {
            await loadTemplates();
            alert(`Шаблон успешно создан! Распознано полей: ${detectedFields.length}`);
          } else {
            alert('Ошибка сохранения шаблона');
          }
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

  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Удалить этот шаблон?')) {
      try {
        const response = await fetch(`${API_URL}&id=${id}`, { method: 'DELETE' });
        if (response.ok) {
          await loadTemplates();
        } else {
          alert('Ошибка удаления шаблона');
        }
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Ошибка удаления шаблона');
      }
    }
  };

  const handleViewTemplate = (template: ReportTemplate) => {
    setSelectedTemplate(template);
  };

  const handlePrintTemplate = (template: ReportTemplate) => {
    const pdfUrl = template.pdfBase64 || template.pdf_base64;
    if (pdfUrl) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Печать: ${template.name}</title>
              <style>
                body { margin: 0; }
                embed { width: 100%; height: 100vh; }
              </style>
            </head>
            <body>
              <embed src="${pdfUrl}" type="application/pdf" />
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
      }
    } else {
      alert('Файл для печати недоступен');
    }
  };

  const handleDownloadTemplate = (template: ReportTemplate) => {
    const pdfUrl = template.pdfBase64 || template.pdf_base64;
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `${template.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      alert('Файл для скачивания недоступен');
    }
  };

  const handleEditTemplate = (template: ReportTemplate) => {
    const pdfUrl = template.pdfBase64 || template.pdf_base64;
    if (!pdfUrl) {
      alert('PDF файл недоступен');
      return;
    }
    setEditingTemplate({
      id: template.id,
      name: template.name,
      description: template.description,
      pdfUrl: pdfUrl,
      mappings: template.pdfMappings || []
    });
  };



  const handleSaveMappings = (mappings: FieldMapping[], name: string, description: string) => {
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
        
        return { ...t, name, description, fields, pdfMappings: mappings };
      }
      return t;
    });
    
    setTemplates(updatedTemplates);
    alert(`Сохранено ${mappings.filter(m => m.dbField).length} полей`);
    setEditingTemplate(null);
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
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-4">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Icon name="FileText" size={20} />
            {isLoading ? 'Загрузка...' : 'Загрузить PDF'}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleUploadPDF}
          className="hidden"
        />

        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск шаблона..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Название</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Описание</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Тип</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Дата создания</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Полей</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {templates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon name="FileText" size={18} className="text-primary" />
                        <span className="text-sm font-medium text-gray-900">{template.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{template.description}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        PDF
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{template.createdAt}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{template.fields?.length || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {(template.pdfBase64 || template.pdf_base64) && (
                          <>
                            <button 
                              onClick={() => handleEditTemplate(template)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors" 
                              title="Редактор"
                            >
                              <Icon name="Edit" size={18} className="text-gray-600" />
                            </button>
                            <button 
                              onClick={() => handlePrintTemplate(template)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors" 
                              title="Печать"
                            >
                              <Icon name="Printer" size={18} className="text-gray-600" />
                            </button>
                            <button 
                              onClick={() => handleDownloadTemplate(template)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors" 
                              title="Скачать"
                            >
                              <Icon name="Download" size={18} className="text-gray-600" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleViewTemplate(template)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors" 
                          title="Просмотр"
                        >
                          <Icon name="Eye" size={18} className="text-gray-600" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors" 
                          title="Удалить"
                        >
                          <Icon name="Trash2" size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingTemplate && (
        <TemplateEditor
          template={editingTemplate}
          onSave={handleSaveMappings}
          onClose={() => setEditingTemplate(null)}
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