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
  const [drivers, setDrivers] = useState<Array<{id: number, full_name: string}>>([]);
  
  const [formData, setFormData] = useState({
    brand: '',
    licensePlate: '',
    trailer: '',
    bodyType: '',
    transportCompany: '',
    driverId: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadDrivers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        brand: vehicle.brand || '',
        licensePlate: vehicle.license_plate || '',
        trailer: vehicle.trailer || '',
        bodyType: vehicle.body_type || '',
        transportCompany: vehicle.transport_company || '',
        driverId: vehicle.driver_id?.toString() || ''
      });
    } else {
      setFormData({
        brand: '',
        licensePlate: '',
        trailer: '',
        bodyType: '',
        transportCompany: '',
        driverId: ''
      });
    }
  }, [vehicle, isOpen]);

  const loadDrivers = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/7a16d5d7-0e5e-41bc-b0a7-53decbe50532?resource=drivers');
      const data = await response.json();
      setDrivers(data.drivers || []);
    } catch (error) {
      console.error('Ошибка загрузки водителей:', error);
    }
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    onClose();
  };

  const handleSave = async () => {
    if (loading) return;
    
    if (!formData.brand || !formData.licensePlate || !formData.bodyType || !formData.transportCompany) {
      alert('Заполните обязательные поля: Марка ТС, Гос. номер, Тип кузова, Фирма ТК');
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
          license_plate: formData.licensePlate,
          trailer: formData.trailer || null,
          body_type: formData.bodyType,
          transport_company: formData.transportCompany,
          driver_id: formData.driverId ? parseInt(formData.driverId) : null
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
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
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
                  Марка ТС <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  placeholder="Mercedes-Benz Actros"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Гос. номер <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                  placeholder="AB1234-5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Прицеп
                </label>
                <input
                  type="text"
                  value={formData.trailer}
                  onChange={(e) => setFormData({...formData, trailer: e.target.value})}
                  placeholder="AB1234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Тип кузова <span className="text-red-500">*</span>
                </label>
                <select 
                  value={formData.bodyType}
                  onChange={(e) => setFormData({...formData, bodyType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                >
                  <option value="">Выберите тип</option>
                  <option value="tent">Тентованный</option>
                  <option value="ref">Рефрижератор</option>
                  <option value="isoterm">Изотермический</option>
                  <option value="open">Бортовой</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Фирма ТК <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.transportCompany}
                onChange={(e) => setFormData({...formData, transportCompany: e.target.value})}
                placeholder="ТК Логистик"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Водитель
              </label>
              <select 
                value={formData.driverId}
                onChange={(e) => setFormData({...formData, driverId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
              >
                <option value="">Выберите водителя</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.full_name}
                  </option>
                ))}
              </select>
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
      </div>
    </>
  );
};

export default VehicleModal;
