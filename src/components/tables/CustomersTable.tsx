import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Customer {
  id: number;
  company_name: string;
  prefix: string | null;
  is_seller: boolean;
  is_buyer: boolean;
  is_carrier: boolean;
  inn: string | null;
  kpp: string | null;
  ogrn: string | null;
  legal_address: string | null;
  postal_address: string | null;
  actual_address: string | null;
  director_name: string | null;
  bank_accounts: any[];
  delivery_addresses: any[];
}

interface CustomersTableProps {
  refreshCustomers: number;
  setEditingCustomer: (customer: any) => void;
  setIsCustomerModalOpen: (open: boolean) => void;
}

const CustomersTable = ({ refreshCustomers, setEditingCustomer, setIsCustomerModalOpen }: CustomersTableProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    const response = await fetch('https://functions.poehali.dev/5bc88690-cb17-4309-bf18-4a5d04b41edf');
    const data = await response.json();
    setCustomers(data.customers || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, [refreshCustomers]);

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого контрагента?')) return;
    
    await fetch('https://functions.poehali.dev/5bc88690-cb17-4309-bf18-4a5d04b41edf', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    
    fetchCustomers();
  };

  const getRoles = (customer: Customer) => {
    const roles = [];
    if (customer.is_seller) roles.push('Продавец');
    if (customer.is_buyer) roles.push('Покупатель');
    if (customer.is_carrier) roles.push('Перевозчик');
    return roles.join(', ') || '-';
  };

  const filteredCustomers = customers.filter(c => 
    c.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.inn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.prefix?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-4">
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск контрагента..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Псевдоним</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Компания</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ИНН</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">ОГРН</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Роль</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Загрузка...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      {searchQuery ? 'Контрагенты не найдены' : 'Нет контрагентов'}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.prefix || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.company_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.inn || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.ogrn || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {getRoles(customer)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEdit(customer)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors" 
                            title="Редактировать"
                          >
                            <Icon name="Edit" size={18} className="text-gray-600" />
                          </button>
                          <button 
                            onClick={() => handleDelete(customer.id)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors" 
                            title="Удалить"
                          >
                            <Icon name="Trash2" size={18} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersTable;