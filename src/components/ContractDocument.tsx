interface ContractData {
  number: string;
  date: string;
  customer: string;
  carrier: string;
  vehicleType: string;
  vehicleBody: string;
  tons: string;
  cubicMeters: string;
  specialConditions: string;
  additionalConditions: string;
  cargoDescription: string;
  loadingAddress: string;
  loadingDate: string;
  loadingContact: string;
  unloadingAddress: string;
  unloadingDate: string;
  unloadingContact: string;
  price: string;
  paymentTerms: string;
  paymentMethod: string;
  driverName: string;
  driverLicense: string;
  driverPassport: string;
  vehicleNumber: string;
  vehicleTrailer: string;
}

interface ContractDocumentProps {
  data: ContractData;
}

export default function ContractDocument({ data }: ContractDocumentProps) {
  return (
    <div className="font-sans text-sm leading-relaxed" style={{ width: '210mm', minHeight: '297mm', padding: '15mm', backgroundColor: 'white' }}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="font-bold">Договор-заявка №</span>
          <span className="text-red-600 font-bold ml-2">{data.number}</span>
        </div>
        <div>
          <span className="font-bold">от</span>
          <span className="text-red-600 font-bold ml-2">{data.date}</span>
        </div>
      </div>

      <div className="text-center font-bold mb-3">
        на перевозку грузов автомобильным транспортом
      </div>

      <table className="w-full border-collapse border border-black mb-3">
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1 font-semibold bg-gray-50">Заказчик:</td>
            <td className="border border-black px-2 py-1 text-red-600">{data.customer}</td>
            <td className="border border-black px-2 py-1 font-semibold bg-gray-50">Перевозчик:</td>
            <td className="border border-black px-2 py-1 text-red-600">{data.carrier}</td>
          </tr>
        </tbody>
      </table>

      <table className="w-full border-collapse border border-black mb-3">
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1 font-semibold bg-gray-50 w-1/5">Требуемый тип ТС:</td>
            <td className="border border-black px-2 py-1 w-1/5">{data.vehicleType}</td>
            <td className="border border-black px-2 py-1 text-red-600 w-1/5">{data.vehicleBody}</td>
            <td className="border border-black px-2 py-1 text-red-600 w-1/10 text-center">{data.tons}</td>
            <td className="border border-black px-2 py-1 w-1/20 text-center">т.</td>
            <td className="border border-black px-2 py-1 text-red-600 w-1/10 text-center">{data.cubicMeters}</td>
            <td className="border border-black px-2 py-1 w-1/20 text-center">м3</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 font-semibold bg-gray-50">Особые условия:</td>
            <td className="border border-black px-2 py-1">{data.specialConditions}</td>
            <td className="border border-black px-2 py-1 text-red-600" colSpan={2}>{data.additionalConditions}</td>
            <td className="border border-black px-2 py-1" colSpan={3}>доп. условия</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 font-semibold bg-gray-50">Груз:</td>
            <td className="border border-black px-2 py-1 text-red-600" colSpan={6}>{data.cargoDescription}</td>
          </tr>
        </tbody>
      </table>

      <table className="w-full border-collapse border border-black mb-3">
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1 font-semibold bg-gray-50 w-1/6">Погрузка:</td>
            <td className="border border-black px-2 py-1 text-red-600" colSpan={5}>{data.loadingAddress}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1">дата</td>
            <td className="border border-black px-2 py-1 text-red-600 w-1/6">{data.loadingDate}</td>
            <td className="border border-black px-2 py-1 w-1/6">с</td>
            <td className="border border-black px-2 py-1 w-1/6"></td>
            <td className="border border-black px-2 py-1 w-1/6">до</td>
            <td className="border border-black px-2 py-1 w-1/6"></td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1" colSpan={2}></td>
            <td className="border border-black px-2 py-1 bg-gray-50" colSpan={2}>контактное лицо</td>
            <td className="border border-black px-2 py-1 text-red-600" colSpan={2}>{data.loadingContact}</td>
          </tr>
        </tbody>
      </table>

      <table className="w-full border-collapse border border-black mb-3">
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1 font-semibold bg-gray-50 w-1/6">Разгрузка:</td>
            <td className="border border-black px-2 py-1 text-red-600" colSpan={5}>{data.unloadingAddress}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1">дата</td>
            <td className="border border-black px-2 py-1 text-red-600 w-1/6">{data.unloadingDate}</td>
            <td className="border border-black px-2 py-1 w-1/6">с</td>
            <td className="border border-black px-2 py-1 w-1/6"></td>
            <td className="border border-black px-2 py-1 w-1/6">до</td>
            <td className="border border-black px-2 py-1 w-1/6"></td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1" colSpan={2}></td>
            <td className="border border-black px-2 py-1 bg-gray-50" colSpan={2}>контактное лицо</td>
            <td className="border border-black px-2 py-1 text-red-600" colSpan={2}>{data.unloadingContact}</td>
          </tr>
        </tbody>
      </table>

      <table className="w-full border-collapse border border-black mb-3">
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1 font-semibold bg-gray-50 w-1/6">Оплата:</td>
            <td className="border border-black px-2 py-1 text-red-600 w-1/6">{data.price}</td>
            <td className="border border-black px-2 py-1 w-1/6">руб.</td>
            <td className="border border-black px-2 py-1 text-red-600 w-1/6">{data.paymentTerms}</td>
            <td className="border border-black px-2 py-1 text-red-600 w-1/6">{data.paymentMethod}</td>
            <td className="border border-black px-2 py-1 w-1/6">по оригиналам документов</td>
          </tr>
        </tbody>
      </table>

      <table className="w-full border-collapse border border-black mb-3">
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1 font-semibold bg-gray-50" colSpan={6}>Данные водителя:</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1 text-red-600" colSpan={3}>{data.driverName}</td>
            <td className="border border-black px-2 py-1 text-red-600" colSpan={3}>{data.driverLicense}</td>
          </tr>
          <tr>
            <td className="border border-black px-2 py-1">паспорт</td>
            <td className="border border-black px-2 py-1 text-red-600" colSpan={5}>{data.driverPassport}</td>
          </tr>
        </tbody>
      </table>

      <table className="w-full border-collapse border border-black mb-3">
        <tbody>
          <tr>
            <td className="border border-black px-2 py-1 font-semibold bg-gray-50">Данные ТС:</td>
            <td className="border border-black px-2 py-1 text-red-600">{data.vehicleNumber} {data.vehicleTrailer}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 mb-3">
        <div className="font-bold mb-2">Условия перевозки:</div>
        <div className="text-xs leading-tight space-y-1">
          <p>
            Перевозчик обязан в лице водителя-экспедитора обязан проверить правильность оформления ТоН/ТТН на погрузке. 
            Количество загруженных мест должно быть прописано в ТрН/ТТН и соответствовать количеству загруженных в ТС мест. 
            При сдаче груза грузополучателю Перевозчик в лице водителя-экспедитора, обязан в ТрН/ТТН в графе 
            «получении груза поставить время и дату сдачи груза и заверить эти данные печатью грузополучателя и 
            подписью ответственного лица».
          </p>
          <p>
            В случае опозданий на погрузку/разгрузку Перевозчик обязан своевременно сообщить об этом Заказчику. 
            Перевозчик обязан сообщать Заказчику о прибытии на погрузку/разгрузку, об убытии с места погрузки 
            разгрузки, о местонахождении груза в пути.
          </p>
          <p>
            Ставка за перевозку, указанная в Договоре-заявке является ценой за 1 kilometre пробега расходы, в том числе 
            по пропускам в связи с действующими ограничениями движения ТС по автомобильным дорогам.
          </p>
        </div>
      </div>

      <div className="mt-4 mb-3">
        <div className="font-bold mb-2">Штрафные санкции и ответственность:</div>
        <div className="text-xs leading-tight space-y-1">
          <p>Срыв погрузки/разгрузки одной из сторон влечёт за собой штраф в размере 20% от стоимости перевозки с виновной стороны.</p>
          <p>
            Перевозчик обязан доставить ТС в технически исправном состоянии, без повреждений 
            (трещин, отбитых углов, пломб, следов посторонних грузов) и отвечающее санитарным требованиям.
          </p>
          <p>За опоздание на погрузку Перевозчик оплачивает штраф в размере 500 руб. за каждый час опоздания.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-8">
        <div>
          <p className="font-bold mb-2">Заказчик:</p>
          <p className="text-xs mb-6">Общество с ограниченной ответственностью</p>
          <p className="text-xs mb-6">«ФЛАУЭР МАСТЕР»</p>
          <div className="border-b border-black mb-1"></div>
          <p className="text-center text-xs">МП</p>
        </div>
        <div>
          <p className="font-bold mb-2">Перевозчик:</p>
          <p className="text-xs mb-6">Индивидуальный предприниматель</p>
          <p className="text-xs mb-6 text-red-600">{data.carrier}</p>
          <div className="border-b border-black mb-1"></div>
          <p className="text-center text-xs">МП</p>
        </div>
      </div>
    </div>
  );
}
