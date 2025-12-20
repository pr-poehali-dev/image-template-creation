import Icon from '@/components/ui/icon';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  submenu?: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
}

interface MainContentProps {
  menuItems: MenuItem[];
  activeSection: string;
  setIsMobileMenuOpen: (open: boolean) => void;
  setIsDriverModalOpen: (open: boolean) => void;
  setIsVehicleModalOpen: (open: boolean) => void;
  setIsCustomerModalOpen: (open: boolean) => void;
}

const MainContent = ({
  menuItems,
  activeSection,
  setIsMobileMenuOpen,
  setIsDriverModalOpen,
  setIsVehicleModalOpen,
  setIsCustomerModalOpen
}: MainContentProps) => {
  return (
    <main className="flex-1 overflow-auto flex flex-col bg-white w-full">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="Menu" size={24} className="text-gray-900" />
          </button>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {menuItems.find(item => item.id === activeSection)?.label || 
             menuItems.find(item => item.submenu?.some(sub => sub.id === activeSection))?.submenu?.find(sub => sub.id === activeSection)?.label}
          </h2>
        </div>
        {(activeSection === 'orders' || activeSection === 'drivers' || activeSection === 'vehicles' || activeSection === 'customers') && (
          <button 
            onClick={() => {
              if (activeSection === 'drivers') setIsDriverModalOpen(true);
              if (activeSection === 'vehicles') setIsVehicleModalOpen(true);
              if (activeSection === 'customers') setIsCustomerModalOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Icon name="Plus" size={18} className="sm:w-5 sm:h-5" />
            <span className="font-medium hidden sm:inline">Добавить</span>
          </button>
        )}
      </header>
      <div className="flex-1 bg-white px-4 sm:px-6 lg:px-8 py-6">
        {activeSection === 'orders' ? (
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
        ) : activeSection === 'drivers' ? (
          <div className="space-y-4">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск водителя..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ФИО</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Телефон</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Водительское удостоверение</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { name: 'Иванов Иван Иванович', phone: '+7 (999) 123-45-67', license: '77 АА 123456' },
                      { name: 'Петров Петр Петрович', phone: '+7 (999) 234-56-78', license: '77 ВВ 234567' },
                      { name: 'Сидоров Сидор Сидорович', phone: '+7 (999) 345-67-89', license: '77 СС 345678' },
                    ].map((driver, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900">{driver.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{driver.phone}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{driver.license}</td>
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
        ) : activeSection === 'vehicles' ? (
          <div className="space-y-4">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск автомобиля..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Марка ТС</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Номер ТС</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Прицеп</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Фирма ТК</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { brand: 'КамАЗ 5490', number: 'А123БВ77', trailer: 'АВ123477', company: 'ТК Логистик' },
                      { brand: 'Volvo FH13', number: 'В456ГД77', trailer: 'ГД456777', company: 'ТК Экспресс' },
                      { brand: 'Scania R450', number: 'С789ЕЖ77', trailer: 'ЕЖ789077', company: 'ТК Транзит' },
                    ].map((vehicle, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-900">{vehicle.brand}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{vehicle.number}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{vehicle.trailer}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{vehicle.company}</td>
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
        ) : activeSection === 'customers' ? (
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
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Icon name="Construction" size={40} className="text-muted-foreground sm:w-12 sm:h-12" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Страница в разработке</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Раздел "{menuItems.find(item => item.id === activeSection)?.label || 
                menuItems.find(item => item.submenu?.some(sub => sub.id === activeSection))?.submenu?.find(sub => sub.id === activeSection)?.label}" скоро будет доступен</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default MainContent;
