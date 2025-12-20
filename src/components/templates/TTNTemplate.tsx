interface TTNTemplateProps {
  data: {
    orderNumber: string;
    orderDate: string;
    from: string;
    to: string;
    cargoType: string;
    cargoWeight: string;
    driver: string;
    vehicle: string;
    invoice: string;
  };
}

export default function TTNTemplate({ data }: TTNTemplateProps) {
  return (
    <div className="font-sans text-sm">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">ТОВАРНО-ТРАНСПОРТНАЯ НАКЛАДНАЯ</h1>
        <p className="text-gray-600">№ {data.orderNumber} от {data.orderDate}</p>
      </div>

      <table className="w-full border-collapse mb-6">
        <tbody>
          <tr>
            <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-semibold w-1/3">
              Грузоотправитель
            </td>
            <td className="border border-gray-400 px-3 py-2" colSpan={3}>
              {data.from}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-semibold">
              Грузополучатель
            </td>
            <td className="border border-gray-400 px-3 py-2" colSpan={3}>
              {data.to}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-semibold">
              Инвойс
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {data.invoice}
            </td>
            <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-semibold w-1/6">
              Вес (кг)
            </td>
            <td className="border border-gray-400 px-3 py-2">
              {data.cargoWeight}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 border-b-2 border-gray-800 pb-1">
          Характеристика груза
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 px-3 py-2 text-left">№</th>
              <th className="border border-gray-400 px-3 py-2 text-left">Наименование</th>
              <th className="border border-gray-400 px-3 py-2 text-left">Количество</th>
              <th className="border border-gray-400 px-3 py-2 text-left">Вес (кг)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-3 py-2">1</td>
              <td className="border border-gray-400 px-3 py-2">{data.cargoType}</td>
              <td className="border border-gray-400 px-3 py-2">1</td>
              <td className="border border-gray-400 px-3 py-2">{data.cargoWeight}</td>
            </tr>
            <tr className="font-semibold bg-gray-50">
              <td className="border border-gray-400 px-3 py-2" colSpan={3}>
                Итого:
              </td>
              <td className="border border-gray-400 px-3 py-2">{data.cargoWeight}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 border-b-2 border-gray-800 pb-1">
          Транспорт и водитель
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-xs mb-1">Транспортное средство</p>
            <p className="font-semibold">{data.vehicle}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs mb-1">Водитель</p>
            <p className="font-semibold">{data.driver}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-12">
        <div>
          <p className="mb-8 text-gray-700">Груз отпустил:</p>
          <div className="border-b border-gray-400 mb-1"></div>
          <p className="text-xs text-gray-500">(подпись, расшифровка)</p>
        </div>
        <div>
          <p className="mb-8 text-gray-700">Груз принял:</p>
          <div className="border-b border-gray-400 mb-1"></div>
          <p className="text-xs text-gray-500">(подпись, расшифровка)</p>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-500">
        <p>М.П.</p>
      </div>
    </div>
  );
}
