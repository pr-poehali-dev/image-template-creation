import Icon from '@/components/ui/icon';

interface ContractApplicationLocationSectionProps {
  formData: {
    loadingDate: string;
    loadingAddress: string;
    loadingContact: string;
    unloadingDate: string;
    unloadingAddress: string;
    unloadingContact: string;
  };
  setFormData: (data: any) => void;
}

const ContractApplicationLocationSection = ({
  formData,
  setFormData
}: ContractApplicationLocationSectionProps) => {
  return (
    <>
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="MapPin" size={18} className="text-gray-600" />
          Погрузка
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Дата погрузки <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.loadingDate}
              onChange={(e) => setFormData({...formData, loadingDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Контактное лицо
            </label>
            <input
              type="text"
              value={formData.loadingContact}
              onChange={(e) => setFormData({...formData, loadingContact: e.target.value})}
              placeholder="ФИО, телефон"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Адрес погрузки
          </label>
          <input
            type="text"
            value={formData.loadingAddress}
            onChange={(e) => setFormData({...formData, loadingAddress: e.target.value})}
            placeholder="Полный адрес"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
          <Icon name="MapPinOff" size={18} className="text-gray-600" />
          Разгрузка
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Дата разгрузки <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.unloadingDate}
              onChange={(e) => setFormData({...formData, unloadingDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Контактное лицо
            </label>
            <input
              type="text"
              value={formData.unloadingContact}
              onChange={(e) => setFormData({...formData, unloadingContact: e.target.value})}
              placeholder="ФИО, телефон"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Адрес разгрузки
          </label>
          <input
            type="text"
            value={formData.unloadingAddress}
            onChange={(e) => setFormData({...formData, unloadingAddress: e.target.value})}
            placeholder="Полный адрес"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </>
  );
};

export default ContractApplicationLocationSection;
