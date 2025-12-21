import Icon from '../ui/icon';
import RouteCard from './RouteCard';

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

interface RouteSectionProps {
  routes: Route[];
  setRoutes: (routes: Route[]) => void;
  carsList: string[];
  carInputFocus: {[key: string]: boolean};
  setCarInputFocus: (focus: {[key: string]: boolean}) => void;
  addRoute: () => void;
  removeRoute: (id: string) => void;
  addIntermediatePoint: (routeId: string) => void;
  removeIntermediatePoint: (routeId: string, pointId: string) => void;
  addCustomsToRoute: (routeId: string) => void;
  removeCustomsFromRoute: (routeId: string, customsId: string) => void;
}

export default function RouteSection({
  routes,
  setRoutes,
  carsList,
  carInputFocus,
  setCarInputFocus,
  addRoute,
  removeRoute,
  addIntermediatePoint,
  removeIntermediatePoint,
  addCustomsToRoute,
  removeCustomsFromRoute
}: RouteSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Route" size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Маршруты</h3>
      </div>
      
      {routes.length > 0 && (
        <div className="space-y-4 mb-4">
          {routes.map((route, index) => (
            <RouteCard
              key={route.id}
              route={route}
              index={index}
              routes={routes}
              setRoutes={setRoutes}
              carsList={carsList}
              carInputFocus={carInputFocus}
              setCarInputFocus={setCarInputFocus}
              addIntermediatePoint={addIntermediatePoint}
              removeIntermediatePoint={removeIntermediatePoint}
              addCustomsToRoute={addCustomsToRoute}
              removeCustomsFromRoute={removeCustomsFromRoute}
              removeRoute={removeRoute}
            />
          ))}
        </div>
      )}
      
      <button
        onClick={addRoute}
        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
      >
        <Icon name="Plus" size={20} />
        Добавить маршрут
      </button>
    </div>
  );
}
