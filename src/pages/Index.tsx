import { useState } from 'react';
import Icon from '@/components/ui/icon';

const menuItems = [
  { id: 'orders', label: 'Заказы', icon: 'ClipboardList' },
  { 
    id: 'reference', 
    label: 'Справочник', 
    icon: 'Book',
    submenu: [
      { id: 'drivers', label: 'Водители', icon: 'Users' },
      { id: 'vehicles', label: 'Автомобили', icon: 'Truck' },
      { id: 'customers', label: 'Контрагенты', icon: 'Contact' },
    ]
  },
  { id: 'documents', label: 'Документы', icon: 'FileText' },
  { id: 'overview', label: 'Обзор', icon: 'Activity' },
  { id: 'settings', label: 'Настройки', icon: 'Settings' },
];

const Index = () => {
  const [activeSection, setActiveSection] = useState('orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const [deliveryAddresses, setDeliveryAddresses] = useState<Array<{id: number, name: string, address: string, contact: string, phone: string, isMain: boolean}>>([]);
  const [bankAccounts, setBankAccounts] = useState<Array<{id: number, bankName: string, accountNumber: string, bik: string, corrAccount: string}>>([]);
  
  const isSubmenuActive = (item: any) => {
    return item.submenu?.some((sub: any) => sub.id === activeSection);
  };

  const addDeliveryAddress = () => {
    const newId = Math.max(...deliveryAddresses.map(a => a.id), 0) + 1;
    setDeliveryAddresses([...deliveryAddresses, { id: newId, name: '', address: '', contact: '', phone: '', isMain: false }]);
  };

  const removeDeliveryAddress = (id: number) => {
    setDeliveryAddresses(deliveryAddresses.filter(a => a.id !== id));
  };

  const addBankAccount = () => {
    const newId = Math.max(...bankAccounts.map(a => a.id), 0) + 1;
    setBankAccounts([...bankAccounts, { id: newId, bankName: '', accountNumber: '', bik: '', corrAccount: '' }]);
  };

  const removeBankAccount = (id: number) => {
    setBankAccounts(bankAccounts.filter(a => a.id !== id));
  };
  
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <aside className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Truck" size={16} className="text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-sidebar-foreground truncate">TransHub</h1>
              <p className="text-xs text-muted-foreground truncate">Управление грузоперевозками</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="User" size={16} className="text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Администратор</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => setIsReferenceOpen(!isReferenceOpen)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      isSubmenuActive(item) ? 'bg-sidebar-accent' : ''
                    } text-sidebar-foreground hover:bg-sidebar-accent`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon name={item.icon} size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <Icon name={isReferenceOpen || isSubmenuActive(item) ? "ChevronDown" : "ChevronRight"} size={16} />
                  </button>
                  {(isReferenceOpen || isSubmenuActive(item)) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            setActiveSection(subItem.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all ${
                            activeSection === subItem.id
                              ? 'bg-primary text-white'
                              : 'text-sidebar-foreground hover:bg-sidebar-accent'
                          }`}
                        >
                          <Icon name={subItem.icon} size={18} />
                          <span className="font-medium text-sm">{subItem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeSection === item.id
                      ? 'bg-primary text-white'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <Icon name={item.icon} size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

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

      {isDriverModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Создать</h3>
              <button 
                onClick={() => setIsDriverModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Icon name="X" size={20} className="text-gray-600" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Фамилия <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Имя <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Отчество
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Телефон <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+375291234567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Доп. телефон
                    </label>
                    <input
                      type="tel"
                      placeholder="+375291234567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name="CreditCard" size={18} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Паспорт</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Серия <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="1234"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Номер <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="567890"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Дата выдачи <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="ДД-ММ-ГГГГ"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                        />
                        <Icon name="Calendar" size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Кем выдан <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name="IdCard" size={18} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Водительское удостоверение</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Серия <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="77 АА"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Номер <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="123456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Дата выдачи <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="ДД-ММ-ГГГГ"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                        />
                        <Icon name="Calendar" size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Кем выдан <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsDriverModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Отмена
                </button>
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium">
                  Создать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isVehicleModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Создать</h3>
              <button 
                onClick={() => setIsVehicleModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Icon name="X" size={20} className="text-gray-600" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Транспорт
                  </label>
                  <input
                    type="text"
                    placeholder="Формируется автоматически"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Марка ТС <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Mercedes-Benz Actros"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Гос. номер <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="AB1234-5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Прицеп
                    </label>
                    <input
                      type="text"
                      placeholder="AB1234"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Тип кузова <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                    <option value="">Выберите тип</option>
                    <option value="tent">Тентованный</option>
                    <option value="ref">Рефрижератор</option>
                    <option value="isoterm">Изотермический</option>
                    <option value="open">Бортовой</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Фирма ТК <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                    <option value="">Выберите перевозчика</option>
                    <option value="tk1">ТК Логистик</option>
                    <option value="tk2">ТК Экспресс</option>
                    <option value="tk3">ТК Транзит</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Водитель <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                    <option value="">Выберите водителя</option>
                    <option value="driver1">Иванов Иван Иванович</option>
                    <option value="driver2">Петров Петр Петрович</option>
                    <option value="driver3">Сидоров Сидор Сидорович</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsVehicleModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Отмена
                </button>
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium">
                  Создать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Создать</h3>
              <button 
                onClick={() => setIsCustomerModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Icon name="X" size={20} className="text-gray-600" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Название компании <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder='ООО "Название компании"'
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Роль <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm text-gray-900">Продавец</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm text-gray-900">Покупатель</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm text-gray-900">Перевозчик</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm text-gray-900">Экспедитор</span>
                    </label>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name="FileText" size={18} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Реквизиты компании</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        ИНН
                      </label>
                      <input
                        type="text"
                        placeholder="1234567890"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        КПП
                      </label>
                      <input
                        type="text"
                        placeholder="123456789"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        ОГРН/ОГРНИП
                      </label>
                      <input
                        type="text"
                        placeholder="1234567890123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Юридический адрес
                    </label>
                    <input
                      type="text"
                      placeholder="123456, г. Москва, ул. Примерная, д. 1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAddress}
                        onChange={(e) => setSameAddress(e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">Почтовый адрес совпадает с юридическим</span>
                    </label>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Почтовый адрес
                    </label>
                    <input
                      type="text"
                      placeholder="123456, г. Москва, ул. Примерная, д. 1"
                      disabled={sameAddress}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        sameAddress ? 'bg-gray-50 text-gray-500' : ''
                      }`}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      ФИО руководителя
                    </label>
                    <input
                      type="text"
                      placeholder="Иванов Иван Иванович"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Icon name="Landmark" size={18} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">Банковские реквизиты</span>
                    </div>
                    <button
                      onClick={addBankAccount}
                      className="flex items-center gap-2 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Icon name="Plus" size={18} />
                      <span className="text-sm font-medium">Добавить счет</span>
                    </button>
                  </div>

                  {bankAccounts.map((account, index) => (
                    <div key={account.id} className="border border-gray-200 rounded-lg p-4 mb-4 relative">
                      <button
                        onClick={() => removeBankAccount(account.id)}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Удалить счет"
                      >
                        <Icon name="X" size={16} className="text-gray-500" />
                      </button>

                      <div className="mb-3">
                        <span className="text-xs text-gray-500">Счет {index + 1}</span>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Наименование банка
                        </label>
                        <input
                          type="text"
                          placeholder="ПАО Сбербанк"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Расчетный счет
                        </label>
                        <input
                          type="text"
                          placeholder="40702810000000000000"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            БИК
                          </label>
                          <input
                            type="text"
                            placeholder="044525225"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Корр. счет
                          </label>
                          <input
                            type="text"
                            placeholder="30101810000000000225"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={18} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-600">Адрес доставки</span>
                    </div>
                    <button
                      onClick={addDeliveryAddress}
                      className="flex items-center gap-2 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Icon name="Plus" size={18} />
                      <span className="text-sm font-medium">Добавить адрес</span>
                    </button>
                  </div>

                  {deliveryAddresses.map((address, index) => (
                    <div key={address.id} className="border border-gray-200 rounded-lg p-4 mb-4 relative">
                      <button
                        onClick={() => removeDeliveryAddress(address.id)}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded transition-colors"
                        title="Удалить адрес"
                      >
                        <Icon name="X" size={16} className="text-gray-500" />
                      </button>
                      
                      <div className="mb-3">
                        <span className="text-xs text-gray-500">Адрес {index + 1}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Название адреса <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Склад №1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Адрес <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="г. Москва, ул. Складская, 10"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Контактное лицо
                          </label>
                          <input
                            type="text"
                            placeholder="Петров П.П."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Телефон
                          </label>
                          <input
                            type="tel"
                            placeholder="+7 (999) 123-45-67"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setIsCustomerModalOpen(false);
                    setSameAddress(false);
                    setDeliveryAddresses([]);
                    setBankAccounts([]);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Отмена
                </button>
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium">
                  Создать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;