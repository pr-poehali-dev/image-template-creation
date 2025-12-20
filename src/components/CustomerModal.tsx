import Icon from '@/components/ui/icon';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sameAddress: boolean;
  setSameAddress: (same: boolean) => void;
  deliveryAddresses: Array<{id: number, name: string, address: string, contact: string, phone: string, isMain: boolean}>;
  setDeliveryAddresses: (addresses: Array<{id: number, name: string, address: string, contact: string, phone: string, isMain: boolean}>) => void;
  bankAccounts: Array<{id: number, bankName: string, accountNumber: string, bik: string, corrAccount: string}>;
  setBankAccounts: (accounts: Array<{id: number, bankName: string, accountNumber: string, bik: string, corrAccount: string}>) => void;
  addDeliveryAddress: () => void;
  removeDeliveryAddress: (id: number) => void;
  addBankAccount: () => void;
  removeBankAccount: (id: number) => void;
}

const CustomerModal = ({
  isOpen,
  onClose,
  sameAddress,
  setSameAddress,
  deliveryAddresses,
  setDeliveryAddresses,
  bankAccounts,
  setBankAccounts,
  addDeliveryAddress,
  removeDeliveryAddress,
  addBankAccount,
  removeBankAccount
}: CustomerModalProps) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    setSameAddress(false);
    setDeliveryAddresses([]);
    setBankAccounts([]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Создать</h3>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Icon name="X" size={20} className="text-gray-600" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Название компании <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder='ООО "Название компании"'
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Роль <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900">Продавец</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900">Покупатель</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900">Перевозчик</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900">Экспедитор</span>
                </label>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="FileText" size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Реквизиты компании</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    ИНН
                  </label>
                  <input
                    type="text"
                    placeholder="1234567890"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    КПП
                  </label>
                  <input
                    type="text"
                    placeholder="123456789"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    ОГРН/ОГРНИП
                  </label>
                  <input
                    type="text"
                    placeholder="1234567890123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Юридический адрес
                </label>
                <input
                  type="text"
                  placeholder="123456, г. Москва, ул. Примерная, д. 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={(e) => setSameAddress(e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Почтовый адрес совпадает с юридическим</span>
                </label>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Почтовый адрес
                </label>
                <input
                  type="text"
                  placeholder="123456, г. Москва, ул. Примерная, д. 1"
                  disabled={sameAddress}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    sameAddress ? 'bg-gray-50 text-gray-500' : ''
                  }`}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  ФИО руководителя
                </label>
                <input
                  type="text"
                  placeholder="Иванов Иван Иванович"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon name="Landmark" size={18} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Банковские реквизиты</span>
                </div>
                <button
                  onClick={addBankAccount}
                  className="flex items-center gap-2 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Icon name="Plus" size={18} />
                  <span className="text-sm font-medium">Добавить счет</span>
                </button>
              </div>

              {bankAccounts.map((account, index) => (
                <div key={account.id} className="border border-gray-200 rounded-lg p-4 mb-4 relative">
                  <button
                    onClick={() => removeBankAccount(account.id)}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Удалить счет"
                  >
                    <Icon name="X" size={16} className="text-gray-500" />
                  </button>

                  <div className="mb-3">
                    <span className="text-xs text-gray-500">Счет {index + 1}</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Наименование банка
                    </label>
                    <input
                      type="text"
                      placeholder="ПАО Сбербанк"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Расчетный счет
                    </label>
                    <input
                      type="text"
                      placeholder="40702810000000000000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        БИК
                      </label>
                      <input
                        type="text"
                        placeholder="044525225"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Корр. счет
                      </label>
                      <input
                        type="text"
                        placeholder="30101810000000000225"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Icon name="MapPin" size={18} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-600">Адрес доставки</span>
                </div>
                <button
                  onClick={addDeliveryAddress}
                  className="flex items-center gap-2 px-3 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <Icon name="Plus" size={18} />
                  <span className="text-sm font-medium">Добавить адрес</span>
                </button>
              </div>

              {deliveryAddresses.map((address, index) => (
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

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Контактное лицо
                      </label>
                      <input
                        type="text"
                        placeholder="Петров П.П."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Отмена
            </button>
            <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium">
              Создать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
