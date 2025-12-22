import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Vehicle {
  id: number;
  vehicle_name: string;
  brand: string;
  license_plate: string;
  trailer: string;
  body_type: string;
  transport_company: string;
  driver_id: number;
  created_at: string;
  updated_at: string;
}

interface VehiclesTableProps {
  setEditingVehicle: (vehicle: any) => void;
  setIsVehicleModalOpen: (open: boolean) => void;
  refreshVehicles: number;
}

const VehiclesTable = ({ setEditingVehicle, setIsVehicleModalOpen, refreshVehicles }: VehiclesTableProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, [refreshVehicles]);

  const loadVehicles = async () => {
    setLoadingVehicles(true);
    try {
      const response = await fetch('https://functions.poehali.dev/7a16d5d7-0e5e-41bc-b0a7-53decbe50532?resource=vehicles');
      const data = await response.json();
      setVehicles(data.vehicles || []);
    } catch (error) {
      console.error('Ошибка загрузки автомобилей:', error);
    } finally {
      setLoadingVehicles(false);
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    if (!confirm('Удалить этот автомобиль?')) return;
    
    try {
      const response = await fetch(`https://functions.poehali.dev/7a16d5d7-0e5e-41bc-b0a7-53decbe50532?resource=vehicles`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (response.ok) {
        await loadVehicles();
      } else {
        alert('Ошибка удаления автомобиля');
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка удаления автомобиля');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-4">
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск автомобиля..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Марка ТС</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Номер ТС</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Прицеп</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Фирма ТК</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loadingVehicles ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span>Загрузка...</span>
                      </div>
                    </td>
                  </tr>
                ) : vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      Нет автомобилей
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">{vehicle.brand}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{vehicle.license_plate}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{vehicle.trailer || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{vehicle.transport_company}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setEditingVehicle(vehicle);
                              setIsVehicleModalOpen(true);
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition-colors" 
                            title="Редактировать"
                          >
                            <Icon name="Edit" size={18} className="text-gray-600" />
                          </button>
                          <button 
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors" 
                            title="Удалить"
                          >
                            <Icon name="Trash2" size={18} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclesTable;
