import DriverModal from './DriverModal';
import VehicleModal from './VehicleModal';
import CustomerModal from './CustomerModal';
import OrderModal from './OrderModal';

interface ModalsProps {
  isDriverModalOpen: boolean;
  editingDriver?: any;
  isVehicleModalOpen: boolean;
  isCustomerModalOpen: boolean;
  isOrderModalOpen: boolean;
  sameAddress: boolean;
  deliveryAddresses: Array<{id: number, name: string, address: string, contact: string, phone: string, isMain: boolean}>;
  bankAccounts: Array<{id: number, bankName: string, accountNumber: string, bik: string, corrAccount: string}>;
  setIsDriverModalOpen: (open: boolean) => void;
  setEditingDriver?: (driver: any) => void;
  setIsVehicleModalOpen: (open: boolean) => void;
  setIsCustomerModalOpen: (open: boolean) => void;
  setIsOrderModalOpen: (open: boolean) => void;
  setSameAddress: (same: boolean) => void;
  setDeliveryAddresses: (addresses: Array<{id: number, name: string, address: string, contact: string, phone: string, isMain: boolean}>) => void;
  setBankAccounts: (accounts: Array<{id: number, bankName: string, accountNumber: string, bik: string, corrAccount: string}>) => void;
  addDeliveryAddress: () => void;
  removeDeliveryAddress: (id: number) => void;
  addBankAccount: () => void;
  removeBankAccount: (id: number) => void;
}

const Modals = ({
  isDriverModalOpen,
  editingDriver,
  isVehicleModalOpen,
  isCustomerModalOpen,
  isOrderModalOpen,
  sameAddress,
  deliveryAddresses,
  bankAccounts,
  setIsDriverModalOpen,
  setEditingDriver,
  setIsVehicleModalOpen,
  setIsCustomerModalOpen,
  setIsOrderModalOpen,
  setSameAddress,
  setDeliveryAddresses,
  setBankAccounts,
  addDeliveryAddress,
  removeDeliveryAddress,
  addBankAccount,
  removeBankAccount
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
      />

      <VehicleModal 
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
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