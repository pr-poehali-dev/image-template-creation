import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import ConfirmDialog from './ConfirmDialog';
import ModalFooter from './ModalFooter';
import RulesInput from './RulesInput';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: any;
  onSaved?: () => void;
}

const VehicleModal = ({ isOpen, onClose, vehicle, onSaved }: VehicleModalProps) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPTS, setShowPTS] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    licensePlate: '',
    vin: '',
    registrationCertificate: '',
    ptsSeries: '',
    ptsNumber: '',
    color: ''
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        year: vehicle.year?.toString() || '',
        licensePlate: vehicle.license_plate || '',
        vin: vehicle.vin || '',
        registrationCertificate: vehicle.registration_certificate || '',
        ptsSeries: vehicle.pts_series || '',
        ptsNumber: vehicle.pts_number || '',
        color: vehicle.color || ''
      });
      if (vehicle.pts_series || vehicle.pts_number) {
        setShowPTS(true);
      }
    } else {
      setFormData({
        brand: '',
        model: '',
        year: '',
        licensePlate: '',
        vin: '',
        registrationCertificate: '',
        ptsSeries: '',
        ptsNumber: '',
        color: ''
      });
      setShowPTS(false);
    }
  }, [vehicle, isOpen]);

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    onClose();
  };

  const handleSave = async () => {
    if (loading) return;
    
    if (!formData.brand || !formData.model || !formData.licensePlate) {
      alert('Заполните обязательные поля: Марка, Модель, Гос. номер');
      return;
    }
    
    setLoading(true);
    
    try {
      const isEditing = !!vehicle;
      const url = 'https://functions.poehali.dev/7a16d5d7-0e5e-41bc-b0a7-53decbe50532?resource=vehicles';
      
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...(isEditing && { id: vehicle.id }),
          brand: formData.brand,
          model: formData.model,
          year: formData.year ? parseInt(formData.year) : null,
          license_plate: formData.licensePlate,
          vin: formData.vin || null,
          registration_certificate: formData.registrationCertificate || null,
          pts_series: formData.ptsSeries || null,
          pts_number: formData.ptsNumber || null,
          color: formData.color || null
        })
      });
      
      if (!response.ok) {
        throw new Error('Ошибка при сохранении автомобиля');
      }
      
      const data = await response.json();
      console.log('Автомобиль сохранён:', data);
      
      setLoading(false);
      
      onClose();
      if (onSaved) onSaved();
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert('Не удалось сохранить автомобиль. Проверьте заполнение всех обязательных полей.');
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
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-xl font-bold text-gray-900">{vehicle ? 'Редактировать автомобиль' : 'Добавить автомобиль'}</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Icon name="X" size={20} className="text-gray-600" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Марка <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  placeholder="Mercedes-Benz"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Модель <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  placeholder="Actros 1844"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Год
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  placeholder="2020"
                  min="1900"
                  max="2099"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Гос. номер <span className="text-red-500">*</span>
                </label>
                <RulesInput
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                  placeholder="А123БВ77"
                  rules={[
                    { pattern: /^[A-ZА-Я0-9]+$/, message: 'Только заглавные буквы и цифры' }
                  ]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                VIN номер
              </label>
              <RulesInput
                type="text"
                value={formData.vin}
                onChange={(e) => setFormData({...formData, vin: e.target.value})}
                placeholder="WDB9340351L456789"
                rules={[
                  { pattern: /^[A-HJ-NPR-Z0-9]{17}$/, message: '17 символов (без I, O, Q)' }
                ]}
                maxLength={17}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Свидетельство о регистрации
              </label>
              <input
                type="text"
                value={formData.registrationCertificate}
                onChange={(e) => setFormData({...formData, registrationCertificate: e.target.value})}
                placeholder="77 АВ 123456"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Цвет
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                placeholder="Белый"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="FileText" size={18} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Паспорт транспортного средства (ПТС)</span>
              </div>
              
              {!showPTS ? (
                <button
                  type="button"
                  onClick={() => setShowPTS(true)}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
                >
                  + Добавить данные ПТС
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Серия ПТС
                      </label>
                      <RulesInput
                        type="text"
                        value={formData.ptsSeries}
                        onChange={(e) => setFormData({...formData, ptsSeries: e.target.value})}
                        placeholder="77 АА"
                        rules={[
                          { pattern: /^\d{2}\s?[А-Я]{2}$/, message: 'Формат: 77 АА' }
                        ]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Номер ПТС
                      </label>
                      <RulesInput
                        type="text"
                        value={formData.ptsNumber}
                        onChange={(e) => setFormData({...formData, ptsNumber: e.target.value})}
                        placeholder="123456"
                        rules={[
                          { pattern: /^\d{6}$/, message: '6 цифр' }
                        ]}
                        maxLength={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowPTS(false);
                      setFormData({...formData, ptsSeries: '', ptsNumber: ''});
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Удалить данные ПТС
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <ModalFooter
          onCancel={handleCancel}
          onSave={handleSave}
          loading={loading}
          saveText={vehicle ? 'Сохранить' : 'Создать'}
        />
      </div>
      </div>
    </>
  );
};

export default VehicleModal;
