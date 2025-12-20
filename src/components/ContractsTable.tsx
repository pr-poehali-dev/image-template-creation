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
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

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

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.route.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || contract.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Icon name="ArrowLeft" size={24} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Договоры-Заявки</h1>
          <p className="text-gray-600">Управление договорами на перевозку</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по номеру, заказчику, маршруту..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                <option value="all">Все статусы</option>
                <option value="active">Активные</option>
                <option value="completed">Завершённые</option>
                <option value="draft">Черновики</option>
              </select>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
              <Icon name="Plus" size={20} />
              Создать договор
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Номер
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Дата
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Заказчик
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Маршрут
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Сумма
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Статус
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Icon name="FileSearch" size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium">Ничего не найдено</p>
                    <p className="text-sm">Попробуйте изменить параметры поиска</p>
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{contract.number}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {contract.date}
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {contract.customer}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {contract.route}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{contract.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(contract.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Просмотр"
                        >
                          <Icon name="Eye" size={18} />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Редактировать"
                        >
                          <Icon name="Pencil" size={18} />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Скачать PDF"
                        >
                          <Icon name="Download" size={18} />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Удалить"
                        >
                          <Icon name="Trash2" size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Показано {filteredContracts.length} из {contracts.length} договоров
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon name="ChevronLeft" size={16} />
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
