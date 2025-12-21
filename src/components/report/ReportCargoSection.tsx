import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ReportFormData } from '../ReportModal';

interface ReportCargoSectionProps {
  formData: ReportFormData;
  handleChange: (field: keyof ReportFormData, value: string) => void;
}

export default function ReportCargoSection({ formData, handleChange }: ReportCargoSectionProps) {
  return (
    <>
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3 text-lg">Требуемый тип ТС и особые условия</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Тип кузова *</Label>
              <Input 
                placeholder="тип кузова" 
                value={formData.bodyType}
                onChange={(e) => handleChange('bodyType', e.target.value)}
                required 
              />
            </div>
            <div>
              <Label>Характер груза *</Label>
              <Input 
                placeholder="рефрижератор" 
                value={formData.cargoType}
                onChange={(e) => handleChange('cargoType', e.target.value)}
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Вес (т) *</Label>
                <Input 
                  placeholder="20" 
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  required 
                />
              </div>
              <div>
                <Label>Объем (м³) *</Label>
                <Input 
                  placeholder="82" 
                  value={formData.volume}
                  onChange={(e) => handleChange('volume', e.target.value)}
                  required 
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Особые условия</Label>
              <Input 
                placeholder="t режим" 
                value={formData.specialConditions}
                onChange={(e) => handleChange('specialConditions', e.target.value)}
              />
            </div>
            <div>
              <Label>Доп. условия</Label>
              <Input 
                placeholder="+ 2 град" 
                value={formData.extraConditions}
                onChange={(e) => handleChange('extraConditions', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3 text-lg">Груз</h3>
        <div>
          <Label>Наименование груза *</Label>
          <Input 
            placeholder="Луковицы" 
            value={formData.cargoName}
            onChange={(e) => handleChange('cargoName', e.target.value)}
            required 
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3 text-lg">Погрузка</h3>
        <div className="space-y-3">
          <div>
            <Label>Адрес погрузки *</Label>
            <Textarea 
              placeholder="Московская область, городской округ Люберцы, деревня Островцы, ул. Школьная 27" 
              value={formData.loadingAddress}
              onChange={(e) => handleChange('loadingAddress', e.target.value)}
              required 
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Дата погрузки *</Label>
              <Input 
                type="date"
                value={formData.loadingDate}
                onChange={(e) => handleChange('loadingDate', e.target.value)}
                required 
              />
            </div>
            <div>
              <Label>Контактное лицо *</Label>
              <Input 
                placeholder="Константин зав складом 89104355433, Артем 89035532883" 
                value={formData.loadingContact}
                onChange={(e) => handleChange('loadingContact', e.target.value)}
                required 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3 text-lg">Разгрузка</h3>
        <div className="space-y-3">
          <div>
            <Label>Адрес разгрузки *</Label>
            <Textarea 
              placeholder="г. Ижевск, Завьяловский район, д. Шабердино" 
              value={formData.unloadingAddress}
              onChange={(e) => handleChange('unloadingAddress', e.target.value)}
              required 
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Дата разгрузки *</Label>
              <Input 
                type="date"
                value={formData.unloadingDate}
                onChange={(e) => handleChange('unloadingDate', e.target.value)}
                required 
              />
            </div>
            <div>
              <Label>Контактное лицо *</Label>
              <Input 
                placeholder="Денис 89120120" 
                value={formData.unloadingContact}
                onChange={(e) => handleChange('unloadingContact', e.target.value)}
                required 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3 text-lg">Оплата</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Сумма (руб.) *</Label>
              <Input 
                placeholder="150 000" 
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                required 
              />
            </div>
            <div>
              <Label>Условия *</Label>
              <Input 
                placeholder="без НДС" 
                value={formData.paymentTerms}
                onChange={(e) => handleChange('paymentTerms', e.target.value)}
                required 
              />
            </div>
            <div>
              <Label>Срок оплаты *</Label>
              <Input 
                placeholder="5-7 б/д" 
                value={formData.paymentConditions}
                onChange={(e) => handleChange('paymentConditions', e.target.value)}
                required 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
