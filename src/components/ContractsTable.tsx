import { useState } from 'react';
import Icon from './ui/icon';

interface Contract {
  id: string;
  number: string;
  date: string;
  customer: string;
  route: string;
  amount: string;
  status: 'active' | 'completed' | 'draft';
}

interface ContractsTableProps {
  onBack: () => void;
}

export default function ContractsTable({ onBack }: ContractsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const contracts: Contract[] = [
    {
      id: '1',
      number: 'EU-2024-001',
      date: '15-12-2024',
      customer: 'ООО "Логистика Плюс"',
      route: 'Москва → Берлин',
      amount: '450 000 ₽',
      status: 'active',
    },
    {
      id: '2',
      number: 'EU-2024-002',
      date: '18-12-2024',
      customer: 'ИП Сидоров А.В.',
      route: 'Минск → Варшава',
      amount: '280 000 ₽',
      status: 'active',
    },
    {
      id: '3',
      number: 'RU-2024-015',
      date: '10-12-2024',
      customer: 'ООО "ТрансЕвразия"',
      route: 'Москва → Новосибирск',
      amount: '620 000 ₽',
      status: 'completed',
    },
    {
      id: '4',
      number: 'EU-2024-003',
      date: '20-12-2024',
      customer: 'ООО "ГлобалКарго"',
      route: 'Санкт-Петербург → Рига',
      amount: '195 000 ₽',
      status: 'draft',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700',
      draft: 'bg-yellow-100 text-yellow-700',
    };
    const labels = {
      active: 'Активный',
      completed: 'Завершён',
      draft: 'Черновик',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const filteredContracts = contracts.filter(contract => 
    contract.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.route.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск договора..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Номер</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Дата</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Заказчик</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Маршрут</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Сумма</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Статус</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{contract.number}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{contract.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{contract.customer}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{contract.route}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{contract.amount}</td>
                    <td className="px-4 py-3">
                      {getStatusBadge(contract.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Просмотр"
                        >
                          <Icon name="Eye" size={18} className="text-gray-600" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Редактировать"
                        >
                          <Icon name="Edit" size={18} className="text-gray-600" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Скачать PDF"
                        >
                          <Icon name="FileText" size={18} className="text-gray-600" />
                        </button>
                        <button
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
    </div>
  );
}
