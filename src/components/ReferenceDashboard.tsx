import Icon from './ui/icon';

interface ReferenceDashboardProps {
  onNavigate: (section: string) => void;
}

export default function ReferenceDashboard({ onNavigate }: ReferenceDashboardProps) {
  const cards = [
    {
      id: 'drivers',
      title: 'Водители',
      icon: 'Users',
      description: 'Управление базой водителей',
      count: '24 активных',
      color: 'bg-blue-500',
    },
    {
      id: 'vehicles',
      title: 'Автомобили',
      icon: 'Truck',
      description: 'Парк транспортных средств',
      count: '18 единиц',
      color: 'bg-green-500',
    },
    {
      id: 'customers',
      title: 'Контрагенты',
      icon: 'Contact',
      description: 'Клиенты и партнеры',
      count: '47 организаций',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Справочник</h1>
        <p className="text-gray-600">Управление справочной информацией системы</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-primary group text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon name={card.icon} size={24} className="text-white" />
              </div>
              <Icon name="ArrowRight" size={20} className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{card.description}</p>
            <p className="text-sm font-medium text-primary">{card.count}</p>
          </button>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Info" size={20} className="text-white" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">О справочнике</h4>
            <p className="text-gray-700 text-sm">
              В этом разделе хранится вся справочная информация: данные водителей, 
              информация о транспортных средствах и контрагентах. Используйте карточки 
              выше для быстрого доступа к нужному разделу.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
