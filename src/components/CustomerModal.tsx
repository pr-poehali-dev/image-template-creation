import { useState } from 'react';
import Icon from '@/components/ui/icon';
import ConfirmDialog from './ConfirmDialog';
import ModalFooter from './ModalFooter';

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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [isBuyer, setIsBuyer] = useState(false);
  const [legalAddress, setLegalAddress] = useState('');
  const [postalAddress, setPostalAddress] = useState('');
  const [actualAddress, setActualAddress] = useState('');
  const [sameActualAddress, setSameActualAddress] = useState(false);
  const [addressContacts, setAddressContacts] = useState<{[key: number]: Array<{id: number}>}>({});

  const addContactToAddress = (addressId: number) => {
    const currentContacts = addressContacts[addressId] || [];
    const newId = currentContacts.length > 0 ? Math.max(...currentContacts.map(c => c.id)) + 1 : 1;
    setAddressContacts({
      ...addressContacts,
      [addressId]: [...currentContacts, { id: newId }]
    });
  };

  const removeContactFromAddress = (addressId: number, contactId: number) => {
    setAddressContacts({
      ...addressContacts,
      [addressId]: (addressContacts[addressId] || []).filter(c => c.id !== contactId)
    });
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    onClose();
    setSameAddress(false);
    setDeliveryAddresses([]);
    setBankAccounts([]);
  };

  const handleSave = () => {
    console.log('Сохранение контрагента');
    onClose();
    setSameAddress(false);
    setDeliveryAddresses([]);
    setBankAccounts([]);
  };

  const handleClose = () => {
    onClose();
    setSameAddress(false);
    setDeliveryAddresses([]);
    setBankAccounts([]);
  };

  if (!isOpen) return null;

  return (
    <>
      <ConfirmDialog
        isOpen={showCancelConfirm}
        title="Отменить заполнение?"
        message="Все введенные данные будут потеряны. Вы уверены?"
        confirmText="Да, отменить"
        cancelText="Продолжить заполнение"
        onConfirm={confirmCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
      
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-xl font-bold text-gray-900">Создать</h3>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Icon name="X" size={20} className="text-gray-600" />
          </button>
        </div>
        
        <div className="p-6 relative">
          <div className="space-y-4">
            <div className={isSeller ? "grid grid-cols-[1fr_120px] gap-4" : ""}>
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
              {isSeller && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Префикс
                  </label>
                  <input
                    type="text"
                    placeholder="ABC"
                    maxLength={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent uppercase text-center"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Роль <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSeller}
                    onChange={(e) => setIsSeller(e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900">Продавец</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBuyer}
                    onChange={(e) => setIsBuyer(e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900">Покупатель</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-900">Перевозчик</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
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
                  value={legalAddress}
                  onChange={(e) => setLegalAddress(e.target.value)}
                  placeholder="123456, г. Москва, ул. Примерная, д. 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Почтовый адрес
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAddress}
                      onChange={(e) => {
                        setSameAddress(e.target.checked);
                        if (e.target.checked) {
                          setPostalAddress(legalAddress);
                        }
                      }}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-xs text-gray-600">Совпадает с юридическим</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={postalAddress}
                  onChange={(e) => setPostalAddress(e.target.value)}
                  placeholder="123456, г. Москва, ул. Примерная, д. 1"
                  disabled={sameAddress}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    sameAddress ? 'bg-gray-50 text-gray-500' : ''
                  }`}
                />
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Фактический адрес
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameActualAddress}
                      onChange={(e) => {
                        setSameActualAddress(e.target.checked);
                        if (e.target.checked) {
                          setActualAddress(legalAddress);
                        }
                      }}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-xs text-gray-600">Совпадает с юридическим</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={actualAddress}
                  onChange={(e) => setActualAddress(e.target.value)}
                  placeholder="123456, г. Москва, ул. Примерная, д. 1"
                  disabled={sameActualAddress}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                    sameActualAddress ? 'bg-gray-50 text-gray-500' : ''
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
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Landmark" size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Банковские реквизиты</span>
              </div>

              {bankAccounts.length > 0 && bankAccounts.map((account, index) => (
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

              <button
                onClick={addBankAccount}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-primary hover:border-primary hover:bg-primary/5 flex items-center justify-center gap-2 font-medium transition-colors"
              >
                <Icon name="Plus" size={20} />
                Добавить счет
              </button>
            </div>

            {isBuyer && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="MapPin" size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Адрес доставки</span>
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
            )}
          </div>

          <ModalFooter onCancel={handleCancel} onSave={handleSave} />
        </div>
        </div>
      </div>
    </>
  );
};

export default CustomerModal;