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
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transform transition-transform duration-300 lg:transform-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
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
        <div className="flex-1 flex items-center justify-center bg-white px-4">
          <div className="text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Icon name="Construction" size={40} className="text-muted-foreground sm:w-12 sm:h-12" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Страница в разработке</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Раздел "{menuItems.find(item => item.id === activeSection)?.label}" скоро будет доступен</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;