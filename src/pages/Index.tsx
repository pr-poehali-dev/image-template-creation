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

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Truck" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">TransHub</h1>
              <p className="text-sm text-muted-foreground">Управление грузоперевозками</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Icon name="User" size={16} className="text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground">Администратор</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
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

      <main className="flex-1 overflow-auto flex flex-col">
        <header className="bg-card border-b border-border px-8 py-4">
          <h2 className="text-xl font-bold text-foreground">
            {menuItems.find(item => item.id === activeSection)?.label}
          </h2>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Construction" size={48} className="text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Страница в разработке</h3>
            <p className="text-muted-foreground">Раздел "{menuItems.find(item => item.id === activeSection)?.label}" скоро будет доступен</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;