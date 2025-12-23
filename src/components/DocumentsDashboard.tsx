import Icon from '@/components/ui/icon';

interface DocumentsDashboardProps {
  onNavigate: (section: string) => void;
}

const DocumentsDashboard = ({ onNavigate }: DocumentsDashboardProps) => {
  const documentCards = [
    {
      id: 'contract-application',
      title: 'Договор-Заявка',
      description: 'Управление договорами и заявками',
      icon: 'FileSignature',
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
      hoverColor: 'hover:bg-orange-100'
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
      color: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      hoverColor: 'hover:bg-indigo-100'
    }
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentCards.map((card) => (
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

export default DocumentsDashboard;
