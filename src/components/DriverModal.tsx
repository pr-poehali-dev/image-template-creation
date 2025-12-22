import { useState } from 'react';
import Icon from '@/components/ui/icon';
import ConfirmDialog from './ConfirmDialog';
import ModalFooter from './ModalFooter';
import RulesInput from './RulesInput';

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DriverModal = ({ isOpen, onClose }: DriverModalProps) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [passportIssueDate, setPassportIssueDate] = useState('');
  const [licenseIssueDate, setLicenseIssueDate] = useState('');
  const [showPassport, setShowPassport] = useState(false);
  const [showLicense, setShowLicense] = useState(false);

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    onClose();
  };

  const handleSave = () => {
    console.log('Сохранение водителя');
    onClose();
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
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Создать</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Icon name="X" size={20} className="text-gray-600" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Фамилия <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Отчество
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Телефон <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+375291234567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Доп. телефон
                </label>
                <input
                  type="tel"
                  placeholder="+375291234567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              {!showPassport ? (
                <button
                  onClick={() => setShowPassport(true)}
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <Icon name="Plus" size={18} />
                  <span className="text-sm font-medium">Добавить паспорт</span>
                </button>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name="CreditCard" size={18} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Паспорт</span>
                    <button
                      onClick={() => setShowPassport(false)}
                      className="ml-auto text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Серия
                      </label>
                      <input
                        type="text"
                        placeholder="1234"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Номер
                      </label>
                      <input
                        type="text"
                        placeholder="567890"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <RulesInput
                      type="date"
                      value={passportIssueDate}
                      onChange={setPassportIssueDate}
                      label="Дата выдачи"
                      maxDate="today"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Кем выдан
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="pt-4 mt-4">
              {!showLicense ? (
                <button
                  onClick={() => setShowLicense(true)}
                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <Icon name="Plus" size={18} />
                  <span className="text-sm font-medium">Добавить водительское удостоверение</span>
                </button>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name="IdCard" size={18} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">Водительское удостоверение</span>
                    <button
                      onClick={() => setShowLicense(false)}
                      className="ml-auto text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Серия
                      </label>
                      <input
                        type="text"
                        placeholder="77 АА"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Номер
                      </label>
                      <input
                        type="text"
                        placeholder="123456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <RulesInput
                      type="date"
                      value={licenseIssueDate}
                      onChange={setLicenseIssueDate}
                      label="Дата выдачи"
                      maxDate="today"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Кем выдан
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <ModalFooter onCancel={handleCancel} onSave={handleSave} />
        </div>
        </div>
      </div>
    </>
  );
};

export default DriverModal;