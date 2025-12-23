import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import ConfirmDialog from './ConfirmDialog';
import ModalFooter from './ModalFooter';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: any;
  onSaved?: () => void;
}

const CustomerModal = ({ isOpen, onClose, customer, onSaved }: CustomerModalProps) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '',
    inn: '',
    kpp: '',
    ogrn: '',
    legalAddress: '',
    directorName: '',
    contactPhone: '',
    bankName: '',
    bik: '',
    corrAccount: '',
    paymentAccount: ''
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        companyName: customer.company_name || '',
        inn: customer.inn || '',
        kpp: customer.kpp || '',
        ogrn: customer.ogrn || '',
        legalAddress: customer.legal_address || '',
        directorName: customer.director_name || '',
        contactPhone: customer.contact_phone || '',
        bankName: customer.bank_name || '',
        bik: customer.bik || '',
        corrAccount: customer.corr_account || '',
        paymentAccount: customer.payment_account || ''
      });
    } else {
      setFormData({
        companyName: '',
        inn: '',
        kpp: '',
        ogrn: '',
        legalAddress: '',
        directorName: '',
        contactPhone: '',
        bankName: '',
        bik: '',
        corrAccount: '',
        paymentAccount: ''
      });
    }
  }, [customer, isOpen]);

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    onClose();
  };

  const handleSave = async () => {
    if (loading) return;
    setLoading(true);
    
    try {
      console.log('Сохранение контрагента:', formData);
      
      setTimeout(() => {
        setLoading(false);
        onClose();
        if (onSaved) onSaved();
      }, 500);
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert('Не удалось сохранить контрагента');
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
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h3 className="text-xl font-bold text-gray-900">{customer ? 'Редактировать контрагента' : 'Добавить контрагента'}</h3>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Icon name="X" size={20} className="text-gray-600" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4">Основные данные</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Наименование <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      placeholder="ООО 'Компания'"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        ИНН <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.inn}
                        onChange={(e) => setFormData({...formData, inn: e.target.value})}
                        placeholder="7707083893"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        КПП
                      </label>
                      <input
                        type="text"
                        value={formData.kpp}
                        onChange={(e) => setFormData({...formData, kpp: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        ОГРН
                      </label>
                      <input
                        type="text"
                        value={formData.ogrn}
                        onChange={(e) => setFormData({...formData, ogrn: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Юридический адрес
                    </label>
                    <textarea
                      value={formData.legalAddress}
                      onChange={(e) => setFormData({...formData, legalAddress: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Директор
                      </label>
                      <input
                        type="text"
                        value={formData.directorName}
                        onChange={(e) => setFormData({...formData, directorName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                        placeholder="+375291234567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Банковские реквизиты</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Название банка
                    </label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        БИК
                      </label>
                      <input
                        type="text"
                        value={formData.bik}
                        onChange={(e) => setFormData({...formData, bik: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Корр. счет
                      </label>
                      <input
                        type="text"
                        value={formData.corrAccount}
                        onChange={(e) => setFormData({...formData, corrAccount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Расчетный счет
                    </label>
                    <input
                      type="text"
                      value={formData.paymentAccount}
                      onChange={(e) => setFormData({...formData, paymentAccount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <ModalFooter onCancel={handleCancel} onSave={handleSave} disabled={loading} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerModal;
