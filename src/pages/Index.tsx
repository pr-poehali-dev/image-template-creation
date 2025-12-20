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
          <h2 className="text-xl font-bold text-foreground">Управление заказами</h2>
        </header>
        <div className="flex-1 p-8">
          
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Package" size={24} className="text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">24</span>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Активные заказы</h3>
                <p className="text-xs text-muted-foreground">В процессе доставки</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="CheckCircle2" size={24} className="text-accent" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">156</span>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Завершено</h3>
                <p className="text-xs text-muted-foreground">За текущий месяц</p>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="TrendingUp" size={24} className="text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-foreground">₽2.4М</span>
                </div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Выручка</h3>
                <p className="text-xs text-muted-foreground">За текущий месяц</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Последние заказы</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">ID Заказа</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Маршрут</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Водитель</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Статус</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Сумма</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { id: '#12453', route: 'Москва → Санкт-Петербург', driver: 'Иванов А.П.', status: 'В пути', amount: '₽45,000' },
                      { id: '#12452', route: 'Казань → Екатеринбург', driver: 'Петров С.Н.', status: 'Доставлен', amount: '₽32,500' },
                      { id: '#12451', route: 'Новосибирск → Омск', driver: 'Сидоров В.М.', status: 'В пути', amount: '₽28,000' },
                      { id: '#12450', route: 'Краснодар → Ростов', driver: 'Козлов Д.И.', status: 'В пути', amount: '₽19,500' },
                    ].map((order) => (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-primary">{order.id}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{order.route}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{order.driver}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Доставлен' 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-primary/10 text-primary'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-foreground">{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;