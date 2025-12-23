import Icon from '@/components/ui/icon';

interface MainDashboardProps {
  onNavigate: (section: string) => void;
}

const MainDashboard = ({ onNavigate }: MainDashboardProps) => {
  const dashboardCards = [
    {
      id: 'orders',
      title: 'Заказы',
      description: 'Управление заказами',
      icon: 'ClipboardList',
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
      hoverColor: 'hover:bg-orange-100'
    },
    {
      id: 'drivers',
      title: 'Водители',
      description: 'Управление водителями',
      icon: 'Users',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      hoverColor: 'hover:bg-blue-100'
    },
    {
      id: 'vehicles',
      title: 'Автомобили',
      description: 'Управление транспортом',
      icon: 'Truck',
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      hoverColor: 'hover:bg-green-100'
    },
    {
      id: 'customers',
      title: 'Контрагенты',
      description: 'Управление контрагентами',
      icon: 'Contact',
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      hoverColor: 'hover:bg-purple-100'
    },
    {
      id: 'contract-application',
      title: 'Договор-Заявка',
      description: 'Создание договоров',
      icon: 'FileSignature',
      color: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      hoverColor: 'hover:bg-indigo-100'
    },
    {
      id: 'ttn',
      title: 'ТТН',
      description: 'Товарно-транспортные накладные',
      icon: 'FileCheck',
      color: 'bg-teal-50',
      iconColor: 'text-teal-600',
      hoverColor: 'hover:bg-teal-100'
    },
    {
      id: 'upd',
      title: 'УПД',
      description: 'Универсальные передаточные документы',
      icon: 'FileBarChart',
      color: 'bg-pink-50',
      iconColor: 'text-pink-600',
      hoverColor: 'hover:bg-pink-100'
    },
    {
      id: 'templates',
      title: 'Шаблоны',
      description: 'Управление шаблонами документов',
      icon: 'FileSpreadsheet',
      color: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      hoverColor: 'hover:bg-yellow-100'
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Добро пожаловать в TransHub</h2>
        <p className="text-gray-600">Выберите раздел для работы</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className={`${card.color} ${card.hoverColor} p-6 rounded-lg border border-gray-200 transition-all hover:shadow-md text-left group`}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className={`p-3 ${card.color} rounded-lg group-hover:scale-110 transition-transform`}>
                <Icon name={card.icon} size={32} className={card.iconColor} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainDashboard;