import { useState } from 'react';
import Icon from './ui/icon';
import ConfirmDialog from './ConfirmDialog';
import ModalFooter from './ModalFooter';
import OrderCharacteristics from './order/OrderCharacteristics';
import RouteSection from './order/RouteSection';

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
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    onClose();
  };

  const handleSave = () => {
    console.log('Сохранение заказа');
    onClose();
  };

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
            <OrderCharacteristics
              orderZone={orderZone}
              setOrderZone={setOrderZone}
              orderNumber={orderNumber}
              setOrderNumber={setOrderNumber}
              orderDate={orderDate}
              setOrderDate={setOrderDate}
              invoice={invoice}
              setInvoice={setInvoice}
              track={track}
              setTrack={setTrack}
              cargoType={cargoType}
              setCargoType={setCargoType}
              cargoWeight={cargoWeight}
              setCargoWeight={setCargoWeight}
              note={note}
              setNote={setNote}
              files={files}
              handleFileChange={handleFileChange}
            />

            <RouteSection
              routes={routes}
              setRoutes={setRoutes}
              carsList={carsList}
              carInputFocus={carInputFocus}
              setCarInputFocus={setCarInputFocus}
              addRoute={addRoute}
              removeRoute={removeRoute}
              addIntermediatePoint={addIntermediatePoint}
              removeIntermediatePoint={removeIntermediatePoint}
              addCustomsToRoute={addCustomsToRoute}
              removeCustomsFromRoute={removeCustomsFromRoute}
            />
          </div>
        </div>

        <ModalFooter
          onCancel={handleCancel}
          onSave={handleSave}
          saveText="Сохранить заказ"
        />
        </div>
      </div>
    </>
  );
};

export default OrderModal;
