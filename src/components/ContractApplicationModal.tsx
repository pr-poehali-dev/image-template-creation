import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import ConfirmDialog from './ConfirmDialog';
import ModalFooter from './ModalFooter';
import ContractApplicationHeaderSection from './contract-application/ContractApplicationHeaderSection';
import ContractApplicationTransportSection from './contract-application/ContractApplicationTransportSection';
import ContractApplicationLocationSection from './contract-application/ContractApplicationLocationSection';
import ContractApplicationPaymentAssignmentSection from './contract-application/ContractApplicationPaymentAssignmentSection';

interface ContractApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: any;
  onSaved?: () => void;
}

const ContractApplicationModal = ({ isOpen, onClose, document, onSaved }: ContractApplicationModalProps) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Array<{id: number, company_name: string, prefix: string, is_seller: boolean, is_carrier: boolean}>>([]);
  const [drivers, setDrivers] = useState<Array<{id: number, full_name: string}>>([]);
  const [vehicles, setVehicles] = useState<Array<{id: number, vehicle_name: string, brand: string, license_plate: string}>>([]);
  
  const [searchCustomer, setSearchCustomer] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [searchCarrier, setSearchCarrier] = useState('');
  const [showCarrierDropdown, setShowCarrierDropdown] = useState(false);
  const [searchDriver, setSearchDriver] = useState('');
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [searchVehicle, setSearchVehicle] = useState('');
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

  const [formData, setFormData] = useState({
    number: '',
    date: new Date().toISOString().split('T')[0],
    customerId: '',
    carrierId: '',
    isShipper: false,
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
        carrierId: document.carrier_id || '',
        isShipper: document.is_shipper || false,
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
      
      const carrier = customers.find(c => c.id === document.carrier_id);
      setSearchCarrier(carrier?.company_name || '');
      
      const driver = drivers.find(d => d.id === document.driver_id);
      setSearchDriver(driver?.full_name || '');
      
      const vehicle = vehicles.find(v => v.id === document.vehicle_id);
      setSearchVehicle(vehicle ? `${vehicle.brand} ${vehicle.license_plate}` : '');
    } else if (!document && isOpen) {
      setFormData({
        number: '',
        date: new Date().toISOString().split('T')[0],
        customerId: '',
        carrierId: '',
        isShipper: false,
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
      setSearchCarrier('');
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
    setShowCarrierDropdown(false);
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
      setShowCarrierDropdown(false);
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
      
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowCustomerDropdown(false); setShowCarrierDropdown(false); setShowDriverDropdown(false); setShowVehicleDropdown(false); }}>
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
            <div className="space-y-4">
              <ContractApplicationHeaderSection
                formData={formData}
                setFormData={setFormData}
                searchCustomer={searchCustomer}
                setSearchCustomer={setSearchCustomer}
                showCustomerDropdown={showCustomerDropdown}
                setShowCustomerDropdown={setShowCustomerDropdown}
                searchCarrier={searchCarrier}
                setSearchCarrier={setSearchCarrier}
                showCarrierDropdown={showCarrierDropdown}
                setShowCarrierDropdown={setShowCarrierDropdown}
                customers={customers}
              />

              <ContractApplicationTransportSection
                formData={formData}
                setFormData={setFormData}
              />

              <ContractApplicationLocationSection
                formData={formData}
                setFormData={setFormData}
              />

              <ContractApplicationPaymentAssignmentSection
                formData={formData}
                setFormData={setFormData}
                searchDriver={searchDriver}
                setSearchDriver={setSearchDriver}
                showDriverDropdown={showDriverDropdown}
                setShowDriverDropdown={setShowDriverDropdown}
                searchVehicle={searchVehicle}
                setSearchVehicle={setSearchVehicle}
                showVehicleDropdown={showVehicleDropdown}
                setShowVehicleDropdown={setShowVehicleDropdown}
                drivers={drivers}
                vehicles={vehicles}
              />
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