import { useState } from 'react';
import Icon from '@/components/ui/icon';
import ConfirmDialog from './ConfirmDialog';
import ModalFooter from './ModalFooter';
import CompanyInfoSection from './customer/CompanyInfoSection';
import BankAccountsSection from './customer/BankAccountsSection';
import DeliveryAddressesSection from './customer/DeliveryAddressesSection';

interface CustomerModalProps {
  isOpen: boolean;
  customer?: any;
  onClose: () => void;
  sameAddress: boolean;
  setSameAddress: (same: boolean) => void;
  deliveryAddresses: Array<{id: number, name: string, address: string, contact: string, phone: string, isMain: boolean}>;
  setDeliveryAddresses: (addresses: Array<{id: number, name: string, address: string, contact: string, phone: string, isMain: boolean}>) => void;
  bankAccounts: Array<{id: number, bankName: string, accountNumber: string, bik: string, corrAccount: string}>;
  setBankAccounts: (accounts: Array<{id: number, bankName: string, accountNumber: string, bik: string, corrAccount: string}>) => void;
  addDeliveryAddress: () => void;
  removeDeliveryAddress: (id: number) => void;
  addBankAccount: () => void;
  removeBankAccount: (id: number) => void;
  onSaved?: () => void;
}

const CustomerModal = ({
  isOpen,
  customer,
  onClose,
  sameAddress,
  setSameAddress,
  deliveryAddresses,
  setDeliveryAddresses,
  bankAccounts,
  setBankAccounts,
  addDeliveryAddress,
  removeDeliveryAddress,
  addBankAccount,
  removeBankAccount,
  onSaved
}: CustomerModalProps) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isSeller, setIsSeller] = useState(customer?.is_seller || false);
  const [isBuyer, setIsBuyer] = useState(customer?.is_buyer || false);
  const [isCarrier, setIsCarrier] = useState(customer?.is_carrier || false);
  const [companyName, setCompanyName] = useState(customer?.company_name || '');
  const [prefix, setPrefix] = useState(customer?.prefix || '');
  const [inn, setInn] = useState(customer?.inn || '');
  const [kpp, setKpp] = useState(customer?.kpp || '');
  const [ogrn, setOgrn] = useState(customer?.ogrn || '');
  const [directorName, setDirectorName] = useState(customer?.director_name || '');
  const [legalAddress, setLegalAddress] = useState(customer?.legal_address || '');
  const [postalAddress, setPostalAddress] = useState(customer?.postal_address || '');
  const [actualAddress, setActualAddress] = useState(customer?.actual_address || '');
  const [sameActualAddress, setSameActualAddress] = useState(false);
  const [addressContacts, setAddressContacts] = useState<{[key: number]: Array<{id: number}>}>({});

  const addContactToAddress = (addressId: number) => {
    const currentContacts = addressContacts[addressId] || [];
    const newId = currentContacts.length > 0 ? Math.max(...currentContacts.map(c => c.id)) + 1 : 1;
    setAddressContacts({
      ...addressContacts,
      [addressId]: [...currentContacts, { id: newId }]
    });
  };

  const removeContactFromAddress = (addressId: number, contactId: number) => {
    setAddressContacts({
      ...addressContacts,
      [addressId]: (addressContacts[addressId] || []).filter(c => c.id !== contactId)
    });
  };

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    onClose();
    setSameAddress(false);
    setDeliveryAddresses([]);
    setBankAccounts([]);
  };

  const handleSave = async () => {
    const bankAccountsData = bankAccounts.map(ba => ({
      bank_name: ba.bankName || '',
      account_number: ba.accountNumber || '',
      bik: ba.bik || '',
      corr_account: ba.corrAccount || ''
    }));

    const deliveryAddressesData = deliveryAddresses.map(da => {
      const contacts = [{ contact_name: da.contact || '', phone: da.phone || '' }];
      const additionalContacts = (addressContacts[da.id] || []).map(() => ({
        contact_name: '',
        phone: ''
      }));
      
      return {
        name: da.name || '',
        address: da.address || '',
        is_main: da.isMain || false,
        contacts: [...contacts, ...additionalContacts]
      };
    });

    const customerData = {
      ...(customer?.id && { id: customer.id }),
      company_name: companyName,
      prefix: isSeller ? prefix : null,
      is_seller: isSeller,
      is_buyer: isBuyer,
      is_carrier: isCarrier,
      inn: inn,
      kpp: kpp,
      ogrn: ogrn,
      legal_address: legalAddress,
      postal_address: postalAddress,
      actual_address: actualAddress,
      director_name: directorName,
      bank_accounts: bankAccountsData,
      delivery_addresses: deliveryAddressesData
    };

    await fetch('https://functions.poehali.dev/5bc88690-cb17-4309-bf18-4a5d04b41edf', {
      method: customer?.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });

    onClose();
    setSameAddress(false);
    setDeliveryAddresses([]);
    setBankAccounts([]);
    if (onSaved) onSaved();
  };

  const handleClose = () => {
    onClose();
    setSameAddress(false);
    setDeliveryAddresses([]);
    setBankAccounts([]);
  };

  if (!isOpen) return null;

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
      
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-xl font-bold text-gray-900">{customer ? 'Редактировать' : 'Создать'}</h3>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <Icon name="X" size={20} className="text-gray-600" />
          </button>
        </div>
        
        <div className="p-6 relative">
          <div className="space-y-4">
            <CompanyInfoSection
              companyName={companyName}
              setCompanyName={setCompanyName}
              prefix={prefix}
              setPrefix={setPrefix}
              inn={inn}
              setInn={setInn}
              kpp={kpp}
              setKpp={setKpp}
              ogrn={ogrn}
              setOgrn={setOgrn}
              directorName={directorName}
              setDirectorName={setDirectorName}
              isSeller={isSeller}
              setIsSeller={setIsSeller}
              isBuyer={isBuyer}
              setIsBuyer={setIsBuyer}
              isCarrier={isCarrier}
              setIsCarrier={setIsCarrier}
              legalAddress={legalAddress}
              setLegalAddress={setLegalAddress}
              postalAddress={postalAddress}
              setPostalAddress={setPostalAddress}
              actualAddress={actualAddress}
              setActualAddress={setActualAddress}
              sameAddress={sameAddress}
              setSameAddress={setSameAddress}
              sameActualAddress={sameActualAddress}
              setSameActualAddress={setSameActualAddress}
            />

            <BankAccountsSection
              bankAccounts={bankAccounts}
              addBankAccount={addBankAccount}
              removeBankAccount={removeBankAccount}
            />

            {isBuyer && (
              <DeliveryAddressesSection
                deliveryAddresses={deliveryAddresses}
                addDeliveryAddress={addDeliveryAddress}
                removeDeliveryAddress={removeDeliveryAddress}
                addressContacts={addressContacts}
                addContactToAddress={addContactToAddress}
                removeContactFromAddress={removeContactFromAddress}
              />
            )}
          </div>

          <ModalFooter onCancel={handleCancel} onSave={handleSave} />
        </div>
        </div>
      </div>
    </>
  );
};

export default CustomerModal;