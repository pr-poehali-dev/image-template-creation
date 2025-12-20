import Icon from './ui/icon';
import RouteCard, { Route } from './RouteCard';

interface RoutesSectionProps {
  routes: Route[];
  setRoutes: (routes: Route[]) => void;
  addRoute: () => void;
  removeRoute: (id: string) => void;
  addIntermediatePoint: (routeId: string) => void;
  removeIntermediatePoint: (routeId: string, pointId: string) => void;
  addCustomsToRoute: (routeId: string) => void;
  removeCustomsFromRoute: (routeId: string, customsId: string) => void;
  carsList: string[];
  carInputFocus: {[key: string]: boolean};
  setCarInputFocus: (focus: {[key: string]: boolean}) => void;
}

export default function RoutesSection({
  routes,
  setRoutes,
  addRoute,
  removeRoute,
  addIntermediatePoint,
  removeIntermediatePoint,
  addCustomsToRoute,
  removeCustomsFromRoute,
  carsList,
  carInputFocus,
  setCarInputFocus
}: RoutesSectionProps) {
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
              removeRoute={removeRoute}
              addIntermediatePoint={addIntermediatePoint}
              removeIntermediatePoint={removeIntermediatePoint}
              addCustomsToRoute={addCustomsToRoute}
              removeCustomsFromRoute={removeCustomsFromRoute}
              carsList={carsList}
              carInputFocus={carInputFocus}
              setCarInputFocus={setCarInputFocus}
            />
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
  );
}
