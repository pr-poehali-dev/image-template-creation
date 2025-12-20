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
      number: '2012ФМ-1',
      date: '20 декабря 2025 г.',
      customer: 'ООО «ФЛАУЭР МАСТЕР»',
      carrier: 'ИП СЕМИОНОВ ИГОРЬ ГЕННАДЬЕВИЧ',
      vehicleBody: 'рефрижератор',
      tons: '20',
      cubicMeters: '82',
      specialConditions: 't режим',
      additionalConditions: '+ 2 град',
      additionalConditions2: 'доп. условия',
      cargoDescription: 'Луковицы',
      loadingAddress: 'Московская область, городской округ Люберцы, деревня Островцы, ул. Школьная 27',
      loadingDate: '20.12.25',
      loadingContact: 'Константин зав складом 89104355433, Артем 89035532883',
      unloadingAddress: 'г. Ижевск, Завьяловский район, д. Шабердино',
      unloadingDate: '22.12.25',
      unloadingContact: 'Денис 89120120277',
      price: '150 000',
      paymentTerms: 'без НДС',
      paymentMethod: '5-7 б/д',
      driverName: 'Шильков Алексей Леонидович',
      driverLicense: 'ВУ 9940 381012',
      driverPhone: '89120266424',
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
            @page { size: A4; margin: 12mm; }
            body { 
              font-family: Arial, sans-serif; 
              font-size: 11px; 
              line-height: 1.2; 
              padding: 0;
              margin: 0;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 0;
              border: 1px solid black;
            }
            td { 
              border: 1px solid black;
              padding: 2px 4px;
              vertical-align: top;
            }
            .text-red { color: #dc2626; }
            .text-xs { font-size: 9px; line-height: 1.25; }
            .text-tiny { font-size: 7px; line-height: 1.2; }
            p { margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          <table>
            <tr>
              <td colspan="3" style="padding: 4px;"><b>Договор-заявка №</b> <span class="text-red"><b>${contractData.number}</b></span></td>
              <td colspan="3" style="text-align: right; padding: 4px;"><b>от</b> <span class="text-red"><b>${contractData.date}</b></span></td>
            </tr>
          </table>

          <table>
            <tr>
              <td colspan="6" style="text-align: center; padding: 3px;"><b>на перевозку грузов автомобильным транспортом</b></td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 12%;"><b>Заказчик:</b></td>
              <td style="width: 38%;" class="text-red">${contractData.customer}</td>
              <td style="width: 12%;"><b>Перевозчик:</b></td>
              <td style="width: 38%;" colspan="3" class="text-red">${contractData.carrier}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 18%;"><b>Требуемый тип ТС:</b></td>
              <td style="width: 12%;">тип кузова</td>
              <td style="width: 20%;" class="text-red">${contractData.vehicleBody}</td>
              <td style="width: 8%; text-align: center;" class="text-red">${contractData.tons}</td>
              <td style="width: 4%; text-align: center;">т.</td>
              <td style="width: 8%; text-align: center;" class="text-red">${contractData.cubicMeters}</td>
              <td style="width: 5%; text-align: center;">м3</td>
            </tr>
            <tr>
              <td><b>Особые условия:</b></td>
              <td>${contractData.specialConditions}</td>
              <td class="text-red">${contractData.additionalConditions}</td>
              <td colspan="2" class="text-red">${contractData.additionalConditions2}</td>
              <td colspan="2">водителю быть на связи</td>
            </tr>
            <tr>
              <td><b>Груз:</b></td>
              <td colspan="6" class="text-red">${contractData.cargoDescription}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 10%;"><b>Погрузка:</b></td>
              <td colspan="5" class="text-red">${contractData.loadingAddress}</td>
            </tr>
            <tr>
              <td>дата</td>
              <td style="width: 15%;" class="text-red">${contractData.loadingDate}</td>
              <td style="width: 3%;">с</td>
              <td style="width: 15%;"></td>
              <td style="width: 3%;">до</td>
              <td style="width: 15%;"></td>
            </tr>
            <tr>
              <td colspan="2"></td>
              <td colspan="2">контактное лицо</td>
              <td colspan="2" class="text-red">${contractData.loadingContact}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 10%;"><b>Разгрузка:</b></td>
              <td colspan="5" class="text-red">${contractData.unloadingAddress}</td>
            </tr>
            <tr>
              <td>дата</td>
              <td style="width: 15%;" class="text-red">${contractData.unloadingDate}</td>
              <td style="width: 3%;">с</td>
              <td style="width: 15%;"></td>
              <td style="width: 3%;">до</td>
              <td style="width: 15%;"></td>
            </tr>
            <tr>
              <td colspan="2"></td>
              <td colspan="2">контактное лицо</td>
              <td colspan="2" class="text-red">${contractData.unloadingContact}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 10%;"><b>Оплата:</b></td>
              <td style="width: 12%;" class="text-red">${contractData.price}</td>
              <td style="width: 8%;">руб.</td>
              <td style="width: 12%;" class="text-red">${contractData.paymentTerms}</td>
              <td style="width: 12%;" class="text-red">${contractData.paymentMethod}</td>
              <td style="width: 46%;">по оригиналам документов</td>
            </tr>
          </table>

          <table>
            <tr>
              <td colspan="6"><b>Данные водителя:</b></td>
            </tr>
            <tr>
              <td colspan="3" class="text-red">${contractData.driverName}</td>
              <td colspan="3" class="text-red">${contractData.driverLicense} ${contractData.driverPhone}</td>
            </tr>
            <tr>
              <td style="width: 10%;">паспорт</td>
              <td colspan="5" class="text-red">${contractData.driverPassport}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 15%;"><b>Данные ТС:</b></td>
              <td class="text-red">${contractData.vehicleNumber} ${contractData.vehicleTrailer}</td>
            </tr>
          </table>

          <div style="margin-top: 6px; margin-bottom: 6px;">
            <p style="margin-bottom: 2px;"><b>Условия перевозки:</b></p>
            <p class="text-xs" style="margin-bottom: 2px; text-align: justify;">Перевозчик обязан в лице водителя-экспедитора обязан проверить правильность оформления ТоН/ТТН на погрузке. Количество загруженных мест должно быть прописано в ТрН/ТТН и соответствовать количеству загруженных в ТС мест. При сдаче груза грузополучателю Перевозчик в лице водителя-экспедитора, обязан в ТрН/ТТН в графе «получении груза поставить время и дату сдачи груза и заверить эти данные печатью грузополучателя и подписью ответственного лица».</p>
            <p class="text-xs" style="margin-bottom: 2px; text-align: justify;">В случае опозданий на погрузку/разгрузку Перевозчик обязан своевременно сообщить об этом Заказчику. Перевозчик обязан сообщать Заказчику о прибытии на погрузку/разгрузку, об убытии с места погрузки разгрузки, о местонахождении груза в пути.</p>
            <p class="text-xs" style="text-align: justify;">Ставка за перевозку, указанная в Договоре-заявке является ценой за 1 тонну груза с учётом всех расходов, в том числе по пропускам в связи с действующими ограничениями движения ТС по автомобильным дорогам. При перечислении денежных средств на карту комиссия Банка взимается за счет Перевозчика.</p>
          </div>

          <div style="margin-bottom: 6px;">
            <p style="margin-bottom: 2px;"><b>Штрафные санкции и ответственность:</b></p>
            <p class="text-xs" style="margin-bottom: 2px; text-align: justify;">Срыв погрузки/разгрузки одной из сторон влечёт за собой штраф в размере 20% от стоимости перевозки с виновной стороны.</p>
            <p class="text-xs" style="margin-bottom: 2px; text-align: justify;">Перевозчик обязан доставить ТС в технически исправном состоянии, без повреждений (трещин, отбитых углов, пломб, следов посторонних грузов) и отвечающее санитарным требованиям, в строгом соответствии с подтвержденным Договором – заявкой, несоблюдения этих норм влечёт за собой штраф в размере 30% от стоимости перевозки.</p>
            <p class="text-xs" style="margin-bottom: 2px; text-align: justify;">За опоздание на погрузку Перевозчик оплачивает штраф в размере 500 руб. за каждый час опоздания.</p>
            <p class="text-xs" style="margin-bottom: 2px; text-align: justify;">Перевозчик несет ответственность за сохранность груза с момента принятия его для перевозки и до момента выдачи грузополучателю или уполномоченному им лицу. В случае порчи, недостачи или повреждения (порчи) груза по вине Перевозчика, Перевозчик обязан возместить стоимость нанесенного ущерба. Сумма ущерба, а также сумма штрафа, предъявленная в претензионном порядке, подлежит удержанию из сумму оказанных услуг.</p>
            <p class="text-xs" style="text-align: justify;">Перевозчик не имеет права удерживать переданные ему в ведение груза или другие товарно-материальные ценности в целях обеспечения ему платежей. Перевозчик, удерживающий принятые действиями убытки в полном объеме, исходя из стоимости простоя груза – 1500 руб. за каждый час, а также упущенной коммерческой выгоды – 10% от общей стоимости груза.</p>
          </div>

          <div style="display: flex; gap: 20px;">
            <div style="flex: 1;">
              <p style="margin-bottom: 2px;"><b>Заказчик:</b></p>
              <p class="text-xs" style="margin-bottom: 1px;">Общество с ограниченной ответственностью</p>
              <p class="text-xs" style="margin-bottom: 1px;">«ФЛАУЭР МАСТЕР»</p>
              <p class="text-tiny" style="margin-bottom: 1px;">ИНН 7723449594 КПП 772201001</p>
              <p class="text-tiny" style="margin-bottom: 1px;">ОГРН: 1187746741566</p>
              <p class="text-tiny" style="margin-bottom: 1px;">Юридический адрес: 111024, Город Москва, вн.тер. г. Муниципальный</p>
              <p class="text-tiny" style="margin-bottom: 1px;">Округ Вьюново, ул Авиамоторная, дом 55, корпус 31, помещение 11/5</p>
              <p class="text-tiny" style="margin-bottom: 1px;">ОКПО: 32370514</p>
              <p class="text-tiny" style="margin-bottom: 1px;">ОКВЭД: 46.22</p>
              <p class="text-tiny" style="margin-bottom: 3px;">Расчетный счет: 40702810600021002373</p>
              <p class="text-tiny" style="margin-bottom: 1px;">Наименование банка: АО "ТелеПорт Банк" г. Москва</p>
              <p class="text-tiny" style="margin-bottom: 1px;">БИК: 044525273</p>
              <p class="text-tiny" style="margin-bottom: 1px;">Корр.счет: 30101810545250000273</p>
              <p class="text-tiny" style="margin-bottom: 3px;">тк.56@yandex.ru</p>
              <p class="text-tiny" style="margin-bottom: 8px;">Генеральный директор Знаменский М.А</p>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid black; padding-top: 20px; margin-bottom: 2px;">
                <span style="font-size: 9px;">__________/___________/</span>
                <span style="font-size: 9px;">МП</span>
              </div>
            </div>
            <div style="flex: 1;">
              <p style="margin-bottom: 2px;"><b>Перевозчик:</b></p>
              <p class="text-xs text-red" style="margin-bottom: 1px;">Индивидуальный предприниматель СЕМИОНОВ ИГОРЬ ГЕННАДЬЕВИЧ</p>
              <p class="text-tiny text-red" style="margin-bottom: 1px;">ОГРНИП 317619600018</p>
              <p class="text-tiny text-red" style="margin-bottom: 1px;">ИНН 560993629160</p>
              <p class="text-tiny text-red" style="margin-bottom: 1px;">р/с 40802.810.5.4600024045</p>
              <p class="text-tiny text-red" style="margin-bottom: 1px;">ОТДЕЛЕНИЕ N8623 СБЕРБАНКА РОССИИ Г. ОРЕНБУРГ</p>
              <p class="text-tiny text-red" style="margin-bottom: 1px;">БИК 045354601</p>
              <p class="text-tiny text-red" style="margin-bottom: 1px;">к/с 3010 1810 6000 0000 0601</p>
              <p class="text-tiny text-red" style="margin-bottom: 1px;">юр. адрес 460044, г.Оренбург, ул. Конституции СССР, д. 5, кв. 22</p>
              <p class="text-tiny text-red" style="margin-bottom: 1px;">почт. адрес 460052, г.Оренбург, мкр 70 лет ВЛКСМ, д. 10, кв. 16</p>
              <p class="text-tiny text-red" style="margin-bottom: 1px;">тел. рабочая 8(35334)25512666</p>
              <p class="text-tiny text-red" style="margin-bottom: 8px;">рабочая электронная почта vezet56@mail.ru</p>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px solid black; padding-top: 20px; margin-bottom: 2px;">
                <span style="font-size: 9px;">__________/___________/</span>
                <span style="font-size: 9px;">МП</span>
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