import Icon from '@/components/ui/icon';

interface ContractApplicationTransportSectionProps {
  formData: {
    bodyType: string;
    tempFrom: string;
    tempTo: string;
    cargoType: string;
  };
  setFormData: (data: any) => void;
}

const ContractApplicationTransportSection = ({
  formData,
  setFormData
}: ContractApplicationTransportSectionProps) => {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
        <Icon name="Truck" size={18} className="text-gray-600" />
        Транспорт и груз
      </h4>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Требуемый тип кузова <span className="text-red-500">*</span>
          </label>
          <select 
            value={formData.bodyType}
            onChange={(e) => setFormData({...formData, bodyType: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
          >
            <option value="" disabled className="text-gray-400">Выберите тип</option>
            <option value="tent">Тентованный</option>
            <option value="ref">Рефрижератор</option>
            <option value="isoterm">Изотермический</option>
            <option value="open">Бортовой</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Температурный режим
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={formData.tempFrom}
              onChange={(e) => setFormData({...formData, tempFrom: e.target.value})}
              placeholder="от °C"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="text"
              value={formData.tempTo}
              onChange={(e) => setFormData({...formData, tempTo: e.target.value})}
              placeholder="до °C"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Характер груза
        </label>
        <input
          type="text"
          value={formData.cargoType}
          onChange={(e) => setFormData({...formData, cargoType: e.target.value})}
          placeholder="Например: Продукты питания"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default ContractApplicationTransportSection;
