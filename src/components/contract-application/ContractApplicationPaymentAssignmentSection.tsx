import Icon from '@/components/ui/icon';

interface ContractApplicationPaymentAssignmentSectionProps {
  formData: {
    freightAmount: string;
    paymentForm: string;
    vatType: string;
    driverId: string;
    vehicleId: string;
  };
  setFormData: (data: any) => void;
  searchDriver: string;
  setSearchDriver: (value: string) => void;
  showDriverDropdown: boolean;
  setShowDriverDropdown: (show: boolean) => void;
  searchVehicle: string;
  setSearchVehicle: (value: string) => void;
  showVehicleDropdown: boolean;
  setShowVehicleDropdown: (show: boolean) => void;
  drivers: Array<{id: number, full_name: string}>;
  vehicles: Array<{id: number, vehicle_name: string, brand: string, license_plate: string}>;
}

const ContractApplicationPaymentAssignmentSection = ({
  formData,
  setFormData,
  searchDriver,
  setSearchDriver,
  showDriverDropdown,
  setShowDriverDropdown,
  searchVehicle,
  setSearchVehicle,
  showVehicleDropdown,
  setShowVehicleDropdown,
  drivers,
  vehicles
}: ContractApplicationPaymentAssignmentSectionProps) => {
  return (
    <>
      <div className="border-t border-gray-200 pt-6">
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

      <div className="border-t border-gray-200 pt-6">
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
    </>
  );
};

export default ContractApplicationPaymentAssignmentSection;
