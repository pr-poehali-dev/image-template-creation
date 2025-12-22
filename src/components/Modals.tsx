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
  isOrderModalOpen: boolean;
  sameAddress: boolean;
  deliveryAddresses: Array<{id: number, name: string, address: string, contact: string, phone: string, isMain: boolean}>;
  bankAccounts: Array<{id: number, bankName: string, accountNumber: string, bik: string, corrAccount: string}>;
  setIsDriverModalOpen: (open: boolean) => void;
  setEditingDriver?: (driver: any) => void;
  setIsVehicleModalOpen: (open: boolean) => void;
  setEditingVehicle?: (vehicle: any) => void;
  setIsCustomerModalOpen: (open: boolean) => void;
  setIsOrderModalOpen: (open: boolean) => void;
  setSameAddress: (same: boolean) => void;
  setDeliveryAddresses: (addresses: Array<{id: number, name: string, address: string, contact: string, phone: string, isMain: boolean}>) => void;
  setBankAccounts: (accounts: Array<{id: number, bankName: string, accountNumber: string, bik: string, corrAccount: string}>) => void;
  addDeliveryAddress: () => void;
  removeDeliveryAddress: (id: number) => void;
  addBankAccount: () => void;
  removeBankAccount: (id: number) => void;
  onDriverSaved?: () => void;
  onVehicleSaved?: () => void;
}

const Modals = ({
  isDriverModalOpen,
  editingDriver,
  isVehicleModalOpen,
  editingVehicle,
  isCustomerModalOpen,
  isOrderModalOpen,
  sameAddress,
  deliveryAddresses,
  bankAccounts,
  setIsDriverModalOpen,
  setEditingDriver,
  setIsVehicleModalOpen,
  setEditingVehicle,
  setIsCustomerModalOpen,
  setIsOrderModalOpen,
  setSameAddress,
  setDeliveryAddresses,
  setBankAccounts,
  addDeliveryAddress,
  removeDeliveryAddress,
  addBankAccount,
  removeBankAccount,
  onDriverSaved,
  onVehicleSaved
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
        onClose={() => setIsCustomerModalOpen(false)}
        sameAddress={sameAddress}
        setSameAddress={setSameAddress}
        deliveryAddresses={deliveryAddresses}
        setDeliveryAddresses={setDeliveryAddresses}
        bankAccounts={bankAccounts}
        setBankAccounts={setBankAccounts}
        addDeliveryAddress={addDeliveryAddress}
        removeDeliveryAddress={removeDeliveryAddress}
        addBankAccount={addBankAccount}
        removeBankAccount={removeBankAccount}
      />

      <OrderModal 
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </>
  );
};

export default Modals;