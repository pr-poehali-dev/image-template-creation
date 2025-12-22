interface ContractApplicationHeaderSectionProps {
  formData: {
    number: string;
    date: string;
    customerId: string;
  };
  setFormData: (data: any) => void;
  searchCustomer: string;
  setSearchCustomer: (value: string) => void;
  showCustomerDropdown: boolean;
  setShowCustomerDropdown: (show: boolean) => void;
  customers: Array<{id: number, company_name: string, prefix: string, is_seller: boolean}>;
}

const ContractApplicationHeaderSection = ({
  formData,
  setFormData,
  searchCustomer,
  setSearchCustomer,
  showCustomerDropdown,
  setShowCustomerDropdown,
  customers
}: ContractApplicationHeaderSectionProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Договор-заявка № <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.number}
            readOnly
            placeholder="Выберите контрагента"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Дата заявки <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Контрагент (Продавец) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={searchCustomer}
          onChange={(e) => {
            setSearchCustomer(e.target.value);
            setShowCustomerDropdown(true);
          }}
          onFocus={() => setShowCustomerDropdown(true)}
          onBlur={() => setTimeout(() => setShowCustomerDropdown(false), 200)}
          placeholder="Введите название или выберите из списка"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        
        {showCustomerDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {customers
              .filter(c => c.is_seller && c.company_name.toLowerCase().includes(searchCustomer.toLowerCase()))
              .map(customer => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => {
                    setSearchCustomer(customer.company_name);
                    setFormData({...formData, customerId: customer.id.toString()});
                    setShowCustomerDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-primary/5 transition-colors text-sm text-gray-900"
                >
                  {customer.company_name}
                </button>
              ))}
            
            {customers.filter(c => c.is_seller && c.company_name.toLowerCase().includes(searchCustomer.toLowerCase())).length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                Нет подходящих продавцов
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ContractApplicationHeaderSection;
