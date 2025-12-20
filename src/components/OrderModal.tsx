import { useState } from 'react';
import Icon from './ui/icon';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Customs {
  id: string;
  cargoType: string;
  customsPlace: string;
}

interface IntermediatePoint {
  id: string;
  type: 'loading' | 'unloading';
  city: string;
}

interface Route {
  id: string;
  loadingDate: string;
  from: string;
  to: string;
  intermediatePoints: IntermediatePoint[];
  customsItems: Customs[];
  selectedCar: string;
  driver: string;
  driverPhone: string;
  additionalDriverPhone: string;
  routeNote: string;
}

const OrderModal = ({ isOpen, onClose }: OrderModalProps) => {
  const [orderZone, setOrderZone] = useState('EU');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [invoice, setInvoice] = useState('');
  const [track, setTrack] = useState('');
  const [cargoType, setCargoType] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [note, setNote] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [carInputFocus, setCarInputFocus] = useState<{[key: string]: boolean}>({});

  const carsList = [
    'Mercedes-Benz Actros 1845',
    'Volvo FH16 750',
    'Scania R500',
    'MAN TGX 18.480',
    'DAF XF 105.460',
    'Iveco Stralis 450',
    'Renault Magnum 520'
  ];

  if (!isOpen) return null;

  const addRoute = () => {
    setRoutes([...routes, { 
      id: Date.now().toString(), 
      loadingDate: '', 
      from: '', 
      to: '', 
      intermediatePoints: [], 
      customsItems: [],
      selectedCar: '',
      driver: '',
      driverPhone: '',
      additionalDriverPhone: '',
      routeNote: ''
    }]);
  };

  const removeRoute = (id: string) => {
    setRoutes(routes.filter(r => r.id !== id));
  };

  const addIntermediatePoint = (routeId: string) => {
    setRoutes(routes.map(r => 
      r.id === routeId 
        ? { ...r, intermediatePoints: [...r.intermediatePoints, { id: Date.now().toString(), type: 'loading', city: '' }] }
        : r
    ));
  };

  const removeIntermediatePoint = (routeId: string, pointId: string) => {
    setRoutes(routes.map(r => 
      r.id === routeId 
        ? { ...r, intermediatePoints: r.intermediatePoints.filter(p => p.id !== pointId) }
        : r
    ));
  };

  const addCustomsToRoute = (routeId: string) => {
    setRoutes(routes.map(r => 
      r.id === routeId 
        ? { ...r, customsItems: [...r.customsItems, { id: Date.now().toString(), cargoType: '', customsPlace: '' }] }
        : r
    ));
  };

  const removeCustomsFromRoute = (routeId: string, customsId: string) => {
    setRoutes(routes.map(r => 
      r.id === routeId 
        ? { ...r, customsItems: r.customsItems.filter(c => c.id !== customsId) }
        : r
    ));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Управление заказами</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="FileText" size={20} className="text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Характеристика заказа</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex gap-2">
                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Зона <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={orderZone}
                        onChange={(e) => setOrderZone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="EU">EU</option>
                        <option value="RU">RU</option>
                        <option value="CH">CH</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        № заказа <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="001"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Дата заказа <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="ДД-ММ-ГГГГ"
                      value={orderDate}
                      onChange={(e) => setOrderDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Инвойс <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="INV-12345"
                      value={invoice}
                      onChange={(e) => setInvoice(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Трак <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="TRK-67890"
                      value={track}
                      onChange={(e) => setTrack(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Характер груза <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Лук, Нобилис"
                      value={cargoType}
                      onChange={(e) => setCargoType(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Вес груза (кг) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="20000"
                      value={cargoWeight}
                      onChange={(e) => setCargoWeight(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Примечание</label>
                  <textarea
                    placeholder="Дополнительная информация о заказе..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={1}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Прикрепить файлы (накладные, заявки)
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary/90"
                  />
                  {files.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      Выбрано файлов: {files.length}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Route" size={20} className="text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Маршруты</h3>
              </div>
              
              {routes.length > 0 && (
                <div className="space-y-4 mb-4">
                  {routes.map((route, index) => (
                    <div key={route.id} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-white">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Маршрут {index + 1}</h3>
                        <button
                          onClick={() => removeRoute(route.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Icon name="Trash2" size={20} />
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Дата погрузки <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="ДД-ММ-ГГГГ"
                          value={route.loadingDate}
                          onChange={(e) => setRoutes(routes.map(r => 
                            r.id === route.id ? { ...r, loadingDate: e.target.value } : r
                          ))}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Откуда <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Москва"
                            value={route.from}
                            onChange={(e) => setRoutes(routes.map(r => 
                              r.id === route.id ? { ...r, from: e.target.value } : r
                            ))}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Куда <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Санкт-Петербург"
                            value={route.to}
                            onChange={(e) => setRoutes(routes.map(r => 
                              r.id === route.id ? { ...r, to: e.target.value } : r
                            ))}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">
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
                          <p className="text-sm text-gray-500 italic">
                            Промежуточные точки не добавлены
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {route.intermediatePoints.map((point) => (
                              <div key={point.id} className="flex gap-2">
                                <select
                                  value={point.type}
                                  onChange={(e) => setRoutes(routes.map(r => 
                                    r.id === route.id 
                                      ? { ...r, intermediatePoints: r.intermediatePoints.map(p => 
                                          p.id === point.id ? { ...p, type: e.target.value as 'loading' | 'unloading' } : p
                                        )}
                                      : r
                                  ))}
                                  className="w-40 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                  <option value="loading">Погрузка</option>
                                  <option value="unloading">Разгрузка</option>
                                </select>
                                <input
                                  type="text"
                                  placeholder="Город"
                                  value={point.city}
                                  onChange={(e) => setRoutes(routes.map(r => 
                                    r.id === route.id 
                                      ? { ...r, intermediatePoints: r.intermediatePoints.map(p => 
                                          p.id === point.id ? { ...p, city: e.target.value } : p
                                        )}
                                      : r
                                  ))}
                                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                <button
                                  onClick={() => removeIntermediatePoint(route.id, point.id)}
                                  className="text-red-600 hover:text-red-700 transition-colors px-2"
                                >
                                  <Icon name="Trash2" size={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-300 pt-4 mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon name="Shield" size={18} className="text-gray-600" />
                            <label className="text-sm font-medium text-gray-700">Таможня</label>
                          </div>
                          <button
                            onClick={() => addCustomsToRoute(route.id)}
                            className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm"
                          >
                            <Icon name="Plus" size={16} />
                            Добавить
                          </button>
                        </div>
                        {route.customsItems.length === 0 ? (
                          <p className="text-sm text-gray-500 italic">
                            Таможня не добавлена
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {route.customsItems.map((customs) => (
                              <div key={customs.id} className="border border-gray-300 rounded-lg p-3 bg-white">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="text-sm font-semibold text-gray-900">Таможня</h5>
                                  <button
                                    onClick={() => removeCustomsFromRoute(route.id, customs.id)}
                                    className="text-red-600 hover:text-red-700 transition-colors"
                                  >
                                    <Icon name="Trash2" size={18} />
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Тип груза</label>
                                    <input
                                      type="text"
                                      placeholder="Лук"
                                      value={customs.cargoType}
                                      onChange={(e) => setRoutes(routes.map(r => 
                                        r.id === route.id 
                                          ? { ...r, customsItems: r.customsItems.map(c => 
                                              c.id === customs.id ? { ...c, cargoType: e.target.value } : c
                                            )}
                                          : r
                                      ))}
                                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Место таможни</label>
                                    <input
                                      type="text"
                                      placeholder="Москва"
                                      value={customs.customsPlace}
                                      onChange={(e) => setRoutes(routes.map(r => 
                                        r.id === route.id 
                                          ? { ...r, customsItems: r.customsItems.map(c => 
                                              c.id === customs.id ? { ...c, customsPlace: e.target.value } : c
                                            )}
                                          : r
                                      ))}
                                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 border-t border-gray-300 pt-4">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">Информация о транспорте</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Автомобиль <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Введите марку или модель"
                              value={route.selectedCar}
                              onChange={(e) => setRoutes(routes.map(r => 
                                r.id === route.id ? { ...r, selectedCar: e.target.value } : r
                              ))}
                              onFocus={() => setCarInputFocus({...carInputFocus, [route.id]: true})}
                              onBlur={() => setTimeout(() => setCarInputFocus({...carInputFocus, [route.id]: false}), 200)}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            {carInputFocus[route.id] && route.selectedCar && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {carsList
                                  .filter(car => car.toLowerCase().includes(route.selectedCar.toLowerCase()))
                                  .map((car, idx) => (
                                    <div
                                      key={idx}
                                      onClick={() => {
                                        setRoutes(routes.map(r => 
                                          r.id === route.id ? { ...r, selectedCar: car } : r
                                        ));
                                        setCarInputFocus({...carInputFocus, [route.id]: false});
                                      }}
                                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                    >
                                      {car}
                                    </div>
                                  ))}
                                {carsList.filter(car => car.toLowerCase().includes(route.selectedCar.toLowerCase())).length === 0 && (
                                  <div className="px-3 py-2 text-sm text-gray-500 italic">
                                    Ничего не найдено
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Водитель <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Автоматически"
                              value={route.driver}
                              onChange={(e) => setRoutes(routes.map(r => 
                                r.id === route.id ? { ...r, driver: e.target.value } : r
                              ))}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Телефон водителя</label>
                            <input
                              type="tel"
                              placeholder="Автоматически"
                              value={route.driverPhone}
                              onChange={(e) => setRoutes(routes.map(r => 
                                r.id === route.id ? { ...r, driverPhone: e.target.value } : r
                              ))}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Доп. телефон водителя</label>
                            <input
                              type="tel"
                              placeholder="Автоматически"
                              value={route.additionalDriverPhone}
                              onChange={(e) => setRoutes(routes.map(r => 
                                r.id === route.id ? { ...r, additionalDriverPhone: e.target.value } : r
                              ))}
                              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Примечание к маршруту</label>
                          <textarea
                            placeholder="Дополнительная информация о маршруте..."
                            value={route.routeNote}
                            onChange={(e) => setRoutes(routes.map(r => 
                              r.id === route.id ? { ...r, routeNote: e.target.value } : r
                            ))}
                            rows={3}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={addRoute}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-primary hover:border-primary hover:bg-primary/5 flex items-center justify-center gap-2 font-medium transition-colors"
              >
                <Icon name="Plus" size={20} />
                Добавить маршрут
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium text-gray-700 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={() => {
              console.log('Сохранение заказа');
              onClose();
            }}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors"
          >
            Сохранить заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;