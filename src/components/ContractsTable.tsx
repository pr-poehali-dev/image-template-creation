import { useState, useRef } from 'react';
import Icon from './ui/icon';
import ContractDocument from './ContractDocument';

interface Contract {
  id: string;
  number: string;
  date: string;
  customer: string;
  route: string;
  amount: string;
  status: 'active' | 'completed' | 'draft';
}

interface ContractsTableProps {
  onBack: () => void;
}

export default function ContractsTable({ onBack }: ContractsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  const contracts: Contract[] = [
    {
      id: '1',
      number: 'EU-2024-001',
      date: '15-12-2024',
      customer: 'ООО "Логистика Плюс"',
      route: 'Москва → Берлин',
      amount: '450 000 ₽',
      status: 'active',
    },
    {
      id: '2',
      number: 'EU-2024-002',
      date: '18-12-2024',
      customer: 'ИП Сидоров А.В.',
      route: 'Минск → Варшава',
      amount: '280 000 ₽',
      status: 'active',
    },
    {
      id: '3',
      number: 'RU-2024-015',
      date: '10-12-2024',
      customer: 'ООО "ТрансЕвразия"',
      route: 'Москва → Новосибирск',
      amount: '620 000 ₽',
      status: 'completed',
    },
    {
      id: '4',
      number: 'EU-2024-003',
      date: '20-12-2024',
      customer: 'ООО "ГлобалКарго"',
      route: 'Санкт-Петербург → Рига',
      amount: '195 000 ₽',
      status: 'draft',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700',
      draft: 'bg-yellow-100 text-yellow-700',
    };
    const labels = {
      active: 'Активный',
      completed: 'Завершён',
      draft: 'Черновик',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const filteredContracts = contracts.filter(contract => 
    contract.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.route.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadPDF = (contract: Contract) => {
    const contractData = {
      number: contract.number,
      date: contract.date,
      customer: contract.customer,
      carrier: 'СЕМИОНОВ ИГОРЬ ГЕННАДЬЕВИЧ',
      vehicleType: 'тип кузова',
      vehicleBody: 'рефрижератор',
      tons: '20',
      cubicMeters: '82',
      specialConditions: 't режим',
      additionalConditions: '+ 2 град',
      cargoDescription: 'Лук, Нобилис',
      loadingAddress: 'Московская область, городской округ Люберцы, деревня Островцы, ул. Школьная 27',
      loadingDate: '20.12.25',
      loadingContact: 'Константин зав складом 89104355433, Артем 89035532883',
      unloadingAddress: 'г. Ижевск, Завьяловский район, д. Шабердино',
      unloadingDate: '22.12.25',
      unloadingContact: 'Денис 89120120277',
      price: contract.amount.replace(' ₽', ''),
      paymentTerms: 'без НДС',
      paymentMethod: '5-7 б/д',
      driverName: 'Шильков Алексей Леонидович',
      driverLicense: 'ВУ 9940 381012 89120266424',
      driverPassport: '9421 № 975426 выдан 03.02.2022г, МВД по Удмуртской Республике код подразделения 180-010',
      vehicleNumber: 'Вольво H777AP/18',
      vehicleTrailer: 'прицеп АО0714/18',
    };

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Договор-заявка ${contractData.number}</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            td { border: 1px solid black; padding: 4px 8px; }
            .bg-gray { background-color: #f3f4f6; }
            .font-bold { font-weight: bold; }
            .text-red { color: #dc2626; }
            .text-center { text-align: center; }
            .text-xs { font-size: 10px; }
            .mb-2 { margin-bottom: 8px; }
            .mb-3 { margin-bottom: 12px; }
            .mb-4 { margin-bottom: 16px; }
            .mt-4 { margin-top: 16px; }
            .mt-8 { margin-top: 32px; }
            .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
            .space-y-1 > * + * { margin-top: 4px; }
            .border-bottom { border-bottom: 1px solid black; margin-bottom: 4px; }
          </style>
        </head>
        <body>
          <div style="margin-bottom: 16px; display: flex; justify-content: space-between;">
            <div><span class="font-bold">Договор-заявка №</span> <span class="text-red font-bold">${contractData.number}</span></div>
            <div><span class="font-bold">от</span> <span class="text-red font-bold">${contractData.date}</span></div>
          </div>

          <div style="text-align: center; font-weight: bold; margin-bottom: 12px;">на перевозку грузов автомобильным транспортом</div>

          <table>
            <tr>
              <td class="bg-gray font-bold" style="width: 25%;">Заказчик:</td>
              <td class="text-red" style="width: 25%;">${contractData.customer}</td>
              <td class="bg-gray font-bold" style="width: 25%;">Перевозчик:</td>
              <td class="text-red" style="width: 25%;">${contractData.carrier}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td class="bg-gray font-bold" style="width: 20%;">Требуемый тип ТС:</td>
              <td style="width: 15%;">${contractData.vehicleType}</td>
              <td class="text-red" style="width: 20%;">${contractData.vehicleBody}</td>
              <td class="text-red text-center" style="width: 10%;">${contractData.tons}</td>
              <td class="text-center" style="width: 5%;">т.</td>
              <td class="text-red text-center" style="width: 10%;">${contractData.cubicMeters}</td>
              <td class="text-center" style="width: 5%;">м3</td>
            </tr>
            <tr>
              <td class="bg-gray font-bold">Особые условия:</td>
              <td>${contractData.specialConditions}</td>
              <td class="text-red" colspan="2">${contractData.additionalConditions}</td>
              <td colspan="3">доп. условия</td>
            </tr>
            <tr>
              <td class="bg-gray font-bold">Груз:</td>
              <td class="text-red" colspan="6">${contractData.cargoDescription}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td class="bg-gray font-bold" style="width: 16%;">Погрузка:</td>
              <td class="text-red" colspan="5">${contractData.loadingAddress}</td>
            </tr>
            <tr>
              <td>дата</td>
              <td class="text-red" style="width: 16%;">${contractData.loadingDate}</td>
              <td style="width: 16%;">с</td>
              <td style="width: 16%;"></td>
              <td style="width: 16%;">до</td>
              <td style="width: 16%;"></td>
            </tr>
            <tr>
              <td colspan="2"></td>
              <td class="bg-gray" colspan="2">контактное лицо</td>
              <td class="text-red" colspan="2">${contractData.loadingContact}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td class="bg-gray font-bold" style="width: 16%;">Разгрузка:</td>
              <td class="text-red" colspan="5">${contractData.unloadingAddress}</td>
            </tr>
            <tr>
              <td>дата</td>
              <td class="text-red" style="width: 16%;">${contractData.unloadingDate}</td>
              <td style="width: 16%;">с</td>
              <td style="width: 16%;"></td>
              <td style="width: 16%;">до</td>
              <td style="width: 16%;"></td>
            </tr>
            <tr>
              <td colspan="2"></td>
              <td class="bg-gray" colspan="2">контактное лицо</td>
              <td class="text-red" colspan="2">${contractData.unloadingContact}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td class="bg-gray font-bold" style="width: 16%;">Оплата:</td>
              <td class="text-red" style="width: 16%;">${contractData.price}</td>
              <td style="width: 16%;">руб.</td>
              <td class="text-red" style="width: 16%;">${contractData.paymentTerms}</td>
              <td class="text-red" style="width: 16%;">${contractData.paymentMethod}</td>
              <td style="width: 20%;">по оригиналам документов</td>
            </tr>
          </table>

          <table>
            <tr>
              <td class="bg-gray font-bold" colspan="6">Данные водителя:</td>
            </tr>
            <tr>
              <td class="text-red" colspan="3">${contractData.driverName}</td>
              <td class="text-red" colspan="3">${contractData.driverLicense}</td>
            </tr>
            <tr>
              <td>паспорт</td>
              <td class="text-red" colspan="5">${contractData.driverPassport}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td class="bg-gray font-bold">Данные ТС:</td>
              <td class="text-red">${contractData.vehicleNumber} ${contractData.vehicleTrailer}</td>
            </tr>
          </table>

          <div class="mt-4 mb-3">
            <div class="font-bold mb-2">Условия перевозки:</div>
            <div class="text-xs space-y-1">
              <p>Перевозчик обязан в лице водителя-экспедитора обязан проверить правильность оформления ТоН/ТТН на погрузке.</p>
              <p>В случае опозданий на погрузку/разгрузку Перевозчик обязан своевременно сообщить об этом Заказчику.</p>
            </div>
          </div>

          <div class="mt-4 mb-3">
            <div class="font-bold mb-2">Штрафные санкции и ответственность:</div>
            <div class="text-xs space-y-1">
              <p>Срыв погрузки/разгрузки одной из сторон влечёт за собой штраф в размере 20% от стоимости перевозки с виновной стороны.</p>
              <p>За опоздание на погрузку Перевозчик оплачивает штраф в размере 500 руб. за каждый час опоздания.</p>
            </div>
          </div>

          <div class="grid-2 mt-8">
            <div>
              <p class="font-bold mb-2">Заказчик:</p>
              <p class="text-xs mb-2">ООО «ФЛАУЭР МАСТЕР»</p>
              <div class="border-bottom" style="height: 40px;"></div>
              <p class="text-center text-xs">МП</p>
            </div>
            <div>
              <p class="font-bold mb-2">Перевозчик:</p>
              <p class="text-xs mb-2 text-red">${contractData.carrier}</p>
              <div class="border-bottom" style="height: 40px;"></div>
              <p class="text-center text-xs">МП</p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск договора..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Номер</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Дата</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Заказчик</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Маршрут</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Сумма</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Статус</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{contract.number}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{contract.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{contract.customer}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{contract.route}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">{contract.amount}</td>
                    <td className="px-4 py-3">
                      {getStatusBadge(contract.status)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Просмотр"
                        >
                          <Icon name="Eye" size={18} className="text-gray-600" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Редактировать"
                        >
                          <Icon name="Edit" size={18} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(contract)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Скачать PDF"
                        >
                          <Icon name="FileText" size={18} className="text-gray-600" />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Удалить"
                        >
                          <Icon name="Trash2" size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div ref={printRef} className="hidden">
        <ContractDocument data={{
          number: '',
          date: '',
          customer: '',
          carrier: '',
          vehicleType: '',
          vehicleBody: '',
          tons: '',
          cubicMeters: '',
          specialConditions: '',
          additionalConditions: '',
          cargoDescription: '',
          loadingAddress: '',
          loadingDate: '',
          loadingContact: '',
          unloadingAddress: '',
          unloadingDate: '',
          unloadingContact: '',
          price: '',
          paymentTerms: '',
          paymentMethod: '',
          driverName: '',
          driverLicense: '',
          driverPassport: '',
          vehicleNumber: '',
          vehicleTrailer: '',
        }} />
      </div>
    </div>
  );
}
