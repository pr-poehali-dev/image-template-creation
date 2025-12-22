import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface BankAccountsSectionProps {
  bankAccounts: Array<{id: number, bankName: string, accountNumber: string, bik: string, corrAccount: string}>;
  addBankAccount: () => void;
  removeBankAccount: (id: number) => void;
}

const BankAccountsSection = ({
  bankAccounts,
  addBankAccount,
  removeBankAccount
}: BankAccountsSectionProps) => {
  const [loadingBik, setLoadingBik] = useState<{[key: number]: boolean}>({});

  const handleBikChange = async (accountId: number, bikValue: string, index: number) => {
    bankAccounts[index].bik = bikValue;

    if (bikValue.length === 9) {
      setLoadingBik({...loadingBik, [accountId]: true});
      
      const response = await fetch('https://functions.poehali.dev/7a16d5d7-0e5e-41bc-b0a7-53decbe50532?resource=dadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bik', query: bikValue })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.bank_name) bankAccounts[index].bankName = data.bank_name;
        if (data.corr_account) bankAccounts[index].corrAccount = data.corr_account;
      }
      
      setLoadingBik({...loadingBik, [accountId]: false});
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Landmark" size={18} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-600">Банковские реквизиты</span>
      </div>

      {bankAccounts.length > 0 && bankAccounts.map((account, index) => (
        <div key={account.id} className="border border-gray-200 rounded-lg p-4 mb-4 relative">
          <button
            onClick={() => removeBankAccount(account.id)}
            className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded transition-colors"
            title="Удалить счет"
          >
            <Icon name="X" size={16} className="text-gray-500" />
          </button>

          <div className="mb-3">
            <span className="text-xs text-gray-500">Счет {index + 1}</span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Наименование банка
            </label>
            <input
              type="text"
              value={account.bankName}
              onChange={(e) => {
                bankAccounts[index].bankName = e.target.value;
              }}
              placeholder="ПАО Сбербанк"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Расчетный счет
            </label>
            <input
              type="text"
              value={account.accountNumber}
              onChange={(e) => {
                bankAccounts[index].accountNumber = e.target.value;
              }}
              placeholder="40702810000000000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                БИК
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={account.bik}
                  onChange={(e) => handleBikChange(account.id, e.target.value, index)}
                  placeholder="044525225"
                  maxLength={9}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {loadingBik[account.id] && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Icon name="Loader2" size={18} className="animate-spin text-primary" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Корр. счет
              </label>
              <input
                type="text"
                value={account.corrAccount}
                onChange={(e) => {
                  bankAccounts[index].corrAccount = e.target.value;
                }}
                placeholder="30101810000000000225"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addBankAccount}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-primary hover:border-primary hover:bg-primary/5 flex items-center justify-center gap-2 font-medium transition-colors"
      >
        <Icon name="Plus" size={20} />
        Добавить счет
      </button>
    </div>
  );
};

export default BankAccountsSection;
