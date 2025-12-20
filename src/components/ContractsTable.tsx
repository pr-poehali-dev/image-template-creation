import { useState } from 'react';
import Icon from './ui/icon';

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
      customer: 'ООО «ФЛАУЭР МАСТЕР»',
      customerDetails: 'ИНН 7723449594 КПП 772201001',
      carrier: 'ИП СЕМИОНОВ ИГОРЬ ГЕННАДЬЕВИЧ',
      carrierDetails: 'ОГРНИП 317619600018, ИНН 560993629160',
      vehicleType: 'тип кузова',
      vehicleBody: 'рефрижератор',
      tons: '20',
      cubicMeters: '82',
      specialConditions: 't режим',
      additionalConditions: '+ 2 град',
      cargoDescription: 'Лук, Нобилис',
      loadingAddress: 'Московская область, городской округ Люберцы, деревня Островцы, ул. Школьная 27',
      loadingDate: '20.12.25',
      loadingTimeFrom: '',
      loadingTimeTo: '',
      loadingContact: 'Константин зав складом 89104355433, Артем 89035532883',
      unloadingAddress: 'г. Ижевск, Завьяловский район, д. Шабердино',
      unloadingDate: '22.12.25',
      unloadingTimeFrom: '',
      unloadingTimeTo: '',
      unloadingContact: 'Денис 89120120277',
      price: '150 000',
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
            @page { size: A4; margin: 10mm; }
            body { 
              font-family: Arial, sans-serif; 
              font-size: 11px; 
              line-height: 1.3; 
              padding: 0;
              margin: 0;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 6px;
              font-size: 11px;
            }
            td { 
              border: 1px solid black; 
              padding: 3px 6px;
              vertical-align: top;
            }
            .bg-gray { background-color: #e5e7eb; }
            .font-bold { font-weight: bold; }
            .text-red { color: #dc2626; }
            .text-center { text-align: center; }
            .text-xs { font-size: 9px; line-height: 1.3; }
            .text-tiny { font-size: 8px; line-height: 1.2; }
            .mb-1 { margin-bottom: 4px; }
            .mb-2 { margin-bottom: 6px; }
            .mb-3 { margin-bottom: 8px; }
            .mb-4 { margin-bottom: 12px; }
            .mt-4 { margin-top: 12px; }
            .grid-2 { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 24px;
              margin-top: 16px;
            }
            p { margin: 0 0 4px 0; }
            .signature-line {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid black;
              padding-top: 32px;
              margin-bottom: 2px;
            }
          </style>
        </head>
        <body>
          <!-- Header -->
          <div style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: start;">
            <div><span class="font-bold">Договор-заявка №</span> <span class="text-red font-bold">${contractData.number}</span></div>
            <div style="text-align: right;"><span class="font-bold">от</span> <span class="text-red font-bold">${contractData.date}</span></div>
          </div>

          <!-- Title -->
          <div style="text-align: center; font-weight: bold; margin-bottom: 6px;">на перевозку грузов автомобильным транспортом</div>

          <!-- Customer and Carrier -->
          <table>
            <tr>
              <td class="bg-gray font-bold" style="width: 15%;">Заказчик:</td>
              <td class="text-red" style="width: 35%;">${contractData.customer}</td>
              <td class="bg-gray font-bold" style="width: 15%;">Перевозчик:</td>
              <td class="text-red" style="width: 35%;">${contractData.carrier}</td>
            </tr>
          </table>

          <!-- Vehicle Type -->
          <table>
            <tr>
              <td class="bg-gray font-bold" style="width: 18%;">Требуемый тип ТС:</td>
              <td style="width: 15%;">тип кузова</td>
              <td class="text-red" style="width: 20%;">${contractData.vehicleBody}</td>
              <td class="text-red text-center" style="width: 8%;">${contractData.tons}</td>
              <td class="text-center" style="width: 5%;">т.</td>
              <td class="text-red text-center" style="width: 8%;">${contractData.cubicMeters}</td>
              <td class="text-center" style="width: 6%;">м3</td>
            </tr>
            <tr>
              <td class="bg-gray font-bold">Особые условия:</td>
              <td>${contractData.specialConditions}</td>
              <td class="text-red" colspan="2">${contractData.additionalConditions}</td>
              <td colspan="3">водителю быть на связи</td>
            </tr>
            <tr>
              <td class="bg-gray font-bold">Груз:</td>
              <td class="text-red" colspan="6">${contractData.cargoDescription}</td>
            </tr>
          </table>

          <!-- Loading -->
          <table>
            <tr>
              <td class="bg-gray font-bold" style="width: 10%;">Погрузка:</td>
              <td class="text-red" colspan="5">${contractData.loadingAddress}</td>
            </tr>
            <tr>
              <td>дата</td>
              <td class="text-red" style="width: 18%;">${contractData.loadingDate}</td>
              <td style="width: 5%;">с</td>
              <td style="width: 18%;">${contractData.loadingTimeFrom}</td>
              <td style="width: 5%;">до</td>
              <td style="width: 18%;">${contractData.loadingTimeTo}</td>
            </tr>
            <tr>
              <td colspan="2"></td>
              <td class="bg-gray" colspan="2">контактное лицо</td>
              <td class="text-red" colspan="2">${contractData.loadingContact}</td>
            </tr>
          </table>

          <!-- Unloading -->
          <table>
            <tr>
              <td class="bg-gray font-bold" style="width: 10%;">Разгрузка:</td>
              <td class="text-red" colspan="5">${contractData.unloadingAddress}</td>
            </tr>
            <tr>
              <td>дата</td>
              <td class="text-red" style="width: 18%;">${contractData.unloadingDate}</td>
              <td style="width: 5%;">с</td>
              <td style="width: 18%;">${contractData.unloadingTimeFrom}</td>
              <td style="width: 5%;">до</td>
              <td style="width: 18%;">${contractData.unloadingTimeTo}</td>
            </tr>
            <tr>
              <td colspan="2"></td>
              <td class="bg-gray" colspan="2">контактное лицо</td>
              <td class="text-red" colspan="2">${contractData.unloadingContact}</td>
            </tr>
          </table>

          <!-- Payment -->
          <table>
            <tr>
              <td class="bg-gray font-bold" style="width: 10%;">Оплата:</td>
              <td class="text-red" style="width: 15%;">${contractData.price}</td>
              <td style="width: 10%;">руб.</td>
              <td class="text-red" style="width: 15%;">${contractData.paymentTerms}</td>
              <td class="text-red" style="width: 15%;">${contractData.paymentMethod}</td>
              <td style="width: 35%;">по оригиналам документов</td>
            </tr>
          </table>

          <!-- Driver Data -->
          <table>
            <tr>
              <td class="bg-gray font-bold" colspan="6">Данные водителя:</td>
            </tr>
            <tr>
              <td class="text-red" colspan="3">${contractData.driverName}</td>
              <td class="text-red" colspan="3">${contractData.driverLicense}</td>
            </tr>
            <tr>
              <td style="width: 10%;">паспорт</td>
              <td class="text-red" colspan="5">${contractData.driverPassport}</td>
            </tr>
          </table>

          <!-- Vehicle Data -->
          <table>
            <tr>
              <td class="bg-gray font-bold" style="width: 20%;">Данные ТС:</td>
              <td class="text-red">${contractData.vehicleNumber} ${contractData.vehicleTrailer}</td>
            </tr>
          </table>

          <!-- Terms and Conditions -->
          <div class="mb-2" style="margin-top: 8px;">
            <div class="font-bold mb-1">Условия перевозки:</div>
            <div class="text-xs">
              <p class="mb-1">Перевозчик обязан в лице водителя-экспедитора обязан проверить правильность оформления ТоН/ТТН на погрузке. Количество загруженных мест должно быть прописано в ТрН/ТТН и соответствовать количеству загруженных в ТС мест. При сдаче груза грузополучателю Перевозчик в лице водителя-экспедитора, обязан в ТрН/ТТН в графе «получении груза поставить время и дату сдачи груза и заверить эти данные печатью грузополучателя и подписью ответственного лица».</p>
              <p class="mb-1">В случае опозданий на погрузку/разгрузку Перевозчик обязан своевременно сообщить об этом Заказчику. Перевозчик обязан сообщать Заказчику о прибытии на погрузку/разгрузку, об убытии с места погрузки разгрузки, о местонахождении груза в пути.</p>
              <p class="mb-1">Ставка за перевозку, указанная в Договоре-заявке является ценой за 1 тонну груза с учётом всех расходов, в том числе по пропускам в связи с действующими ограничениями движения ТС по автомобильным дорогам. При перечислении денежных средств на карту комиссия Банка взимается за счет Перевозчика.</p>
            </div>
          </div>

          <!-- Penalties -->
          <div class="mb-3">
            <div class="font-bold mb-1">Штрафные санкции и ответственность:</div>
            <div class="text-xs">
              <p class="mb-1">Срыв погрузки/разгрузки одной из сторон влечёт за собой штраф в размере 20% от стоимости перевозки с виновной стороны.</p>
              <p class="mb-1">Перевозчик обязан доставить ТС в технически исправном состоянии, без повреждений (трещин, отбитых углов, пломб, следов посторонних грузов) и отвечающее санитарным требованиям, в строгом соответствии с подтвержденным Договором – заявкой, несоблюдения этих норм влечёт за собой штраф в размере 30% от стоимости перевозки.</p>
              <p class="mb-1">За опоздание на погрузку Перевозчик оплачивает штраф в размере 500 руб. за каждый час опоздания.</p>
              <p class="mb-1">Перевозчик несет ответственность за сохранность груза с момента принятия его для перевозки и до момента выдачи грузополучателю или уполномоченному им лицу. В случае порчи, недостачи или повреждения (порчи) груза по вине Перевозчика, Перевозчик обязан возместить стоимость нанесенного ущерба. Сумма ущерба, а также сумма штрафа, предъявленная в претензионном порядке, подлежит удержанию из сумму оказанных услуг.</p>
              <p class="mb-1">Перевозчик не имеет права удерживать переданные ему в ведение груза или другие товарно-материальные ценности в целях обеспечения ему платежей. Перевозчик, удерживающий принятые действиями убытки в полном объеме, исходя из стоимости простоя груза – 1500 руб. за каждый час, а также упущенной коммерческой выгоды – 10% от общей стоимости груза.</p>
            </div>
          </div>

          <!-- Signatures -->
          <div class="grid-2">
            <div>
              <p class="font-bold mb-1">Заказчик:</p>
              <p class="text-xs mb-1">Общество с ограниченной ответственностью</p>
              <p class="text-xs mb-1">«ФЛАУЭР МАСТЕР»</p>
              <p class="text-tiny mb-1">ИНН 7723449594 КПП 772201001</p>
              <p class="text-tiny mb-1">ОГРН: 1187746741566</p>
              <p class="text-tiny mb-1">Юридический адрес: 111024, Город Москва, вн.тер. г. Муниципальный</p>
              <p class="text-tiny mb-1">Округ Вьюново, ул Авиамоторная, дом 55, корпус 31, помещение 11/5</p>
              <p class="text-tiny mb-1">ОКПО: 32370514</p>
              <p class="text-tiny mb-1">ОКВЭД: 46.22</p>
              <p class="text-tiny mb-3">Расчетный счет: 40702810600021002373</p>
              <p class="text-tiny mb-1">Наименование банка: АО "ТелеПорт Банк" г. Москва</p>
              <p class="text-tiny mb-1">БИК: 044525273</p>
              <p class="text-tiny mb-1">Корр.счет: 30101810545250000273</p>
              <p class="text-tiny mb-3">тк.56@yandex.ru</p>
              <p class="text-tiny mb-4">Генеральный директор Знаменский М.А</p>
              <div class="signature-line">
                <span style="font-size: 10px;">__________/___________/</span>
                <span style="font-size: 10px;">МП</span>
              </div>
            </div>
            <div>
              <p class="font-bold mb-1">Перевозчик:</p>
              <p class="text-xs mb-1 text-red">Индивидуальный предприниматель СЕМИОНОВ ИГОРЬ ГЕННАДЬЕВИЧ</p>
              <p class="text-tiny mb-1 text-red">ОГРНИП 317619600018</p>
              <p class="text-tiny mb-1 text-red">ИНН 560993629160</p>
              <p class="text-tiny mb-1 text-red">р/с 40802.810.5.4600024045</p>
              <p class="text-tiny mb-1 text-red">ОТДЕЛЕНИЕ N8623 СБЕРБАНКА РОССИИ Г. ОРЕНБУРГ</p>
              <p class="text-tiny mb-1 text-red">БИК 045354601</p>
              <p class="text-tiny mb-1 text-red">к/с 3010 1810 6000 0000 0601</p>
              <p class="text-tiny mb-1 text-red">юр. адрес 460044, г.Оренбург, ул. Конституции СССР, д. 5, кв. 22</p>
              <p class="text-tiny mb-1 text-red">почт. адрес 460052, г.Оренбург, мкр 70 лет ВЛКСМ, д. 10, кв. 16</p>
              <p class="text-tiny mb-3 text-red">тел. рабочая 8(35334)25512666</p>
              <p class="text-tiny mb-4 text-red">рабочая электронная почта vezet56@mail.ru</p>
              <div class="signature-line">
                <span style="font-size: 10px;">__________/___________/</span>
                <span style="font-size: 10px;">МП</span>
              </div>
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


    </div>
  );
}