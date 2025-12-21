import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ReportFormData } from '../ReportModal';

interface ReportDriverSectionProps {
  formData: ReportFormData;
  handleChange: (field: keyof ReportFormData, value: string) => void;
}

export default function ReportDriverSection({ formData, handleChange }: ReportDriverSectionProps) {
  return (
    <>
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3 text-lg">Данные водителя</h3>
        <div className="space-y-3">
          <div>
            <Label>ФИО водителя *</Label>
            <Input 
              placeholder="Шильков Алексей Леонидович" 
              value={formData.driverName}
              onChange={(e) => handleChange('driverName', e.target.value)}
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Паспорт *</Label>
              <Textarea 
                placeholder="9421 № 975426 выдан 03.02.2022г , МВД по Удмуртской Республике код подразделения 180-010" 
                value={formData.driverPassport}
                onChange={(e) => handleChange('driverPassport', e.target.value)}
                required 
                rows={2}
              />
            </div>
            <div>
              <Label>ВУ *</Label>
              <Input 
                placeholder="ВУ 9940 381012    89120266424" 
                value={formData.driverLicense}
                onChange={(e) => handleChange('driverLicense', e.target.value)}
                required 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3 text-lg">Данные ТС</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Марка автомобиля *</Label>
              <Input 
                placeholder="Вольво H777AP/18" 
                value={formData.vehicleModel}
                onChange={(e) => handleChange('vehicleModel', e.target.value)}
                required 
              />
            </div>
            <div>
              <Label>Гос. номер *</Label>
              <Input 
                placeholder="H777AP/18" 
                value={formData.vehicleNumber}
                onChange={(e) => handleChange('vehicleNumber', e.target.value)}
                required 
              />
            </div>
            <div>
              <Label>Прицеп</Label>
              <Input 
                placeholder="АО0714/18" 
                value={formData.trailerNumber}
                onChange={(e) => handleChange('trailerNumber', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3 text-lg">Условия перевозки</h3>
        <div>
          <Textarea 
            placeholder="Перевозчик и/или лицо водителя-экспедитора обязан проверить правильность оформления ТоН/ТТН на погрузке..." 
            value={formData.transportConditions}
            onChange={(e) => handleChange('transportConditions', e.target.value)}
            rows={4}
          />
        </div>
      </div>
    </>
  );
}
