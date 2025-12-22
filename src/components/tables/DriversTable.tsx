import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Driver {
  id: number;
  full_name: string;
  phone: string;
  passport_series: string;
  passport_number: string;
  passport_issued_by: string;
  passport_issued_date: string;
  license_series: string;
  license_number: string;
  license_category: string;
  created_at: string;
  updated_at: string;
}

interface DriversTableProps {
  setEditingDriver: (driver: any) => void;
  setIsDriverModalOpen: (open: boolean) => void;
  refreshDrivers: number;
}

const DriversTable = ({ setEditingDriver, setIsDriverModalOpen, refreshDrivers }: DriversTableProps) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);

  useEffect(() => {
    loadDrivers();
  }, [refreshDrivers]);

  const loadDrivers = async () => {
    setLoadingDrivers(true);
    try {
      const response = await fetch('https://functions.poehali.dev/7a16d5d7-0e5e-41bc-b0a7-53decbe50532?resource=drivers');
      const data = await response.json();
      setDrivers(data.drivers || []);
    } catch (error) {
      console.error('Ошибка загрузки водителей:', error);
    } finally {
      setLoadingDrivers(false);
    }
  };

  const handleDeleteDriver = async (id: number) => {
    if (!confirm('Удалить этого водителя?')) return;
    
    try {
      const response = await fetch(`https://functions.poehali.dev/7a16d5d7-0e5e-41bc-b0a7-53decbe50532?resource=drivers`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      
      if (response.ok) {
        await loadDrivers();
      } else {
        alert('Ошибка удаления водителя');
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка удаления водителя');
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-4">
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск водителя..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ФИО</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Телефон</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Водительское удостоверение</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loadingDrivers ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span>Загрузка...</span>
                      </div>
                    </td>
                  </tr>
                ) : drivers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      Нет водителей
                    </td>
                  </tr>
                ) : (
                  drivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">{driver.full_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{driver.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{driver.license_series} {driver.license_number}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setEditingDriver(driver);
                              setIsDriverModalOpen(true);
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition-colors" 
                            title="Редактировать"
                          >
                            <Icon name="Edit" size={18} className="text-gray-600" />
                          </button>
                          <button 
                            onClick={() => handleDeleteDriver(driver.id)}
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

export default DriversTable;
