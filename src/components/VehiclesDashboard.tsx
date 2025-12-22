import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  license_plate: string;
  vin: string;
  registration_certificate: string;
  pts_series: string;
  pts_number: string;
  color: string;
  created_at: string;
  updated_at: string;
}

interface VehiclesDashboardProps {
  refreshVehicles: number;
  setIsVehicleModalOpen: (open: boolean) => void;
  setEditingVehicle: (vehicle: Vehicle | null) => void;
}

const VehiclesDashboard = ({ 
  refreshVehicles, 
  setIsVehicleModalOpen, 
  setEditingVehicle 
}: VehiclesDashboardProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.license_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-4">
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по гос. номеру, марке, модели..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {loadingVehicles ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Загрузка...</div>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Icon name="Car" size={48} className="mb-4 text-gray-300" />
              <p className="text-lg font-medium">Нет автомобилей</p>
              <p className="text-sm mt-1">Добавьте первый автомобиль</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Марка</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Модель</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Год</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Гос. номер</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">VIN</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Цвет</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">{vehicle.brand}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{vehicle.model}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{vehicle.year || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{vehicle.license_plate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{vehicle.vin || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{vehicle.color || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingVehicle(vehicle);
                              setIsVehicleModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors group"
                            title="Редактировать"
                          >
                            <Icon name="Pencil" size={16} className="text-gray-600 group-hover:text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(vehicle.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Удалить"
                          >
                            <Icon name="Trash2" size={16} className="text-gray-600 group-hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehiclesDashboard;
