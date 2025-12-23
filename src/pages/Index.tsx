import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';

const menuItems = [
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
  const [activeSection, setActiveSection] = useState('templates');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  
  const isSubmenuActive = (item: any) => {
    return item.submenu?.some((sub: any) => sub.id === activeSection);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        menuItems={menuItems}
        activeSection={activeSection}
        isMobileMenuOpen={isMobileMenuOpen}
        isReferenceOpen={false}
        isDocumentsOpen={false}
        isSettingsOpen={isSettingsOpen}
        setActiveSection={setActiveSection}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setIsReferenceOpen={() => {}}
        setIsDocumentsOpen={() => {}}
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
      />
    </div>
  );
};

export default Index;
