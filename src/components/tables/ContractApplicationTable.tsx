import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ContractApplication {
  id: number;
  number: string;
  date: string;
  customer: string;
  driver: string;
  vehicle: string;
  status: string;
}

interface ContractApplicationTableProps {
  setEditingDocument: (doc: any) => void;
  setIsDocumentModalOpen: (open: boolean) => void;
}

const ContractApplicationTable = ({ setEditingDocument, setIsDocumentModalOpen }: ContractApplicationTableProps) => {
  const [documents] = useState<ContractApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading] = useState(false);

  const filteredDocuments = documents.filter(doc => 
    doc.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-4">
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по номеру, контрагенту, водителю..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Номер</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Дата</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Контрагент</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Водитель</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Автомобиль</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Статус</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span>Загрузка...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <Icon name="FileText" size={40} className="text-gray-300" />
                        <span>Документы не найдены</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{doc.number}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{doc.date}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{doc.customer}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{doc.driver}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{doc.vehicle}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          doc.status === 'completed' ? 'bg-green-100 text-green-800' :
                          doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {doc.status === 'completed' ? 'Завершен' : 
                           doc.status === 'pending' ? 'В работе' : 
                           'Черновик'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingDocument(doc);
                              setIsDocumentModalOpen(true);
                            }}
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Редактировать"
                          >
                            <Icon name="Pencil" size={16} className="text-gray-600" />
                          </button>
                          <button
                            className="p-1 hover:bg-gray-200 rounded transition-colors"
                            title="Скачать PDF"
                          >
                            <Icon name="Download" size={16} className="text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractApplicationTable;
