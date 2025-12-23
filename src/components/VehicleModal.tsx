import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import ConfirmDialog from './ConfirmDialog';
import ModalFooter from './ModalFooter';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: any;
  onSaved?: () => void;
}

const VehicleModal = ({ isOpen, onClose, vehicle, onSaved }: VehicleModalProps) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    licensePlate: '',
    vin: '',
    year: '',
    ptsSeries: '',
    ptsNumber: '',
    stsSeries: '',
    stsNumber: '',
    ownerName: '',
    ownerPhone: ''
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        licensePlate: vehicle.license_plate || '',
        vin: vehicle.vin || '',
        year: vehicle.year || '',
        ptsSeries: vehicle.pts_series || '',
        ptsNumber: vehicle.pts_number || '',
        stsSeries: vehicle.sts_series || '',
        stsNumber: vehicle.sts_number || '',
        ownerName: vehicle.owner_name || '',
        ownerPhone: vehicle.owner_phone || ''
      });
    } else {
      setFormData({
        brand: '',
        model: '',
        licensePlate: '',
        vin: '',
        year: '',
        ptsSeries: '',
        ptsNumber: '',
        stsSeries: '',
        stsNumber: '',
        ownerName: '',
        ownerPhone: ''
      });
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
    setLoading(true);
    
    try {
      console.log('Сохранение ТС:', formData);
      
      setTimeout(() => {
        setLoading(false);
        onClose();
        if (onSaved) onSaved();
      }, 500);
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert('Не удалось сохранить транспорт');
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
            <h3 className="text-xl font-bold text-gray-900">{vehicle ? 'Редактировать ТС' : 'Добавить ТС'}</h3>
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
                    placeholder="МАЗ"
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
                    placeholder="5440"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Гос. номер <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                    placeholder="A123BC777"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    VIN
                  </label>
                  <input
                    type="text"
                    value={formData.vin}
                    onChange={(e) => setFormData({...formData, vin: e.target.value})}
                    placeholder="XTA..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Год выпуска
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  placeholder="2020"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4">ПТС</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Серия
                    </label>
                    <input
                      type="text"
                      value={formData.ptsSeries}
                      onChange={(e) => setFormData({...formData, ptsSeries: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Номер
                    </label>
                    <input
                      type="text"
                      value={formData.ptsNumber}
                      onChange={(e) => setFormData({...formData, ptsNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4">СТС</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Серия
                    </label>
                    <input
                      type="text"
                      value={formData.stsSeries}
                      onChange={(e) => setFormData({...formData, stsSeries: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Номер
                    </label>
                    <input
                      type="text"
                      value={formData.stsNumber}
                      onChange={(e) => setFormData({...formData, stsNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Владелец</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      ФИО
                    </label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      value={formData.ownerPhone}
                      onChange={(e) => setFormData({...formData, ownerPhone: e.target.value})}
                      placeholder="+375291234567"
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

export default VehicleModal;
