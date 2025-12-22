import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';
import Modals from '@/components/Modals';

const menuItems = [
  { id: 'orders', label: 'Заказы', icon: 'ClipboardList' },
  { 
    id: 'reference', 
    label: 'Справочник', 
    icon: 'Book',
    submenu: [
      { id: 'drivers', label: 'Водители', icon: 'Users' },
      { id: 'vehicles', label: 'Автомобили', icon: 'Truck' },
      { id: 'customers', label: 'Контрагенты', icon: 'Contact' },
    ]
  },
  { 
    id: 'documents', 
    label: 'Документы', 
    icon: 'FileText',
    submenu: [
      { id: 'contract-application', label: 'Договор-Заявка', icon: 'FileSignature' },
      { id: 'ttn', label: 'ТТН', icon: 'FileCheck' },
      { id: 'upd', label: 'УПД', icon: 'FileBarChart' },
    ]
  },
  { id: 'overview', label: 'Обзор', icon: 'Activity' },
  { 
    id: 'settings', 
    label: 'Настройки', 
    icon: 'Settings',
    submenu: [
      { id: 'templates', label: 'Шаблоны', icon: 'FileSpreadsheet' },
    ]
  },
];

const Index = () => {
  const [activeSection, setActiveSection] = useState('orders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<any>(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const [deliveryAddresses, setDeliveryAddresses] = useState<Array<{id: number, name: string, address: string, contact: string, phone: string, isMain: boolean}>>([]);
  const [bankAccounts, setBankAccounts] = useState<Array<{id: number, bankName: string, accountNumber: string, bik: string, corrAccount: string}>>([]);
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [refreshDrivers, setRefreshDrivers] = useState(0);
  
  const isSubmenuActive = (item: any) => {
    return item.submenu?.some((sub: any) => sub.id === activeSection);
  };

  const addDeliveryAddress = () => {
    const newId = Math.max(...deliveryAddresses.map(a => a.id), 0) + 1;
    setDeliveryAddresses([...deliveryAddresses, { id: newId, name: '', address: '', contact: '', phone: '', isMain: false }]);
  };

  const removeDeliveryAddress = (id: number) => {
    setDeliveryAddresses(deliveryAddresses.filter(a => a.id !== id));
  };

  const addBankAccount = () => {
    const newId = Math.max(...bankAccounts.map(a => a.id), 0) + 1;
    setBankAccounts([...bankAccounts, { id: newId, bankName: '', accountNumber: '', bik: '', corrAccount: '' }]);
  };

  const removeBankAccount = (id: number) => {
    setBankAccounts(bankAccounts.filter(a => a.id !== id));
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        menuItems={menuItems}
        activeSection={activeSection}
        isMobileMenuOpen={isMobileMenuOpen}
        isReferenceOpen={isReferenceOpen}
        isDocumentsOpen={isDocumentsOpen}
        isSettingsOpen={isSettingsOpen}
        setActiveSection={setActiveSection}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setIsReferenceOpen={setIsReferenceOpen}
        setIsDocumentsOpen={setIsDocumentsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        isSubmenuActive={isSubmenuActive}
      />

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <MainContent
        menuItems={menuItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setIsDriverModalOpen={setIsDriverModalOpen}
        setEditingDriver={setEditingDriver}
        setIsVehicleModalOpen={setIsVehicleModalOpen}
        setIsCustomerModalOpen={setIsCustomerModalOpen}
        setIsOrderModalOpen={setIsOrderModalOpen}
        refreshDrivers={refreshDrivers}
      />

      <Modals
        isDriverModalOpen={isDriverModalOpen}
        editingDriver={editingDriver}
        isVehicleModalOpen={isVehicleModalOpen}
        isCustomerModalOpen={isCustomerModalOpen}
        isOrderModalOpen={isOrderModalOpen}
        sameAddress={sameAddress}
        deliveryAddresses={deliveryAddresses}
        bankAccounts={bankAccounts}
        setIsDriverModalOpen={setIsDriverModalOpen}
        setEditingDriver={setEditingDriver}
        setIsVehicleModalOpen={setIsVehicleModalOpen}
        setIsCustomerModalOpen={setIsCustomerModalOpen}
        setIsOrderModalOpen={setIsOrderModalOpen}
        setSameAddress={setSameAddress}
        setDeliveryAddresses={setDeliveryAddresses}
        setBankAccounts={setBankAccounts}
        addDeliveryAddress={addDeliveryAddress}
        removeDeliveryAddress={removeDeliveryAddress}
        addBankAccount={addBankAccount}
        removeBankAccount={removeBankAccount}
        onDriverSaved={() => setRefreshDrivers(prev => prev + 1)}
      />


    </div>
  );
};

export default Index;