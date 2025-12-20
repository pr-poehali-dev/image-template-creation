import Icon from './ui/icon';

interface DocumentsDashboardProps {
  onNavigate: (section: string) => void;
}

export default function DocumentsDashboard({ onNavigate }: DocumentsDashboardProps) {
  const cards = [
    {
      id: 'contract-application',
      title: 'Договор-Заявка',
      icon: 'FileSignature',
      description: 'Договоры и заявки на перевозку',
      count: '12 активных',
      color: 'bg-orange-500',
    },
    {
      id: 'ttn',
      title: 'ТТН',
      icon: 'FileCheck',
      description: 'Товарно-транспортные накладные',
      count: '156 документов',
      color: 'bg-teal-500',
    },
    {
      id: 'upd',
      title: 'УПД',
      icon: 'FileBarChart',
      description: 'Универсальные передаточные документы',
      count: '89 документов',
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Документы</h1>
        <p className="text-gray-600">Управление документооборотом и отчетностью</p>
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

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="CheckCircle" size={20} className="text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Быстрое создание</h4>
              <p className="text-gray-700 text-sm">
                Создавайте документы на основе заказов в один клик. 
                Все данные подтягиваются автоматически.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Download" size={20} className="text-white" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Экспорт документов</h4>
              <p className="text-gray-700 text-sm">
                Выгружайте документы в PDF или Excel для печати 
                и отправки контрагентам.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
