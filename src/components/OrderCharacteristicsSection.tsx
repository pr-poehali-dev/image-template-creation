import Icon from './ui/icon';
import RulesInput from './RulesInput';

interface OrderCharacteristicsSectionProps {
  orderZone: string;
  setOrderZone: (value: string) => void;
  orderNumber: string;
  setOrderNumber: (value: string) => void;
  orderDate: string;
  setOrderDate: (value: string) => void;
  invoice: string;
  setInvoice: (value: string) => void;
  track: string;
  setTrack: (value: string) => void;
  cargoType: string;
  setCargoType: (value: string) => void;
  cargoWeight: string;
  setCargoWeight: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
  files: File[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function OrderCharacteristicsSection({
  orderZone,
  setOrderZone,
  orderNumber,
  setOrderNumber,
  orderDate,
  setOrderDate,
  invoice,
  setInvoice,
  track,
  setTrack,
  cargoType,
  setCargoType,
  cargoWeight,
  setCargoWeight,
  note,
  setNote,
  files,
  handleFileChange
}: OrderCharacteristicsSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="FileText" size={20} className="text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Характеристика заказа</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-2">
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Зона <span className="text-red-600">*</span>
              </label>
              <select
                value={orderZone}
                onChange={(e) => setOrderZone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="EU">EU</option>
                <option value="RU">RU</option>
                <option value="CH">CH</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                № заказа <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="001"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <RulesInput
            type="date"
            value={orderDate}
            onChange={setOrderDate}
            label="Дата заказа"
            maxDate="today"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Инвойс <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="INV-12345"
              value={invoice}
              onChange={(e) => setInvoice(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Трак <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="TRK-67890"
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Характер груза <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Лук, Нобилис"
              value={cargoType}
              onChange={(e) => setCargoType(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Вес груза (кг) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              placeholder="20000"
              value={cargoWeight}
              onChange={(e) => setCargoWeight(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Примечание</label>
          <textarea
            placeholder="Дополнительная информация о заказе..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={1}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y min-h-[42px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Прикрепить файлы (накладные, заявки)
          </label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary/90"
          />
          {files.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Выбрано файлов: {files.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
