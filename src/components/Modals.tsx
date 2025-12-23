import DriverModal from './DriverModal';
import VehicleModal from './VehicleModal';
import CustomerModal from './CustomerModal';
import OrderModal from './OrderModal';

interface ModalsProps {
  isDriverModalOpen: boolean;
  editingDriver?: any;
  isVehicleModalOpen: boolean;
  editingVehicle?: any;
  isCustomerModalOpen: boolean;
  editingCustomer?: any;
  isOrderModalOpen: boolean;
  setIsDriverModalOpen: (open: boolean) => void;
  setEditingDriver?: (driver: any) => void;
  setIsVehicleModalOpen: (open: boolean) => void;
  setEditingVehicle?: (vehicle: any) => void;
  setIsCustomerModalOpen: (open: boolean) => void;
  setEditingCustomer?: (customer: any) => void;
  setIsOrderModalOpen: (open: boolean) => void;
  onDriverSaved?: () => void;
  onVehicleSaved?: () => void;
  onCustomerSaved?: () => void;
}

const Modals = ({
  isDriverModalOpen,
  editingDriver,
  isVehicleModalOpen,
  editingVehicle,
  isCustomerModalOpen,
  editingCustomer,
  isOrderModalOpen,
  setIsDriverModalOpen,
  setEditingDriver,
  setIsVehicleModalOpen,
  setEditingVehicle,
  setIsCustomerModalOpen,
  setEditingCustomer,
  setIsOrderModalOpen,
  onDriverSaved,
  onVehicleSaved,
  onCustomerSaved
}: ModalsProps) => {
  return (
    <>
      <DriverModal 
        isOpen={isDriverModalOpen}
        driver={editingDriver}
        onClose={() => {
          setIsDriverModalOpen(false);
          if (setEditingDriver) setEditingDriver(null);
        }}
        onSaved={onDriverSaved}
      />

      <VehicleModal 
        isOpen={isVehicleModalOpen}
        vehicle={editingVehicle}
        onClose={() => {
          setIsVehicleModalOpen(false);
          if (setEditingVehicle) setEditingVehicle(null);
        }}
        onSaved={onVehicleSaved}
      />

      <CustomerModal 
        isOpen={isCustomerModalOpen}
        customer={editingCustomer}
        onClose={() => {
          setIsCustomerModalOpen(false);
          if (setEditingCustomer) setEditingCustomer(null);
        }}
        onSaved={onCustomerSaved}
      />

      <OrderModal 
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </>
  );
};

export default Modals;
