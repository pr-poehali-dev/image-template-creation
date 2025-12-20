import { useState } from 'react';
import Icon from '@/components/ui/icon';
import ConfirmDialog from './ConfirmDialog';
import ModalFooter from './ModalFooter';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VehicleModal = ({ isOpen, onClose }: VehicleModalProps) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    onClose();
  };

  const handleSave = () => {
    console.log('Сохранение автомобиля');
    onClose();
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
          <h3 className="text-xl font-bold text-gray-900">Создать</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Icon name="X" size={20} className="text-gray-600" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Транспорт
              </label>
              <input
                type="text"
                placeholder="Формируется автоматически"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Марка ТС <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Mercedes-Benz Actros"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Гос. номер <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="AB1234-5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Прицеп
                </label>
                <input
                  type="text"
                  placeholder="AB1234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Тип кузова <span className="text-red-500">*</span>
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                <option value="">Выберите тип</option>
                <option value="tent">Тентованный</option>
                <option value="ref">Рефрижератор</option>
                <option value="isoterm">Изотермический</option>
                <option value="open">Бортовой</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Фирма ТК <span className="text-red-500">*</span>
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                <option value="">Выберите перевозчика</option>
                <option value="tk1">ТК Логистик</option>
                <option value="tk2">ТК Экспресс</option>
                <option value="tk3">ТК Транзит</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Водитель <span className="text-red-500">*</span>
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white">
                <option value="">Выберите водителя</option>
                <option value="driver1">Иванов Иван Иванович</option>
                <option value="driver2">Петров Петр Петрович</option>
                <option value="driver3">Сидоров Сидор Сидорович</option>
              </select>
            </div>
          </div>

          <ModalFooter onCancel={handleCancel} onSave={handleSave} />
        </div>
        </div>
      </div>
    </>
  );
};

export default VehicleModal;