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
  const [customers, setCustomers] = useState<Array<{id: number, company_name: string, is_carrier: boolean}>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [driverSearchTerm, setDriverSearchTerm] = useState('');
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  
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
      loadCustomers();
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
      setSearchTerm(vehicle.transport_company || '');
      const driver = drivers.find(d => d.id === vehicle.driver_id);
      setDriverSearchTerm(driver?.full_name || '');
    } else {
      setFormData({
        brand: '',
        licensePlate: '',
        trailer: '',
        bodyType: '',
        transportCompany: '',
        driverId: ''
      });
      setSearchTerm('');
      setDriverSearchTerm('');
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

  const loadCustomers = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/7a16d5d7-0e5e-41bc-b0a7-53decbe50532?resource=customers');
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Ошибка загрузки контрагентов:', error);
    }
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    setShowDropdown(false);
    setShowDriverDropdown(false);
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
      
      setShowDropdown(false);
      setShowDriverDropdown(false);
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
      
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowDropdown(false); setShowDriverDropdown(false); }}>
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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

            <div className="relative">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Фирма ТК <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setFormData({...formData, transportCompany: e.target.value});
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Введите название или выберите из списка"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {customers
                    .filter(c => c.is_carrier && c.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(customer => (
                      <button
                        key={customer.id}
                        type="button"
                        onClick={() => {
                          setSearchTerm(customer.company_name);
                          setFormData({...formData, transportCompany: customer.company_name});
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-primary/5 transition-colors text-sm text-gray-900"
                      >
                        {customer.company_name}
                      </button>
                    ))}
                  
                  {customers.filter(c => c.is_carrier && c.company_name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Нет подходящих перевозчиков
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Водитель
              </label>
              <input
                type="text"
                value={driverSearchTerm}
                onChange={(e) => {
                  setDriverSearchTerm(e.target.value);
                  setShowDriverDropdown(true);
                }}
                onFocus={() => setShowDriverDropdown(true)}
                onBlur={() => setTimeout(() => setShowDriverDropdown(false), 200)}
                placeholder="Введите ФИО или выберите из списка"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              
              {showDriverDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setDriverSearchTerm('');
                      setFormData({...formData, driverId: ''});
                      setShowDriverDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-primary/5 transition-colors text-sm text-gray-500 italic border-b border-gray-200"
                  >
                    Без водителя
                  </button>
                  
                  {drivers
                    .filter(d => d.full_name.toLowerCase().includes(driverSearchTerm.toLowerCase()))
                    .map(driver => (
                      <button
                        key={driver.id}
                        type="button"
                        onClick={() => {
                          setDriverSearchTerm(driver.full_name);
                          setFormData({...formData, driverId: driver.id.toString()});
                          setShowDriverDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-primary/5 transition-colors text-sm text-gray-900"
                      >
                        {driver.full_name}
                      </button>
                    ))}
                  
                  {drivers.filter(d => d.full_name.toLowerCase().includes(driverSearchTerm.toLowerCase())).length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Нет подходящих водителей
                    </div>
                  )}
                </div>
              )}
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