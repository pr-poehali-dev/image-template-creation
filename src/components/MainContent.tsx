import Icon from '@/components/ui/icon';
import TemplatesDashboard from './TemplatesDashboard';
import SettingsDashboard from './SettingsDashboard';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  submenu?: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
}

interface MainContentProps {
  menuItems: MenuItem[];
  activeSection: string;
  setActiveSection: (section: string) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const MainContent = ({
  menuItems,
  activeSection,
  setActiveSection,
  setIsMobileMenuOpen
}: MainContentProps) => {
  return (
    <main className="flex-1 overflow-auto flex flex-col bg-white w-full">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="Menu" size={24} className="text-gray-900" />
          </button>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {menuItems.find(item => item.id === activeSection)?.label || 
             menuItems.find(item => item.submenu?.some(sub => sub.id === activeSection))?.submenu?.find(sub => sub.id === activeSection)?.label}
          </h2>
        </div>
      </header>
      <div className="flex-1 bg-white">
        {activeSection === 'settings' ? (
          <SettingsDashboard onNavigate={setActiveSection} />
        ) : activeSection === 'templates' ? (
          <TemplatesDashboard />
        ) : (
          <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Icon name="Construction" size={40} className="text-muted-foreground sm:w-12 sm:h-12" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Страница в разработке</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Раздел "{menuItems.find(item => item.id === activeSection)?.label || 
                menuItems.find(item => item.submenu?.some(sub => sub.id === activeSection))?.submenu?.find(sub => sub.id === activeSection)?.label}" скоро будет доступен</p>
            </div>
          </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default MainContent;
