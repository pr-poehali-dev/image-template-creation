import Icon from '@/components/ui/icon';

interface MainDashboardProps {
  onNavigate: (section: string) => void;
}

const MainDashboard = ({ onNavigate }: MainDashboardProps) => {
  const dashboardCards = [
    {
      id: 'reference',
      title: 'Справочники',
      description: 'Управление заказами, водителями, транспортом и контрагентами',
      icon: 'Book',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      hoverColor: 'hover:bg-blue-100',
      items: ['Заказы', 'Водители', 'Автомобили', 'Контрагенты']
    },
    {
      id: 'documents',
      title: 'Документы',
      description: 'Создание и управление транспортными документами',
      icon: 'FileText',
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      hoverColor: 'hover:bg-green-100',
      items: ['Договор-Заявка', 'ТТН', 'УПД']
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Добро пожаловать в TransHub</h2>
        <p className="text-gray-600">Выберите раздел для работы</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboardCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className={`${card.color} ${card.hoverColor} rounded-xl p-6 transition-all duration-200 text-left border-2 border-transparent hover:border-${card.iconColor.split('-')[1]}-200 hover:shadow-lg group`}
          >
            <div className="flex items-start gap-4">
              <div className={`${card.color} p-3 rounded-lg ${card.iconColor} group-hover:scale-110 transition-transform`}>
                <Icon name={card.icon} size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                <div className="flex flex-wrap gap-2">
                  {card.items.map((item, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-white rounded-full text-gray-700 border border-gray-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainDashboard;
