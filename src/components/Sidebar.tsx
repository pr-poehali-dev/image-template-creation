import Icon from '@/components/ui/icon';

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

interface SidebarProps {
  menuItems: MenuItem[];
  activeSection: string;
  isMobileMenuOpen: boolean;
  isReferenceOpen: boolean;
  isDocumentsOpen: boolean;
  isSettingsOpen: boolean;
  setActiveSection: (section: string) => void;
  setIsMobileMenuOpen: (open: boolean) => void;
  setIsReferenceOpen: (open: boolean) => void;
  setIsDocumentsOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  isSubmenuActive: (item: MenuItem) => boolean;
}

const Sidebar = ({
  menuItems,
  activeSection,
  isMobileMenuOpen,
  isReferenceOpen,
  isDocumentsOpen,
  isSettingsOpen,
  setActiveSection,
  setIsMobileMenuOpen,
  setIsReferenceOpen,
  setIsDocumentsOpen,
  setIsSettingsOpen,
  isSubmenuActive
}: SidebarProps) => {
  return (
    <aside className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      <div className="px-4 py-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Truck" size={16} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-sidebar-foreground truncate">TransHub</h1>
            <p className="text-xs text-muted-foreground truncate">Управление грузоперевозками</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="User" size={16} className="text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Администратор</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.submenu ? (
              <div>
                <button
                  onClick={() => {
                    if (item.id === 'reference') {
                      setIsReferenceOpen(!isReferenceOpen);
                      setIsDocumentsOpen(false);
                      setIsSettingsOpen(false);
                      setActiveSection('reference');
                      setIsMobileMenuOpen(false);
                    } else if (item.id === 'documents') {
                      setIsDocumentsOpen(!isDocumentsOpen);
                      setIsReferenceOpen(false);
                      setIsSettingsOpen(false);
                      setActiveSection('documents');
                      setIsMobileMenuOpen(false);
                    } else if (item.id === 'settings') {
                      setIsSettingsOpen(!isSettingsOpen);
                      setIsReferenceOpen(false);
                      setIsDocumentsOpen(false);
                      setActiveSection('settings');
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeSection === item.id || isSubmenuActive(item) ? 'bg-sidebar-accent' : ''
                  } text-sidebar-foreground hover:bg-sidebar-accent`}
                >
                  <div className="flex items-center gap-3">
                    <Icon name={item.icon} size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <Icon name={(item.id === 'reference' && (isReferenceOpen || isSubmenuActive(item))) || (item.id === 'documents' && (isDocumentsOpen || isSubmenuActive(item))) || (item.id === 'settings' && (isSettingsOpen || isSubmenuActive(item))) ? "ChevronDown" : "ChevronRight"} size={16} />
                </button>
                {((item.id === 'reference' && (isReferenceOpen || isSubmenuActive(item))) || (item.id === 'documents' && (isDocumentsOpen || isSubmenuActive(item))) || (item.id === 'settings' && (isSettingsOpen || isSubmenuActive(item)))) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          setActiveSection(subItem.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-all ${
                          activeSection === subItem.id
                            ? 'bg-primary text-white'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent'
                        }`}
                      >
                        <Icon name={subItem.icon} size={18} />
                        <span className="font-medium text-sm">{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setActiveSection(item.id);
                  setIsReferenceOpen(false);
                  setIsDocumentsOpen(false);
                  setIsSettingsOpen(false);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  activeSection === item.id
                    ? 'bg-primary text-white'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;