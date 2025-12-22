import Icon from '@/components/ui/icon';

const CustomersTable = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-4">
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск контрагента..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Псевдоним</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Компания</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ИНН</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ОГРН</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Роль</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { nickname: 'АгроПром', company: 'ООО "АгроПромышленная компания"', inn: '7701234567', ogrn: '1027700123456', role: 'Поставщик' },
                  { nickname: 'МегаМаркет', company: 'ООО "Мега Маркет"', inn: '7702345678', ogrn: '1027700234567', role: 'Покупатель' },
                  { nickname: 'ЛогистикПро', company: 'ООО "Логистик Про"', inn: '7703456789', ogrn: '1027700345678', role: 'Перевозчик' },
                ].map((counterparty, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{counterparty.nickname}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{counterparty.company}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{counterparty.inn}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{counterparty.ogrn}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {counterparty.role}
                      </span>
                    </td>
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

export default CustomersTable;
