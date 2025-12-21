import { useState } from 'react';
import Icon from './ui/icon';
import * as XLSX from 'xlsx';
import { ReportFormData } from './ReportModal';

interface Report extends ReportFormData {
  id: string;
}

interface ReportsDashboardProps {
  onCreateReport: () => void;
  onSaveReport: (report: ReportFormData) => void;
}

export default function ReportsDashboard({ onCreateReport, onSaveReport }: ReportsDashboardProps) {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      number: '2012ФМ-1',
      date: '2025-12-20',
      customerName: 'ООО «ФЛАУЭР МАСТЕР»',
      customerInn: '7724449594',
      customerOgrn: '1187746741566',
      customerAddress: '11024, Город Москва, вн.тер. г. Муниципальный Округ Якиманка, ул Новокузнецкая, дом 55, корпус 31, помещение 11/5',
      customerOkpo: '3237051',
      customerOkvd: '46.22',
      customerAccount: '40702810600010002373',
      customerBank: 'АО "ТелеПорт Банк" г. Москва',
      customerBik: '044525273',
      customerCorAccount: '30101810545250000273',
      customerDirector: 'Знаменский М.А',
      carrierName: 'ИП СЕМИОНОВ ИГОРЬ ГЕННАДЬЕВИЧ',
      carrierInn: '560993629160',
      carrierOgrn: 'ОГРНИП N8623 СБЕРБАНКА РОССИИ Г. ОРЕНБУРГ',
      carrierAccount: '40802.810.5.46000024045',
      carrierBank: 'БИК 045354601',
      carrierAddress: 'юр. адрес 460044, г.Оренбург, ул. Конституции СССР, д. 5, кв. 22 почт. адрес 460052, г.Оренбург, мкр 70 лет ВЛКСМ, д. 10, кв. 16',
      carrierEmail: 'vezet56@mail.ru',
      cargoType: 'рефрижератор',
      bodyType: 'тип кузова',
      weight: '20',
      volume: '82',
      specialConditions: 't режим',
      extraConditions: '+ 2 град',
      cargoName: 'Луковицы',
      loadingAddress: 'Московская область, городской округ Люберцы, деревня Островцы, ул. Школьная 27',
      loadingDate: '2025-12-20',
      loadingContact: 'Константин зав складом 89104355433, Артем 89035532883',
      unloadingAddress: 'г. Ижевск, Завьяловский район, д. Шабердино',
      unloadingDate: '2025-12-22',
      unloadingContact: 'Денис 89120120',
      amount: '150 000',
      paymentTerms: 'без НДС',
      paymentConditions: '5-7 б/д',
      driverName: 'Шильков Алексей Леонидович',
      driverPassport: '9421 № 975426 выдан 03.02.2022г , МВД по Удмуртской Республике код подразделения 180-010',
      driverLicense: 'ВУ 9940 381012    89120266424',
      vehicleModel: 'Вольво H777AP/18',
      vehicleNumber: 'H777AP/18',
      trailerNumber: 'АО0714/18',
      transportConditions: 'Перевозчик и/или лицо водителя-экспедитора обязан проверить правильность оформления ТоН/ТТН на погрузке.'
    },
  ]);

  const handleSaveNewReport = (reportData: ReportFormData) => {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString()
    };
    setReports([...reports, newReport]);
    onSaveReport(reportData);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}.${month}.${year}`;
  };

  const handleExportExcel = (report: Report) => {
    const workbook = XLSX.utils.book_new();

    const data = [
      ['Договор-заявка №', report.number, '', 'от', formatDate(report.date), ''],
      [],
      ['', '', 'на перевозку грузов автомобильным транспортом', '', '', ''],
      [],
      ['Заказчик:', report.customerName, '', 'Перевозчик:', report.carrierName, ''],
      [],
      ['Требуемый тип ТС:', `${report.bodyType}`, report.cargoType, report.weight + ' т.', report.volume + ' м3', ''],
      ['Особые условия:', `${report.specialConditions}`, `${report.extraConditions}`, 'доп. условия', 'водителю быть на связи', ''],
      ['Груз:', report.cargoName, '', '', '', ''],
      [],
      ['Погрузка:', report.loadingAddress, '', '', '', ''],
      ['дата', formatDate(report.loadingDate), '', '', '', ''],
      ['с', '', '', '', '', ''],
      ['до', 'контактное лицо', report.loadingContact, '', '', ''],
      ['Разгрузка:', report.unloadingAddress, '', '', '', ''],
      ['дата', formatDate(report.unloadingDate), '', '', '', ''],
      ['с', '', 'контактное лицо', report.unloadingContact, '', ''],
      ['Оплата:', `${report.amount} руб.`, report.paymentTerms, report.paymentConditions, 'по оригиналам документов', ''],
      ['Данные водителя:', report.driverName, '', report.driverLicense, '', ''],
      ['', '', '', '', '', ''],
      ['паспорт', report.driverPassport, '', '', '', ''],
      ['', '', '', '', '', ''],
      ['Данные ТС:', report.vehicleModel, `прицеп ${report.trailerNumber}`, '', '', ''],
      [],
      ['Условия перевозки:', '', '', '', '', ''],
      [report.transportConditions || 'Перевозчик и/или лицо водителя-экспедитора обязан проверить правильность оформления ТоН/ТТН на погрузке. Количество загруженных мест должно быть проличено и при учёте ТрН/ТТН в графе на погрузке. При здаче груза грузополучателю Перевозчик в лице водителя-экспедитора, обязан в ТрН/ТТН в графе о получении груза поставить время и дату здачи груза и заверить эти данные печатью грузополучателя и подписью ответственного лица. После передать Заказчику по ТТН/трн для расчета.', '', '', '', '', ''],
      [],
      ['Штрафные санкции и ответственность:', '', '', '', '', ''],
      ['Срыв погрузки/разгрузки одной из сторон влечёт за собой штраф в размере 20% от стоимости перевозки с виновной стороны.', '', '', '', '', ''],
      ['Перевозчик обязан предоставить ТС в технически исправном состоянии, без течи снижени допуска груза (Экспедитору запрещается брать постороннюю тазу), отвечающее санитарным требованиям, в строгом соответствии с подтвержденным Договором – заявкой, несоблюдения этих норм влечёт за собой штраф в размере 30% от стоимости перевозки.', '', '', '', '', ''],
      ['За опоздание на погрузку/разгрузку Перевозчик оплачивает штраф в размере 500 руб. за каждый\час опоздания.', '', '', '', '', ''],
      ['Перевозчик несет ответственность за сохранность груза с момента принятия его для перевозки и до момента выдачи грузополучателю или уполномоченному им лицу. В случае утраты, недостатки или повреждения (порчи) груза при перевозке. Заказчик может право оплатить транспортные услуги Перевозчика до момента выяснения причин утраты, недостатки или повреждения (порчи). В случае утраты, недостатки или повреждения (порчи) груза по вине Перевозчика, Перевозчик обязан возместить стоимость нанесенного ущерба. Сумма ущерба, а также сумма штрафа, предъявленная в претензионом порядке, подлежит удержанию из сумму оказываемых услуг.', '', '', '', '', ''],
      ['Перевозчик не имеет права удерживать передпнные ему в ведение грузы или другие товарно-материальные ценности в целях обеспечения ему платежей, даже если Перевозчик управляет несвоевременными такими действиями убытки в полном объеме, исходя из стоимости простоя груза – 1500 руб. за каждый\час, а также упущенной коммерческой выгоды – 10% от общей стоимости груза.', '', '', '', '', ''],
      [],
      ['Заказчик:', '', '', 'Перевозчик:', '', ''],
      ['Общество с ограниченной ответственностью', '', 'Индивидуальный предприниматель СЕМИОНОВ ИГОРЬ ГЕННАДЬЕВИЧ', '', '', ''],
      ['«ФЛАУЭР МАСТЕР»', '', `ОГРНИП ${report.carrierOgrn}`, '', '', ''],
      [`ИНН ${report.customerInn} ИНН ${report.carrierInn}`, '', `ИНН ${report.carrierInn}`, '', '', ''],
      [`ОГРН: ${report.customerOgrn}`, '', `р/с ${report.carrierAccount}`, '', '', ''],
      [`ОКПО: ${report.customerOkpo}`, '', `${report.carrierBank}`, '', '', ''],
      [`Расчетный счет: ${report.customerAccount}`, '', `к/с 3010 1810 6000 0000 0601`, '', '', ''],
      [`Наименование банка: ${report.customerBank}`, '', `юр. адрес ${report.carrierAddress}`, '', '', ''],
      [`БИК: ${report.customerBik}`, '', `раб.тел. ${report.carrierEmail ? 'раб.тел. 89122512666' : ''}`, '', '', ''],
      [`Корр.счет: ${report.customerCorAccount}`, '', `рабочая электронная почта ${report.carrierEmail}`, '', '', ''],
      [`тлк.56@yandex.ru`, '', '', '', '', ''],
      [`Генеральный директор ${report.customerDirector}`, '', '', '', '', ''],
      [],
      ['_____________/_________________/', '', 'МП', '_____________/_________________/', '', 'МП']
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    
    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 30 },
      { wch: 25 },
      { wch: 20 },
      { wch: 25 },
      { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, `Договор ${report.number}`);
    XLSX.writeFile(workbook, `Договор-заявка_${report.number}.xlsx`);
  };

  const handleDeleteReport = (id: string) => {
    if (confirm('Удалить этот договор-заявку?')) {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  const handleEditReport = (id: string) => {
    console.log('Редактирование договора-заявки', id);
  };

  const handlePrintPDF = (report: Report) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Договор-заявка ${report.number}</title>
          <style>
            @page { size: A4; margin: 12mm; }
            body { 
              font-family: Arial, sans-serif; 
              font-size: 10px; 
              line-height: 1.2; 
              padding: 0;
              margin: 0;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 1px;
              border: 1px solid black;
            }
            td { 
              border: 1px solid black;
              padding: 2px 4px;
              vertical-align: top;
            }
            .text-red { color: #dc2626; }
            b { font-weight: bold; }
            .no-border { border: none; }
            .center { text-align: center; }
            .section-title { font-size: 11px; font-weight: bold; }
          </style>
        </head>
        <body>
          <table>
            <tr>
              <td colspan="3"><b>Договор-заявка №</b> <span class="text-red"><b>${report.number}</b></span></td>
              <td colspan="3" style="text-align: right;"><b>от</b> <span class="text-red"><b>${formatDate(report.date)} г.</b></span></td>
            </tr>
          </table>

          <table>
            <tr>
              <td colspan="6" class="center"><b>на перевозку грузов автомобильным транспортом</b></td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 15%;"><b>Заказчик:</b></td>
              <td style="width: 35%;" class="text-red">${report.customerName}</td>
              <td style="width: 15%;"><b>Перевозчик:</b></td>
              <td style="width: 35%;" class="text-red" colspan="3">${report.carrierName}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 20%;"><b>Требуемый тип ТС:</b></td>
              <td style="width: 15%;" class="text-red">${report.bodyType}</td>
              <td style="width: 18%;" class="text-red">${report.cargoType}</td>
              <td style="width: 12%;" class="text-red">${report.weight} т.</td>
              <td style="width: 12%;" class="text-red">${report.volume} м3</td>
              <td style="width: 23%;"></td>
            </tr>
            <tr>
              <td><b>Особые условия:</b></td>
              <td class="text-red">${report.specialConditions}</td>
              <td class="text-red">${report.extraConditions}</td>
              <td colspan="2">доп. условия</td>
              <td>водителю быть на связи</td>
            </tr>
            <tr>
              <td><b>Груз:</b></td>
              <td colspan="5" class="text-red">${report.cargoName}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 15%;"><b>Погрузка:</b></td>
              <td colspan="5" class="text-red">${report.loadingAddress}</td>
            </tr>
            <tr>
              <td><b>дата</b></td>
              <td class="text-red">${formatDate(report.loadingDate)}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>с</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>до</td>
              <td><b>контактное лицо</b></td>
              <td colspan="4" class="text-red">${report.loadingContact}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 15%;"><b>Разгрузка:</b></td>
              <td colspan="5" class="text-red">${report.unloadingAddress}</td>
            </tr>
            <tr>
              <td><b>дата</b></td>
              <td class="text-red">${formatDate(report.unloadingDate)}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>с</td>
              <td></td>
              <td><b>контактное лицо</b></td>
              <td colspan="3" class="text-red">${report.unloadingContact}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 15%;"><b>Оплата:</b></td>
              <td style="width: 15%;" class="text-red">${report.amount} руб.</td>
              <td style="width: 15%;" class="text-red">${report.paymentTerms}</td>
              <td style="width: 15%;" class="text-red">${report.paymentConditions}</td>
              <td colspan="2">по оригиналам документов</td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 20%;"><b>Данные водителя:</b></td>
              <td class="text-red" colspan="2">${report.driverName}</td>
              <td class="text-red" colspan="3">${report.driverLicense}</td>
            </tr>
            <tr>
              <td></td>
              <td colspan="5"></td>
            </tr>
            <tr>
              <td><b>паспорт</b></td>
              <td colspan="5" class="text-red">${report.driverPassport}</td>
            </tr>
            <tr>
              <td></td>
              <td colspan="5"></td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 15%;"><b>Данные ТС:</b></td>
              <td class="text-red" colspan="5">${report.vehicleModel} прицеп ${report.trailerNumber}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td><b>Условия перевозки:</b></td>
            </tr>
            <tr>
              <td style="font-size: 9px;">
                ${report.transportConditions || 'Перевозчик и/или лицо водителя-экспедитора обязан проверить правильность оформления ТоН/ТТН на погрузке. Количество загруженных мест должно быть проличено и при учёте ТрН/ТТН в графе на погрузке. При здаче груза грузополучателю Перевозчик в лице водителя-экспедитора, обязан в ТрН/ТТН в графе о получении груза поставить время и дату здачи груза и заверить эти данные печатью грузополучателя и подписью ответственного лица. После передать Заказчику по ТТН/трн для расчета.'}
              </td>
            </tr>
          </table>

          <table>
            <tr>
              <td><b>Штрафные санкции и ответственность:</b></td>
            </tr>
            <tr>
              <td style="font-size: 8.5px;">
                Срыв погрузки/разгрузки одной из сторон влечёт за собой штраф в размере 20% от стоимости перевозки с виновной стороны.<br><br>
                Перевозчик обязан предоставить ТС в технически исправном состоянии, без течи снижени допуска груза (Экспедитору запрещается брать постороннюю тазу), отвечающее санитарным требованиям, в строгом соответствии с подтвержденным Договором – заявкой, несоблюдения этих норм влечёт за собой штраф в размере 30% от стоимости перевозки.<br><br>
                За опоздание на погрузку/разгрузку Перевозчик оплачивает штраф в размере 500 руб. за каждый час опоздания.<br><br>
                Перевозчик несет ответственность за сохранность груза с момента принятия его для перевозки и до момента выдачи грузополучателю или уполномоченному им лицу. В случае утраты, недостатки или повреждения (порчи) груза при перевозке. Заказчик может право оплатить транспортные услуги Перевозчика до момента выяснения причин утраты, недостатки или повреждения (порчи). В случае утраты, недостатки или повреждения (порчи) груза по вине Перевозчика, Перевозчик обязан возместить стоимость нанесенного ущерба. Сумма ущерба, а также сумма штрафа, предъявленная в претензионом порядке, подлежит удержанию из сумму оказываемых услуг.<br><br>
                Перевозчик не имеет права удерживать передпнные ему в ведение грузы или другие товарно-материальные ценности в целях обеспечения ему платежей, даже если Перевозчик управляет несвоевременными такими действиями убытки в полном объеме, исходя из стоимости простоя груза – 1500 руб. за каждый час, а также упущенной коммерческой выгоды – 10% от общей стоимости груза.
              </td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 50%;"><b>Заказчик:</b></td>
              <td style="width: 50%;"><b>Перевозчик:</b></td>
            </tr>
            <tr>
              <td style="font-size: 9px;">
                Общество с ограниченной ответственностью<br>
                «ФЛАУЭР МАСТЕР»<br>
                ИНН ${report.customerInn} ИНН ${report.carrierInn}<br>
                ОГРН: ${report.customerOgrn}<br>
                ОКПО: ${report.customerOkpo}<br>
                Расчетный счет: ${report.customerAccount}<br>
                Наименование банка: ${report.customerBank}<br>
                БИК: ${report.customerBik}<br>
                Корр.счет: ${report.customerCorAccount}<br>
                тлк.56@yandex.ru<br>
                Генеральный директор ${report.customerDirector}
              </td>
              <td style="font-size: 9px;">
                Индивидуальный предприниматель СЕМИОНОВ ИГОРЬ ГЕННАДЬЕВИЧ<br>
                ${report.carrierOgrn}<br>
                ИНН ${report.carrierInn}<br>
                р/с ${report.carrierAccount}<br>
                ${report.carrierBank}<br>
                к/с 3010 1810 6000 0000 0601<br>
                юр. адрес ${report.carrierAddress}<br>
                раб.тел. 89122512666<br>
                рабочая электронная почта ${report.carrierEmail}
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding-top: 20px;">_____________/_________________/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;МП</td>
              <td style="text-align: center; padding-top: 20px;">_____________/_________________/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;МП</td>
            </tr>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Договоры-заявки</h3>
        <button
          onClick={onCreateReport}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Icon name="Plus" size={20} />
          Создать договор-заявку
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Номер</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Дата</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Заказчик</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Перевозчик</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Груз</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Маршрут</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Сумма</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{report.number}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(report.date)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{report.customerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{report.carrierName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{report.cargoName}, {report.weight}т, {report.volume}м³</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {report.loadingAddress.split(',')[0]} → {report.unloadingAddress.split(',')[0]}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{report.amount} ₽</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handlePrintPDF(report)}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Печать/PDF"
                      >
                        <Icon name="Printer" size={18} />
                      </button>
                      <button
                        onClick={() => handleExportExcel(report)}
                        className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        title="Экспорт в Excel"
                      >
                        <Icon name="Download" size={18} />
                      </button>
                      <button
                        onClick={() => handleEditReport(report.id)}
                        className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                        title="Редактировать"
                      >
                        <Icon name="Edit" size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Удалить"
                      >
                        <Icon name="Trash2" size={18} />
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
  );
}
