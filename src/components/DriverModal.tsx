import { useState, FormEvent } from 'react';
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
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    phone: '',
    passportSeries: '',
    passportNumber: '',
    passportIssuedBy: '',
    passportIssuedDate: '',
    licenseSeries: '',
    licenseNumber: '',
    licenseCategory: ''
  });

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    onClose();
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      const fullName = `${formData.lastName} ${formData.firstName} ${formData.middleName}`.trim();
      
      const response = await fetch('https://functions.poehali.dev/ffb2fa8e-9b1c-430d-887b-d0205d275b7e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: fullName,
          phone: formData.phone,
          passport_series: formData.passportSeries || null,
          passport_number: formData.passportNumber || null,
          passport_issued_by: formData.passportIssuedBy || null,
          passport_issued_date: formData.passportIssuedDate || null,
          license_series: formData.licenseSeries || null,
          license_number: formData.licenseNumber || null,
          license_category: formData.licenseCategory || null
        })
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при сохранении водителя');
      }
      
      const data = await response.json();
      console.log('Водитель сохранён:', data);
      
      setFormData({
        lastName: '',
        firstName: '',
        middleName: '',
        phone: '',
        passportSeries: '',
        passportNumber: '',
        passportIssuedBy: '',
        passportIssuedDate: '',
        licenseSeries: '',
        licenseNumber: '',
        licenseCategory: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert('Не удалось сохранить водителя. Проверьте заполнение всех обязательных полей.');
    } finally {
      setLoading(false);
    }
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
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Отчество
                </label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => setFormData({...formData, middleName: e.target.value})}
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

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="CreditCard" size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Паспорт</span>
              </div>
              {!showPassport ? (
                <button
                  onClick={() => setShowPassport(true)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 flex items-center justify-center gap-2 text-[#00A6E5] hover:border-[#00A6E5] hover:bg-blue-50 transition-all"
                >
                  <Icon name="Plus" size={20} />
                  <span className="font-medium">Добавить паспорт</span>
                </button>
              ) : (
                <>
                  <div className="flex items-center justify-end mb-4">
                    <button
                      onClick={() => setShowPassport(false)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
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
                        value={formData.passportSeries}
                        onChange={(e) => setFormData({...formData, passportSeries: e.target.value})}
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
                        value={formData.passportNumber}
                        onChange={(e) => setFormData({...formData, passportNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <RulesInput
                      type="date"
                      value={formData.passportIssuedDate}
                      onChange={(value) => setFormData({...formData, passportIssuedDate: value})}
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

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="IdCard" size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Водительское удостоверение</span>
              </div>
              {!showLicense ? (
                <button
                  onClick={() => setShowLicense(true)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 flex items-center justify-center gap-2 text-[#00A6E5] hover:border-[#00A6E5] hover:bg-blue-50 transition-all"
                >
                  <Icon name="Plus" size={20} />
                  <span className="font-medium">Добавить водительское удостоверение</span>
                </button>
              ) : (
                <>
                  <div className="flex items-center justify-end mb-4">
                    <button
                      onClick={() => setShowLicense(false)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
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
                        value={formData.licenseSeries}
                        onChange={(e) => setFormData({...formData, licenseSeries: e.target.value})}
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
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Категория
                      </label>
                      <input
                        type="text"
                        placeholder="CE"
                        value={formData.licenseCategory}
                        onChange={(e) => setFormData({...formData, licenseCategory: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>


                </>
              )}
            </div>
          </div>

          <ModalFooter onCancel={handleCancel} onSave={handleSave} disabled={loading} />
        </div>
        </div>
      </div>
    </>
  );
};

export default DriverModal;