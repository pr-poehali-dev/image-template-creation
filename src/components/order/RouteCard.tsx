import Icon from '../ui/icon';
import RulesInput from '../RulesInput';

interface IntermediatePoint {
  id: string;
  type: 'loading' | 'unloading';
  city: string;
}

interface Customs {
  id: string;
  cargoType: string;
  customsPlace: string;
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

interface RouteCardProps {
  route: Route;
  index: number;
  routes: Route[];
  setRoutes: (routes: Route[]) => void;
  carsList: string[];
  carInputFocus: {[key: string]: boolean};
  setCarInputFocus: (focus: {[key: string]: boolean}) => void;
  addIntermediatePoint: (routeId: string) => void;
  removeIntermediatePoint: (routeId: string, pointId: string) => void;
  addCustomsToRoute: (routeId: string) => void;
  removeCustomsFromRoute: (routeId: string, customsId: string) => void;
  removeRoute: (id: string) => void;
}

export default function RouteCard({
  route,
  index,
  routes,
  setRoutes,
  carsList,
  carInputFocus,
  setCarInputFocus,
  addIntermediatePoint,
  removeIntermediatePoint,
  addCustomsToRoute,
  removeCustomsFromRoute,
  removeRoute
}: RouteCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Маршрут {index + 1}</h3>
        <button
          onClick={() => removeRoute(route.id)}
          className="text-red-600 hover:text-red-700 transition-colors"
        >
          <Icon name="Trash2" size={20} />
        </button>
      </div>

      <RulesInput
        type="date"
        value={route.loadingDate}
        onChange={(val) => setRoutes(routes.map(r => 
          r.id === route.id ? { ...r, loadingDate: val } : r
        ))}
        label="Дата погрузки"
        maxDate="none"
        required
      />

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
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  <Icon name="Trash2" size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            Таможенное оформление
          </label>
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
            Таможенное оформление не добавлено
          </p>
        ) : (
          <div className="space-y-2">
            {route.customsItems.map((customs) => (
              <div key={customs.id} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Характер груза"
                  value={customs.cargoType}
                  onChange={(e) => setRoutes(routes.map(r => 
                    r.id === route.id 
                      ? { ...r, customsItems: r.customsItems.map(c => 
                          c.id === customs.id ? { ...c, cargoType: e.target.value } : c
                        )}
                      : r
                  ))}
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Место таможни"
                  value={customs.customsPlace}
                  onChange={(e) => setRoutes(routes.map(r => 
                    r.id === route.id 
                      ? { ...r, customsItems: r.customsItems.map(c => 
                          c.id === customs.id ? { ...c, customsPlace: e.target.value } : c
                        )}
                      : r
                  ))}
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={() => removeCustomsFromRoute(route.id, customs.id)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  <Icon name="Trash2" size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Закрепленное авто <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          placeholder="Начните вводить название авто..."
          value={route.selectedCar}
          onChange={(e) => setRoutes(routes.map(r => 
            r.id === route.id ? { ...r, selectedCar: e.target.value } : r
          ))}
          onFocus={() => setCarInputFocus({ ...carInputFocus, [route.id]: true })}
          onBlur={() => setTimeout(() => setCarInputFocus({ ...carInputFocus, [route.id]: false }), 200)}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {carInputFocus[route.id] && route.selectedCar && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {carsList
              .filter(car => car.toLowerCase().includes(route.selectedCar.toLowerCase()))
              .map((car, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setRoutes(routes.map(r => 
                      r.id === route.id ? { ...r, selectedCar: car } : r
                    ));
                    setCarInputFocus({ ...carInputFocus, [route.id]: false });
                  }}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {car}
                </div>
              ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Водитель <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          placeholder="Иванов Иван Иванович"
          value={route.driver}
          onChange={(e) => setRoutes(routes.map(r => 
            r.id === route.id ? { ...r, driver: e.target.value } : r
          ))}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Телефон водителя <span className="text-red-600">*</span>
          </label>
          <input
            type="tel"
            placeholder="+7 (999) 123-45-67"
            value={route.driverPhone}
            onChange={(e) => setRoutes(routes.map(r => 
              r.id === route.id ? { ...r, driverPhone: e.target.value } : r
            ))}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Доп. телефон
          </label>
          <input
            type="tel"
            placeholder="+7 (999) 765-43-21"
            value={route.additionalDriverPhone}
            onChange={(e) => setRoutes(routes.map(r => 
              r.id === route.id ? { ...r, additionalDriverPhone: e.target.value } : r
            ))}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Примечание к маршруту</label>
        <textarea
          placeholder="Дополнительная информация о маршруте..."
          value={route.routeNote}
          onChange={(e) => setRoutes(routes.map(r => 
            r.id === route.id ? { ...r, routeNote: e.target.value } : r
          ))}
          rows={1}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y min-h-[42px]"
        />
      </div>
    </div>
  );
}
