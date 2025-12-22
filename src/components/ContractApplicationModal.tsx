import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import ConfirmDialog from './ConfirmDialog';
import ModalFooter from './ModalFooter';

interface ContractApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: any;
  onSaved?: () => void;
}

const ContractApplicationModal = ({ isOpen, onClose, document, onSaved }: ContractApplicationModalProps) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Array<{id: number, company_name: string, prefix: string, is_seller: boolean}>>([]);
  const [drivers, setDrivers] = useState<Array<{id: number, full_name: string}>>([]);
  const [vehicles, setVehicles] = useState<Array<{id: number, vehicle_name: string, brand: string, license_plate: string}>>([]);
  
  const [searchCustomer, setSearchCustomer] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [searchDriver, setSearchDriver] = useState('');
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [searchVehicle, setSearchVehicle] = useState('');
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

  const [formData, setFormData] = useState({
    number: '',
    date: new Date().toISOString().split('T')[0],
    customerId: '',
    bodyType: '',
    tempFrom: '',
    tempTo: '',
    cargoType: '',
    loadingDate: '',
    loadingAddress: '',
    loadingContact: '',
    unloadingDate: '',
    unloadingAddress: '',
    unloadingContact: '',
    freightAmount: '',
    paymentForm: '',
    vatType: '',
    driverId: '',
    vehicleId: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadCustomers();
      loadDrivers();
      loadVehicles();
    }
  }, [isOpen]);

  useEffect(() => {
    if (document && isOpen) {
      setFormData({
        number: document.number || '',
        date: document.date || new Date().toISOString().split('T')[0],
        customerId: document.customer_id || '',
        bodyType: document.body_type || '',
        tempFrom: document.temp_from || '',
        tempTo: document.temp_to || '',
        cargoType: document.cargo_type || '',
        loadingDate: document.loading_date || '',
        loadingAddress: document.loading_address || '',
        loadingContact: document.loading_contact || '',
        unloadingDate: document.unloading_date || '',
        unloadingAddress: document.unloading_address || '',
        unloadingContact: document.unloading_contact || '',
        freightAmount: document.freight_amount || '',
        paymentForm: document.payment_form || '',
        vatType: document.vat_type || '',
        driverId: document.driver_id || '',
        vehicleId: document.vehicle_id || ''
      });
      
      const customer = customers.find(c => c.id === document.customer_id);
      setSearchCustomer(customer?.company_name || '');
      
      const driver = drivers.find(d => d.id === document.driver_id);
      setSearchDriver(driver?.full_name || '');
      
      const vehicle = vehicles.find(v => v.id === document.vehicle_id);
      setSearchVehicle(vehicle ? `${vehicle.brand} ${vehicle.license_plate}` : '');
    } else if (!document && isOpen) {
      setFormData({
        number: '',
        date: new Date().toISOString().split('T')[0],
        customerId: '',
        bodyType: '',
        tempFrom: '',
        tempTo: '',
        cargoType: '',
        loadingDate: '',
        loadingAddress: '',
        loadingContact: '',
        unloadingDate: '',
        unloadingAddress: '',
        unloadingContact: '',
        freightAmount: '',
        paymentForm: '',
        vatType: '',
        driverId: '',
        vehicleId: ''
      });
      setSearchCustomer('');
      setSearchDriver('');
      setSearchVehicle('');
    }
  }, [document, isOpen, customers, drivers, vehicles]);

  const loadCustomers = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/7a16d5d7-0e5e-41bc-b0a7-53decbe50532?resource=customers');
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Ошибка загрузки контрагентов:', error);
    }
  };

  const loadDrivers = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/7a16d5d7-0e5e-41bc-b0a7-53decbe50532?resource=drivers');
      const data = await response.json();
      setDrivers(data.drivers || []);
    } catch (error) {
      console.error('Ошибка загрузки водителей:', error);
    }
  };

  const loadVehicles = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/7a16d5d7-0e5e-41bc-b0a7-53decbe50532?resource=vehicles');
      const data = await response.json();
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error('Ошибка загрузки автомобилей:', error);
    }
  };

  const generateDocumentNumber = (customerId: string, date: string) => {
    const customer = customers.find(c => c.id === parseInt(customerId));
    if (!customer || !customer.prefix) return '';
    
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    
    return `${customer.prefix}${day}${month}-001`;
  };

  useEffect(() => {
    if (formData.customerId && formData.date && !document) {
      const newNumber = generateDocumentNumber(formData.customerId, formData.date);
      setFormData(prev => ({ ...prev, number: newNumber }));
    }
  }, [formData.customerId, formData.date, customers]);

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    setShowCustomerDropdown(false);
    setShowDriverDropdown(false);
    setShowVehicleDropdown(false);
    onClose();
  };

  const handleSave = async () => {
    if (loading) return;
    
    if (!formData.customerId || !formData.loadingDate || !formData.unloadingDate) {
      alert('Заполните обязательные поля: Контрагент, Дата погрузки, Дата разгрузки');
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('Сохранение документа:', formData);
      
      setLoading(false);
      setShowCustomerDropdown(false);
      setShowDriverDropdown(false);
      setShowVehicleDropdown(false);
      onClose();
      if (onSaved) onSaved();
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      alert('Не удалось сохранить документ');
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
      
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowCustomerDropdown(false); setShowDriverDropdown(false); setShowVehicleDropdown(false); }}>
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h3 className="text-xl font-bold text-gray-900">{document ? 'Редактировать договор-заявку' : 'Создать договор-заявку'}</h3>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Icon name="X" size={20} className="text-gray-600" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Договор-заявка № <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.number}
                    readOnly
                    placeholder="Выберите контрагента"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Дата заявки <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Контрагент (Продавец) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={searchCustomer}
                  onChange={(e) => {
                    setSearchCustomer(e.target.value);
                    setShowCustomerDropdown(true);
                  }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 200)}
                  placeholder="Введите название или выберите из списка"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                
                {showCustomerDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {customers
                      .filter(c => c.is_seller && c.company_name.toLowerCase().includes(searchCustomer.toLowerCase()))
                      .map(customer => (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => {
                            setSearchCustomer(customer.company_name);
                            setFormData({...formData, customerId: customer.id.toString()});
                            setShowCustomerDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-primary/5 transition-colors text-sm text-gray-900"
                        >
                          {customer.company_name}
                        </button>
                      ))}
                    
                    {customers.filter(c => c.is_seller && c.company_name.toLowerCase().includes(searchCustomer.toLowerCase())).length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Нет подходящих продавцов
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="Truck" size={18} className="text-gray-600" />
                  Транспорт и груз
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Требуемый тип кузова <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={formData.bodyType}
                      onChange={(e) => setFormData({...formData, bodyType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      <option value="" disabled className="text-gray-400">Выберите тип</option>
                      <option value="tent">Тентованный</option>
                      <option value="ref">Рефрижератор</option>
                      <option value="isoterm">Изотермический</option>
                      <option value="open">Бортовой</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Температурный режим
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.tempFrom}
                        onChange={(e) => setFormData({...formData, tempFrom: e.target.value})}
                        placeholder="от °C"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={formData.tempTo}
                        onChange={(e) => setFormData({...formData, tempTo: e.target.value})}
                        placeholder="до °C"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Характер груза
                  </label>
                  <input
                    type="text"
                    value={formData.cargoType}
                    onChange={(e) => setFormData({...formData, cargoType: e.target.value})}
                    placeholder="Например: Продукты питания"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="MapPin" size={18} className="text-gray-600" />
                  Погрузка
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Дата погрузки <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.loadingDate}
                      onChange={(e) => setFormData({...formData, loadingDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Контактное лицо
                    </label>
                    <input
                      type="text"
                      value={formData.loadingContact}
                      onChange={(e) => setFormData({...formData, loadingContact: e.target.value})}
                      placeholder="ФИО, телефон"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Адрес погрузки
                  </label>
                  <input
                    type="text"
                    value={formData.loadingAddress}
                    onChange={(e) => setFormData({...formData, loadingAddress: e.target.value})}
                    placeholder="Полный адрес"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="MapPinOff" size={18} className="text-gray-600" />
                  Разгрузка
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Дата разгрузки <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.unloadingDate}
                      onChange={(e) => setFormData({...formData, unloadingDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Контактное лицо
                    </label>
                    <input
                      type="text"
                      value={formData.unloadingContact}
                      onChange={(e) => setFormData({...formData, unloadingContact: e.target.value})}
                      placeholder="ФИО, телефон"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Адрес разгрузки
                  </label>
                  <input
                    type="text"
                    value={formData.unloadingAddress}
                    onChange={(e) => setFormData({...formData, unloadingAddress: e.target.value})}
                    placeholder="Полный адрес"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="Banknote" size={18} className="text-gray-600" />
                  Оплата
                </h4>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Сумма фрахта
                    </label>
                    <input
                      type="number"
                      value={formData.freightAmount}
                      onChange={(e) => setFormData({...formData, freightAmount: e.target.value})}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Форма оплаты
                    </label>
                    <select 
                      value={formData.paymentForm}
                      onChange={(e) => setFormData({...formData, paymentForm: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      <option value="" disabled className="text-gray-400">Выберите</option>
                      <option value="cash">Наличные</option>
                      <option value="cashless">Безналичный</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      НДС
                    </label>
                    <select 
                      value={formData.vatType}
                      onChange={(e) => setFormData({...formData, vatType: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      <option value="" disabled className="text-gray-400">Выберите</option>
                      <option value="with">С НДС</option>
                      <option value="without">Без НДС</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Icon name="Users" size={18} className="text-gray-600" />
                  Назначение
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Водитель
                    </label>
                    <input
                      type="text"
                      value={searchDriver}
                      onChange={(e) => {
                        setSearchDriver(e.target.value);
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
                            setSearchDriver('');
                            setFormData({...formData, driverId: ''});
                            setShowDriverDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-primary/5 transition-colors text-sm text-gray-500 italic border-b border-gray-200"
                        >
                          Без водителя
                        </button>
                        
                        {drivers
                          .filter(d => d.full_name.toLowerCase().includes(searchDriver.toLowerCase()))
                          .map(driver => (
                            <button
                              key={driver.id}
                              type="button"
                              onClick={() => {
                                setSearchDriver(driver.full_name);
                                setFormData({...formData, driverId: driver.id.toString()});
                                setShowDriverDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-primary/5 transition-colors text-sm text-gray-900"
                            >
                              {driver.full_name}
                            </button>
                          ))}
                        
                        {drivers.filter(d => d.full_name.toLowerCase().includes(searchDriver.toLowerCase())).length === 0 && (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            Нет подходящих водителей
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Автомобиль
                    </label>
                    <input
                      type="text"
                      value={searchVehicle}
                      onChange={(e) => {
                        setSearchVehicle(e.target.value);
                        setShowVehicleDropdown(true);
                      }}
                      onFocus={() => setShowVehicleDropdown(true)}
                      onBlur={() => setTimeout(() => setShowVehicleDropdown(false), 200)}
                      placeholder="Введите марку или госномер"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    
                    {showVehicleDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setSearchVehicle('');
                            setFormData({...formData, vehicleId: ''});
                            setShowVehicleDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-primary/5 transition-colors text-sm text-gray-500 italic border-b border-gray-200"
                        >
                          Без автомобиля
                        </button>
                        
                        {vehicles
                          .filter(v => 
                            v.brand.toLowerCase().includes(searchVehicle.toLowerCase()) ||
                            v.license_plate.toLowerCase().includes(searchVehicle.toLowerCase())
                          )
                          .map(vehicle => (
                            <button
                              key={vehicle.id}
                              type="button"
                              onClick={() => {
                                setSearchVehicle(`${vehicle.brand} ${vehicle.license_plate}`);
                                setFormData({...formData, vehicleId: vehicle.id.toString()});
                                setShowVehicleDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-primary/5 transition-colors text-sm text-gray-900"
                            >
                              {vehicle.brand} {vehicle.license_plate}
                            </button>
                          ))}
                        
                        {vehicles.filter(v => 
                          v.brand.toLowerCase().includes(searchVehicle.toLowerCase()) ||
                          v.license_plate.toLowerCase().includes(searchVehicle.toLowerCase())
                        ).length === 0 && (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            Нет подходящих автомобилей
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <ModalFooter 
              onCancel={handleCancel} 
              onSave={handleSave} 
              loading={loading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContractApplicationModal;
