import { useState, useRef, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import Icon from './ui/icon';
import TemplateEditorHeader from './TemplateEditor/TemplateEditorHeader';
import PDFViewer from './TemplateEditor/PDFViewer';
import FieldSettingsSidebar from './TemplateEditor/FieldSettingsSidebar';
import SubFieldModal from './TemplateEditor/SubFieldModal';
import { FieldMapping, TemplateWithMappings } from './TemplateEditor/types';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export type { FieldMapping, TemplateWithMappings };

interface TemplateEditorProps {
  template: TemplateWithMappings;
  onSave: (mappings: FieldMapping[], name: string, description: string) => void;
  onClose: () => void;
}

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
        <TemplateEditorHeader
          templateName={templateName}
          templateDescription={templateDescription}
          onNameChange={setTemplateName}
          onDescriptionChange={setTemplateDescription}
          onClose={onClose}
        />

        <div className="flex-1 flex overflow-hidden">
          <PDFViewer
            pdfUrl={template.pdfUrl}
            currentPage={currentPage}
            numPages={numPages}
            scale={scale}
            mappings={mappings}
            selectedMapping={selectedMapping}
            selectionRect={selectionRect}
            selectedText={selectedText}
            containerRef={containerRef}
            onDocumentLoadSuccess={onDocumentLoadSuccess}
            onPageChange={setCurrentPage}
            onScaleChange={setScale}
            onMappingClick={setSelectedMapping}
            getFieldColor={getFieldColor}
          />

          <FieldSettingsSidebar
            sidebarWidth={sidebarWidth}
            selectedText={selectedText}
            selectionRect={selectionRect}
            selectedMapping={selectedMapping}
            onMouseDown={handleMouseDown}
            onCreateField={handleCreateField}
            onUpdateMapping={handleUpdateMapping}
            onDeleteMapping={handleDeleteMapping}
            onEditSubField={(mappingId, subFieldId) => setEditingSubField({ mappingId, subFieldId })}
            setSelectedMapping={setSelectedMapping}
          />
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

      <SubFieldModal
        editingSubField={editingSubField}
        mappings={mappings}
        onClose={() => setEditingSubField(null)}
        onUpdateMapping={handleUpdateMapping}
      />
    </div>
  );
}
