import DriverModal from './DriverModal';
import VehicleModal from './VehicleModal';
import CustomerModal from './CustomerModal';
import OrderModal from './OrderModal';
import ContractApplicationModal from './ContractApplicationModal';

interface ModalsProps {
  isDriverModalOpen: boolean;
  editingDriver?: any;
  isVehicleModalOpen: boolean;
  editingVehicle?: any;
  isCustomerModalOpen: boolean;
  editingCustomer?: any;
  isOrderModalOpen: boolean;
  isContractApplicationModalOpen?: boolean;
  editingContractApplication?: any;
  sameAddress: boolean;
  deliveryAddresses: Array<{id: number, name: string, address: string, contact: string, phone: string, isMain: boolean}>;
  bankAccounts: Array<{id: number, bankName: string, accountNumber: string, bik: string, corrAccount: string}>;
  setIsDriverModalOpen: (open: boolean) => void;
  setEditingDriver?: (driver: any) => void;
  setIsVehicleModalOpen: (open: boolean) => void;
  setEditingVehicle?: (vehicle: any) => void;
  setIsCustomerModalOpen: (open: boolean) => void;
  setEditingCustomer?: (customer: any) => void;
  setIsOrderModalOpen: (open: boolean) => void;
  setIsContractApplicationModalOpen?: (open: boolean) => void;
  setEditingContractApplication?: (doc: any) => void;
  setSameAddress: (same: boolean) => void;
  setDeliveryAddresses: (addresses: Array<{id: number, name: string, address: string, contact: string, phone: string, isMain: boolean}>) => void;
  setBankAccounts: (accounts: Array<{id: number, bankName: string, accountNumber: string, bik: string, corrAccount: string}>) => void;
  addDeliveryAddress: () => void;
  removeDeliveryAddress: (id: number) => void;
  addBankAccount: () => void;
  removeBankAccount: (id: number) => void;
  onDriverSaved?: () => void;
  onVehicleSaved?: () => void;
  onCustomerSaved?: () => void;
  onContractApplicationSaved?: () => void;
}

const Modals = ({
  isDriverModalOpen,
  editingDriver,
  isVehicleModalOpen,
  editingVehicle,
  isCustomerModalOpen,
  editingCustomer,
  isOrderModalOpen,
  isContractApplicationModalOpen,
  editingContractApplication,
  sameAddress,
  deliveryAddresses,
  bankAccounts,
  setIsDriverModalOpen,
  setEditingDriver,
  setIsVehicleModalOpen,
  setEditingVehicle,
  setIsCustomerModalOpen,
  setEditingCustomer,
  setIsOrderModalOpen,
  setIsContractApplicationModalOpen,
  setEditingContractApplication,
  setSameAddress,
  setDeliveryAddresses,
  setBankAccounts,
  addDeliveryAddress,
  removeDeliveryAddress,
  addBankAccount,
  removeBankAccount,
  onDriverSaved,
  onVehicleSaved,
  onCustomerSaved,
  onContractApplicationSaved
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
        onSaved={onCustomerSaved}
      />

      <OrderModal 
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />

      <ContractApplicationModal 
        isOpen={isContractApplicationModalOpen || false}
        document={editingContractApplication}
        onClose={() => {
          if (setIsContractApplicationModalOpen) setIsContractApplicationModalOpen(false);
          if (setEditingContractApplication) setEditingContractApplication(null);
        }}
        onSaved={onContractApplicationSaved}
      />
    </>
  );
};

export default Modals;