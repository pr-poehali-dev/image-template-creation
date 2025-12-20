import DriverModal from './DriverModal';
import VehicleModal from './VehicleModal';
import CustomerModal from './CustomerModal';

interface ModalsProps {
  isDriverModalOpen: boolean;
  isVehicleModalOpen: boolean;
  isCustomerModalOpen: boolean;
  sameAddress: boolean;
  deliveryAddresses: Array<{id: number, name: string, address: string, contact: string, phone: string, isMain: boolean}>;
  bankAccounts: Array<{id: number, bankName: string, accountNumber: string, bik: string, corrAccount: string}>;
  setIsDriverModalOpen: (open: boolean) => void;
  setIsVehicleModalOpen: (open: boolean) => void;
  setIsCustomerModalOpen: (open: boolean) => void;
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
  isVehicleModalOpen,
  isCustomerModalOpen,
  sameAddress,
  deliveryAddresses,
  bankAccounts,
  setIsDriverModalOpen,
  setIsVehicleModalOpen,
  setIsCustomerModalOpen,
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
        onClose={() => setIsDriverModalOpen(false)}
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
    </>
  );
};

export default Modals;
