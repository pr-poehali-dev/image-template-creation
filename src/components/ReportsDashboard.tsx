import { useState } from 'react';
import Icon from './ui/icon';
import * as XLSX from 'xlsx';

interface Report {
  id: string;
  number: string;
  date: string;
  customer: string;
  carrier: string;
  cargo: string;
  route: string;
  amount: string;
}

interface ReportsDashboardProps {
  onCreateReport: () => void;
}

export default function ReportsDashboard({ onCreateReport }: ReportsDashboardProps) {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      number: '2112ФМ-1',
      date: '21.12.2025',
      customer: 'ООО «ФЛАУЭР МАСТЕР»',
      carrier: 'ООО «Везет 56»',
      cargo: 'Луковицы, 20т, 82м³',
      route: 'Казань → Москва',
      amount: '150 000 ₽',
    },
  ]);

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      reports.map(report => ({
        'Номер': report.number,
        'Дата': report.date,
        'Заказчик': report.customer,
        'Перевозчик': report.carrier,
        'Груз': report.cargo,
        'Маршрут': report.route,
        'Сумма': report.amount,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Отчеты');
    XLSX.writeFile(workbook, `Отчеты_${new Date().toLocaleDateString('ru-RU')}.xlsx`);
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
              font-size: 11px; 
              line-height: 1.3; 
              padding: 0;
              margin: 0;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 2px;
              border: 1px solid black;
            }
            td { 
              border: 1px solid black;
              padding: 3px 5px;
              vertical-align: top;
            }
            .text-red { color: #dc2626; }
            b { font-weight: bold; }
          </style>
        </head>
        <body>
          <table>
            <tr>
              <td colspan="3"><b>Договор-заявка №</b> <span class="text-red"><b>${report.number}</b></span></td>
              <td colspan="3" style="text-align: right;"><b>от</b> <span class="text-red"><b>${report.date}</b></span></td>
            </tr>
          </table>

          <table>
            <tr>
              <td colspan="6" style="text-align: center;"><b>на перевозку грузов автомобильным транспортом</b></td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 15%;"><b>Заказчик:</b></td>
              <td style="width: 35%;" class="text-red">${report.customer}</td>
              <td style="width: 15%;"><b>Перевозчик:</b></td>
              <td style="width: 35%;" class="text-red">${report.carrier}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 15%;"><b>Груз:</b></td>
              <td class="text-red">${report.cargo}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 15%;"><b>Маршрут:</b></td>
              <td class="text-red">${report.route}</td>
            </tr>
          </table>

          <table>
            <tr>
              <td style="width: 15%;"><b>Сумма:</b></td>
              <td class="text-red">${report.amount}</td>
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
        <h3 className="text-xl font-semibold">Отчеты по договорам-заявкам</h3>
        <div className="flex gap-3">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Icon name="Download" size={20} />
            Экспорт в Excel
          </button>
          <button
            onClick={onCreateReport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Icon name="Plus" size={20} />
            Создать отчет
          </button>
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
                  <td className="px-4 py-3 text-sm text-gray-600">{report.date}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{report.customer}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{report.carrier}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{report.cargo}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{report.route}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{report.amount}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handlePrintPDF(report)}
                      className="text-primary hover:text-primary/80 transition-colors"
                      title="Печать/PDF"
                    >
                      <Icon name="Printer" size={20} />
                    </button>
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
