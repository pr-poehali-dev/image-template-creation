import { useState } from 'react';
import Icon from '@/components/ui/icon';

const menuItems = [
  { id: 'orders', label: 'Заказы', icon: 'ClipboardList' },
  { id: 'carrier', label: 'Перевозчик', icon: 'Building2' },
  { id: 'drivers', label: 'Водители', icon: 'Users' },
  { id: 'vehicles', label: 'Автомобили', icon: 'Truck' },
  { id: 'customers', label: 'Заказчики', icon: 'Contact' },
  { id: 'documents', label: 'Документы', icon: 'FileText' },
  { id: 'overview', label: 'Обзор', icon: 'Activity' },
  { id: 'settings', label: 'Настройки', icon: 'Settings' },
];

const Index = () => {
  const [activeSection, setActiveSection] = useState('orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <button
              key={item.id}
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
              {menuItems.find(item => item.id === activeSection)?.label}
            </h2>
          </div>
          {activeSection === 'orders' && (
            <button className="bg-primary hover:bg-primary/90 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
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
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Статус</th>
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
                          <td className="px-4 py-3 text-sm text-gray-700">{order.orderStatus}</td>
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
                <p className="text-sm sm:text-base text-muted-foreground">Раздел "{menuItems.find(item => item.id === activeSection)?.label}" скоро будет доступен</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;