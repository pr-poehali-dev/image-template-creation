import { useState } from 'react';
import Icon from './ui/icon';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentType: 'contract' | 'ttn' | 'upd';
  children: React.ReactNode;
}

export default function DocumentPreviewModal({
  isOpen,
  onClose,
  documentTitle,
  documentType,
  children
}: DocumentPreviewModalProps) {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    console.log('Экспорт в PDF через backend');
  };

  const handleExportExcel = async () => {
    console.log('Экспорт в Excel через backend');
  };

  const handleExportWord = async () => {
    console.log('Экспорт в Word через backend');
  };

  const handleSendEmail = () => {
    console.log('Отправка по email');
  };

  const handleSaveToDatabase = () => {
    console.log('Сохранение в базу данных');
  };

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          
          .no-print {
            display: none !important;
          }
          
          .document-content {
            width: 210mm;
            min-height: 297mm;
            padding: 0;
            margin: 0;
            box-shadow: none;
            border: none;
          }
        }
      `}</style>

      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 no-print">
        <div className="bg-white rounded-lg w-full max-w-[900px] max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <Icon name="FileText" size={24} className="text-primary" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{documentTitle}</h2>
                <p className="text-xs text-gray-500">Предпросмотр документа</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <Icon name="X" size={24} />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white no-print">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Icon name="Printer" size={18} />
                Печать
              </button>

              <div className="relative">
                <button
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <Icon name="Download" size={18} />
                  Экспорт
                  <Icon name="ChevronDown" size={16} />
                </button>

                {exportMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={() => {
                        handleExportPDF();
                        setExportMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
                    >
                      <Icon name="FileText" size={18} className="text-red-600" />
                      <div>
                        <div className="font-medium text-gray-900">Скачать PDF</div>
                        <div className="text-xs text-gray-500">Для печати и архива</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        handleExportExcel();
                        setExportMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
                    >
                      <Icon name="FileSpreadsheet" size={18} className="text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">Скачать Excel</div>
                        <div className="text-xs text-gray-500">Для редактирования данных</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        handleExportWord();
                        setExportMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Icon name="FileType" size={18} className="text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">Скачать Word</div>
                        <div className="text-xs text-gray-500">Для редактирования текста</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSendEmail}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <Icon name="Mail" size={18} />
                Отправить
              </button>

              <button
                onClick={handleSaveToDatabase}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Icon name="Save" size={18} />
                Сохранить
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
            <div className="document-content bg-white shadow-lg mx-auto" style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}>
              {children}
            </div>
          </div>

          <div className="p-3 border-t border-gray-200 bg-gray-50 text-center text-sm text-gray-600 no-print">
            <div className="flex items-center justify-center gap-4">
              <span className="flex items-center gap-1">
                <Icon name="FileText" size={16} />
                Формат: A4 (210×297 мм)
              </span>
              <span className="text-gray-400">•</span>
              <span className="flex items-center gap-1">
                <Icon name="Info" size={16} />
                Поля: 20 мм
              </span>
            </div>
          </div>
        </div>
      </div>

      {exportMenuOpen && (
        <div 
          className="fixed inset-0 z-40 no-print" 
          onClick={() => setExportMenuOpen(false)}
        />
      )}
    </>
  );
}
