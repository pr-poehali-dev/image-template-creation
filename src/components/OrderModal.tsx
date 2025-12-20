import { useState } from 'react';
import Icon from './ui/icon';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Route {
  id: string;
  loadingDate: string;
  from: string;
  to: string;
  intermediatePoints: string[];
}

interface Customs {
  id: string;
  cargoType: string;
  customsPlace: string;
}

const OrderModal = ({ isOpen, onClose }: OrderModalProps) => {
  const [cargoType, setCargoType] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [note, setNote] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [routes, setRoutes] = useState<Route[]>([
    { id: '1', loadingDate: '', from: '', to: '', intermediatePoints: [] }
  ]);
  const [customsItems, setCustomsItems] = useState<Customs[]>([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [driver, setDriver] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [additionalDriverPhone, setAdditionalDriverPhone] = useState('');
  const [routeNote, setRouteNote] = useState('');

  if (!isOpen) return null;

  const addRoute = () => {
    setRoutes([...routes, { id: Date.now().toString(), loadingDate: '', from: '', to: '', intermediatePoints: [] }]);
  };

  const removeRoute = (id: string) => {
    setRoutes(routes.filter(r => r.id !== id));
  };

  const addIntermediatePoint = (routeId: string) => {
    setRoutes(routes.map(r => 
      r.id === routeId 
        ? { ...r, intermediatePoints: [...r.intermediatePoints, ''] }
        : r
    ));
  };

  const addCustoms = () => {
    setCustomsItems([...customsItems, { id: Date.now().toString(), cargoType: '', customsPlace: '' }]);
  };

  const removeCustoms = (id: string) => {
    setCustomsItems(customsItems.filter(c => c.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Управление заказами</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Характер груза <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Лук, Нобилис"
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Вес груза (кг) <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  placeholder="20000"
                  value={cargoWeight}
                  onChange={(e) => setCargoWeight(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Примечание</label>
              <textarea
                placeholder="Дополнительная информация о заказе..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Прикрепить файлы (накладные, заявки)
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary/90"
              />
              {files.length > 0 && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Выбрано файлов: {files.length}
                </div>
              )}
            </div>

            {routes.map((route, index) => (
              <div key={route.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Маршрут {index + 1}</h3>
                  {routes.length > 1 && (
                    <button
                      onClick={() => removeRoute(route.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Icon name="Trash2" size={20} />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Дата погрузки <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ДД-ММ-ГГГГ"
                    value={route.loadingDate}
                    onChange={(e) => setRoutes(routes.map(r => 
                      r.id === route.id ? { ...r, loadingDate: e.target.value } : r
                    ))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Откуда <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Москва"
                      value={route.from}
                      onChange={(e) => setRoutes(routes.map(r => 
                        r.id === route.id ? { ...r, from: e.target.value } : r
                      ))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Куда <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Санкт-Петербург"
                      value={route.to}
                      onChange={(e) => setRoutes(routes.map(r => 
                        r.id === route.id ? { ...r, to: e.target.value } : r
                      ))}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium">
                      Промежуточные точки погрузки/разгрузки
                    </label>
                    <button
                      onClick={() => addIntermediatePoint(route.id)}
                      className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
                    >
                      <Icon name="Plus" size={16} />
                      Добавить
                    </button>
                  </div>
                  {route.intermediatePoints.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                      Промежуточные точки не добавлены
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {route.intermediatePoints.map((_, idx) => (
                        <input
                          key={idx}
                          type="text"
                          placeholder="Город"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={addRoute}
              className="w-full py-3 border-2 border-dashed rounded-lg text-primary hover:bg-primary/5 font-medium flex items-center justify-center gap-2"
            >
              <Icon name="Plus" size={20} />
              Добавить маршрут
            </button>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium">Таможня</label>
                <button
                  onClick={addCustoms}
                  className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
                >
                  <Icon name="Plus" size={16} />
                  Добавить
                </button>
              </div>
              {customsItems.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  Таможня не добавлена
                </p>
              ) : (
                <div className="space-y-4">
                  {customsItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold">Таможня</h4>
                        <button
                          onClick={() => removeCustoms(item.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Icon name="Trash2" size={20} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Тип груза</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Место таможни</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold">Информация о транспорте</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Автомобиль <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={selectedCar}
                    onChange={(e) => setSelectedCar(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Выберите автомобиль</option>
                    <option value="car1">Автомобиль 1</option>
                    <option value="car2">Автомобиль 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Водитель <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Автоматически"
                    value={driver}
                    onChange={(e) => setDriver(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Телефон водителя</label>
                  <input
                    type="tel"
                    placeholder="Автоматически"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Доп. телефон водителя</label>
                  <input
                    type="tel"
                    placeholder="Автоматически"
                    value={additionalDriverPhone}
                    onChange={(e) => setAdditionalDriverPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Примечание к маршруту</label>
                <textarea
                  placeholder="Дополнительная информация о маршруте..."
                  value={routeNote}
                  onChange={(e) => setRouteNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 border rounded-lg hover:bg-accent font-medium"
          >
            Отмена
          </button>
          <button
            onClick={() => {
              console.log('Сохранение заказа');
              onClose();
            }}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
          >
            Сохранить заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
