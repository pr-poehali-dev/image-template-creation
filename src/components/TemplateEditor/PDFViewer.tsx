import { useRef } from 'react';
import { Document, Page } from 'react-pdf';
import Icon from '../ui/icon';
import { FieldMapping } from './types';

interface PDFViewerProps {
  pdfUrl: string | File;
  currentPage: number;
  numPages: number;
  scale: number;
  mappings: FieldMapping[];
  selectedMapping: FieldMapping | null;
  selectionRect: { x: number; y: number; width: number; height: number } | null;
  selectedText: string;
  containerRef: React.RefObject<HTMLDivElement>;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
  onPageChange: (page: number) => void;
  onScaleChange: (scale: number) => void;
  onMappingClick: (mapping: FieldMapping) => void;
  getFieldColor: (mapping: FieldMapping) => string;
}

export default function PDFViewer({
  pdfUrl,
  currentPage,
  numPages,
  scale,
  mappings,
  selectedMapping,
  selectionRect,
  selectedText,
  containerRef,
  onDocumentLoadSuccess,
  onPageChange,
  onScaleChange,
  onMappingClick,
  getFieldColor
}: PDFViewerProps) {
  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onScaleChange(Math.max(0.5, scale - 0.1))}
            className="p-2 bg-white hover:bg-gray-50 rounded border border-gray-300 transition-colors"
            title="Уменьшить"
          >
            <Icon name="ZoomOut" size={18} />
          </button>
          <span className="text-sm font-mono px-3 font-semibold">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => onScaleChange(Math.min(2, scale + 0.1))}
            className="p-2 bg-white hover:bg-gray-50 rounded border border-gray-300 transition-colors"
            title="Увеличить"
          >
            <Icon name="ZoomIn" size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg shadow-md">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1 hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Icon name="ChevronLeft" size={22} />
          </button>
          <span className="text-sm font-bold min-w-[130px] text-center">
            Страница {currentPage} из {numPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(numPages, currentPage + 1))}
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
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={currentPage} scale={scale} />
          </Document>

          {mappings
            .filter(m => m.page === currentPage)
            .map(mapping => (
              <div
                key={mapping.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onMappingClick(mapping);
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
  );
}
