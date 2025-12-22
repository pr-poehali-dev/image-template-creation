import Icon from '@/components/ui/icon';

interface DeliveryAddressesSectionProps {
  deliveryAddresses: Array<{id: number, name: string, address: string, contact: string, phone: string, isMain: boolean}>;
  addDeliveryAddress: () => void;
  removeDeliveryAddress: (id: number) => void;
  addressContacts: {[key: number]: Array<{id: number}>};
  addContactToAddress: (addressId: number) => void;
  removeContactFromAddress: (addressId: number, contactId: number) => void;
}

const DeliveryAddressesSection = ({
  deliveryAddresses,
  addDeliveryAddress,
  removeDeliveryAddress,
  addressContacts,
  addContactToAddress,
  removeContactFromAddress
}: DeliveryAddressesSectionProps) => {
  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="MapPin" size={18} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-600">Адрес погрузки / разгрузки</span>
      </div>

      {deliveryAddresses.length > 0 && deliveryAddresses.map((address, index) => (
        <div key={address.id} className="border border-gray-200 rounded-lg p-4 mb-4 relative">
          <button
            onClick={() => removeDeliveryAddress(address.id)}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded transition-colors"
            title="Удалить адрес"
          >
            <Icon name="X" size={16} className="text-gray-500" />
          </button>
          
          <div className="mb-3">
            <span className="text-xs text-gray-500">Адрес {index + 1}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Название адреса <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Склад №1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Адрес <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="г. Москва, ул. Складская, 10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-900">
                Контактные лица
              </label>
              <button
                type="button"
                onClick={() => addContactToAddress(address.id)}
                className="p-1 hover:bg-primary/10 rounded transition-colors"
                title="Добавить контакт"
              >
                <Icon name="Plus" size={16} className="text-primary" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Петров П.П."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {(addressContacts[address.id] || []).map((contact) => (
              <div key={contact.id} className="grid grid-cols-2 gap-4 mt-2 relative">
                <div>
                  <input
                    type="text"
                    placeholder="Иванов И.И."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="+7 (999) 987-65-43"
                    className="w-full px-3 py-2 pr-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => removeContactFromAddress(address.id, contact.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-red-50 rounded transition-colors"
                    title="Удалить контакт"
                  >
                    <Icon name="X" size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={addDeliveryAddress}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-primary hover:border-primary hover:bg-primary/5 flex items-center justify-center gap-2 font-medium transition-colors"
      >
        <Icon name="Plus" size={20} />
        Добавить адрес
      </button>
    </div>
  );
};

export default DeliveryAddressesSection;