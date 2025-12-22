import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface CompanyInfoSectionProps {
  companyName: string;
  setCompanyName: (value: string) => void;
  prefix: string;
  setPrefix: (value: string) => void;
  inn: string;
  setInn: (value: string) => void;
  kpp: string;
  setKpp: (value: string) => void;
  ogrn: string;
  setOgrn: (value: string) => void;
  directorName: string;
  setDirectorName: (value: string) => void;
  isSeller: boolean;
  setIsSeller: (value: boolean) => void;
  isBuyer: boolean;
  setIsBuyer: (value: boolean) => void;
  isCarrier: boolean;
  setIsCarrier: (value: boolean) => void;
  legalAddress: string;
  setLegalAddress: (value: string) => void;
  postalAddress: string;
  setPostalAddress: (value: string) => void;
  actualAddress: string;
  setActualAddress: (value: string) => void;
  sameAddress: boolean;
  setSameAddress: (value: boolean) => void;
  sameActualAddress: boolean;
  setSameActualAddress: (value: boolean) => void;
}

const CompanyInfoSection = ({
  companyName,
  setCompanyName,
  prefix,
  setPrefix,
  inn,
  setInn,
  kpp,
  setKpp,
  ogrn,
  setOgrn,
  directorName,
  setDirectorName,
  isSeller,
  setIsSeller,
  isBuyer,
  setIsBuyer,
  isCarrier,
  setIsCarrier,
  legalAddress,
  setLegalAddress,
  postalAddress,
  setPostalAddress,
  actualAddress,
  setActualAddress,
  sameAddress,
  setSameAddress,
  sameActualAddress,
  setSameActualAddress
}: CompanyInfoSectionProps) => {
  const [loading, setLoading] = useState(false);

  const searchByInn = async (innValue: string) => {
    if (innValue.length < 10) return;
    
    setLoading(true);
    const response = await fetch('https://functions.poehali.dev/7a16d5d7-0e5e-41bc-b0a7-53decbe50532?resource=dadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'inn', query: innValue })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.company_name) setCompanyName(data.company_name);
      if (data.inn) setInn(data.inn);
      if (data.kpp) setKpp(data.kpp);
      if (data.ogrn) setOgrn(data.ogrn);
      if (data.legal_address) setLegalAddress(data.legal_address);
      if (data.director_name) setDirectorName(data.director_name);
    }
    setLoading(false);
  };

  const handleCompanyNameChange = async (value: string) => {
    setCompanyName(value);
    if (/^\d{10,12}$/.test(value)) {
      await searchByInn(value);
    }
  };

  const handleInnChange = async (value: string) => {
    setInn(value);
    if (value.length >= 10) {
      await searchByInn(value);
    }
  };

  return (
    <>
      <div className={isSeller ? "grid grid-cols-[1fr_120px] gap-4" : ""}>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Название компании <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={companyName}
              onChange={(e) => handleCompanyNameChange(e.target.value)}
              placeholder='ООО "Название компании" или ИНН'
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Icon name="Loader2" size={18} className="animate-spin text-primary" />
              </div>
            )}
          </div>
        </div>
        {isSeller && (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Префикс
            </label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="ABC"
              maxLength={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent uppercase text-center"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Роль <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          <label className="relative flex items-center gap-3 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-primary/50 transition-all group">
            <input
              type="checkbox"
              checked={isSeller}
              onChange={(e) => setIsSeller(e.target.checked)}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">Продавец</span>
          </label>
          <label className="relative flex items-center gap-3 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-primary/50 transition-all group">
            <input
              type="checkbox"
              checked={isBuyer}
              onChange={(e) => setIsBuyer(e.target.checked)}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">Покупатель</span>
          </label>
          <label className="relative flex items-center gap-3 cursor-pointer p-3 border-2 border-gray-200 rounded-lg hover:border-primary/50 transition-all group">
            <input
              type="checkbox"
              checked={isCarrier}
              onChange={(e) => setIsCarrier(e.target.checked)}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">Перевозчик</span>
          </label>
        </div>
      </div>

      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="FileText" size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-600">Реквизиты компании</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              ИНН
            </label>
            <div className="relative">
              <input
                type="text"
                value={inn}
                onChange={(e) => handleInnChange(e.target.value)}
                placeholder="1234567890"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Icon name="Loader2" size={18} className="animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              КПП
            </label>
            <input
              type="text"
              value={kpp}
              onChange={(e) => setKpp(e.target.value)}
              placeholder="123456789"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              ОГРН/ОГРНИП
            </label>
            <input
              type="text"
              value={ogrn}
              onChange={(e) => setOgrn(e.target.value)}
              placeholder="1234567890123"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Юридический адрес
          </label>
          <input
            type="text"
            value={legalAddress}
            onChange={(e) => setLegalAddress(e.target.value)}
            placeholder="123456, г. Москва, ул. Примерная, д. 1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-900">
              Почтовый адрес
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sameAddress}
                onChange={(e) => {
                  setSameAddress(e.target.checked);
                  if (e.target.checked) {
                    setPostalAddress(legalAddress);
                  }
                }}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
              />
              <span className="text-xs text-gray-600">Совпадает с юридическим</span>
            </label>
          </div>
          <input
            type="text"
            value={postalAddress}
            onChange={(e) => setPostalAddress(e.target.value)}
            placeholder="123456, г. Москва, ул. Примерная, д. 1"
            disabled={sameAddress}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              sameAddress ? 'bg-gray-50 text-gray-500' : ''
            }`}
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-900">
              Фактический адрес
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sameActualAddress}
                onChange={(e) => {
                  setSameActualAddress(e.target.checked);
                  if (e.target.checked) {
                    setActualAddress(legalAddress);
                  }
                }}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
              />
              <span className="text-xs text-gray-600">Совпадает с юридическим</span>
            </label>
          </div>
          <input
            type="text"
            value={actualAddress}
            onChange={(e) => setActualAddress(e.target.value)}
            placeholder="123456, г. Москва, ул. Примерная, д. 1"
            disabled={sameActualAddress}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              sameActualAddress ? 'bg-gray-50 text-gray-500' : ''
            }`}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            ФИО руководителя
          </label>
          <input
            type="text"
            value={directorName}
            onChange={(e) => setDirectorName(e.target.value)}
            placeholder="Иванов Иван Иванович"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
    </>
  );
};

export default CompanyInfoSection;