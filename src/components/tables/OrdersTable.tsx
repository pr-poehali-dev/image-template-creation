import Icon from '@/components/ui/icon';

const OrdersTable = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-4">
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск заказа..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">№ заказа</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Дата заказа</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Инвойс / Трак</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Гос номер</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Время в пути</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Статус</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Фито</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { number: '001', date: '20.12.2024', invoice: 'INV-12453', gosNumber: 'А123БВ77', time: '2ч 30м', status: 'В пути', fito: 'Да', orderStatus: 'Активный' },
                  { number: '002', date: '20.12.2024', invoice: 'INV-12452', gosNumber: 'В456ГД77', time: '1ч 45м', status: 'Доставлен', fito: 'Нет', orderStatus: 'Завершен' },
                  { number: '003', date: '19.12.2024', invoice: 'INV-12451', gosNumber: 'С789ЕЖ77', time: '3ч 15м', status: 'В пути', fito: 'Да', orderStatus: 'Активный' },
                  { number: '004', date: '19.12.2024', invoice: 'INV-12450', gosNumber: 'Д012ЗИ77', time: '4ч 00м', status: 'Ожидание', fito: 'Нет', orderStatus: 'Ожидание' },
                ].map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{order.number}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.invoice}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.gosNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.time}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Доставлен' 
                          ? 'bg-green-100 text-green-700' 
                          : order.status === 'В пути'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.fito}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Просмотр">
                          <Icon name="Eye" size={18} className="text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Редактировать">
                          <Icon name="Edit" size={18} className="text-gray-600" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors" title="Удалить">
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
};

export default OrdersTable;
