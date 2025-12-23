import Icon from '@/components/ui/icon';

interface ReferenceDashboardProps {
  onNavigate: (section: string) => void;
}

const ReferenceDashboard = ({ onNavigate }: ReferenceDashboardProps) => {
  const referenceCards = [
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
    }
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {referenceCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className={`${card.color} ${card.hoverColor} p-6 rounded-lg border border-gray-200 transition-all hover:shadow-md text-left group`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 ${card.color} rounded-lg group-hover:scale-110 transition-transform`}>
                <Icon name={card.icon} size={24} className={card.iconColor} />
              </div>
              <div className="flex-1">
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

export default ReferenceDashboard;
