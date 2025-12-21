import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ReportFormData } from '../ReportModal';

interface ReportPartySectionProps {
  formData: ReportFormData;
  handleChange: (field: keyof ReportFormData, value: string) => void;
}

export default function ReportPartySection({ formData, handleChange }: ReportPartySectionProps) {
  return (
    <>
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3 text-lg">Заказчик</h3>
        <div className="space-y-3">
          <div>
            <Label>Наименование *</Label>
            <Input 
              placeholder="ООО «ФЛАУЭР МАСТЕР»" 
              value={formData.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              required 
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>ИНН *</Label>
              <Input 
                placeholder="7724449594" 
                value={formData.customerInn}
                onChange={(e) => handleChange('customerInn', e.target.value)}
                required 
              />
            </div>
            <div>
              <Label>ОГРН *</Label>
              <Input 
                placeholder="1187746741566" 
                value={formData.customerOgrn}
                onChange={(e) => handleChange('customerOgrn', e.target.value)}
                required 
              />
            </div>
            <div>
              <Label>ОКПО</Label>
              <Input 
                placeholder="3237051" 
                value={formData.customerOkpo}
                onChange={(e) => handleChange('customerOkpo', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label>Юридический адрес *</Label>
            <Input 
              placeholder="11024, Город Москва, вн.тер. г. Муниципальный Округ Якиманка..." 
              value={formData.customerAddress}
              onChange={(e) => handleChange('customerAddress', e.target.value)}
              required 
            />
          </div>
          <div>
            <Label>ОКВД</Label>
            <Input 
              placeholder="46.22" 
              value={formData.customerOkvd}
              onChange={(e) => handleChange('customerOkvd', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Расчетный счет *</Label>
              <Input 
                placeholder="40702810600010002373" 
                value={formData.customerAccount}
                onChange={(e) => handleChange('customerAccount', e.target.value)}
                required 
              />
            </div>
            <div>
              <Label>БИК банка *</Label>
              <Input 
                placeholder="044525273" 
                value={formData.customerBik}
                onChange={(e) => handleChange('customerBik', e.target.value)}
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Наименование банка *</Label>
              <Input 
                placeholder='АО "ТелеПорт Банк" г. Москва' 
                value={formData.customerBank}
                onChange={(e) => handleChange('customerBank', e.target.value)}
                required 
              />
            </div>
            <div>
              <Label>Корр. счет *</Label>
              <Input 
                placeholder="30101810545250000273" 
                value={formData.customerCorAccount}
                onChange={(e) => handleChange('customerCorAccount', e.target.value)}
                required 
              />
            </div>
          </div>
          <div>
            <Label>Генеральный директор *</Label>
            <Input 
              placeholder="Знаменский М.А" 
              value={formData.customerDirector}
              onChange={(e) => handleChange('customerDirector', e.target.value)}
              required 
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3 text-lg">Перевозчик</h3>
        <div className="space-y-3">
          <div>
            <Label>Наименование / ФИО *</Label>
            <Input 
              placeholder="ИП СЕМИОНОВ ИГОРЬ ГЕННАДЬЕВИЧ" 
              value={formData.carrierName}
              onChange={(e) => handleChange('carrierName', e.target.value)}
              required 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>ИНН *</Label>
              <Input 
                placeholder="560993629160" 
                value={formData.carrierInn}
                onChange={(e) => handleChange('carrierInn', e.target.value)}
                required 
              />
            </div>
            <div>
              <Label>ОГРНИП *</Label>
              <Input 
                placeholder="ОГРНИП N8623 СБЕРБАНКА РОССИИ Г. ОРЕНБУРГ" 
                value={formData.carrierOgrn}
                onChange={(e) => handleChange('carrierOgrn', e.target.value)}
                required 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Расчетный счет *</Label>
              <Input 
                placeholder="40802.810.5.46000024045" 
                value={formData.carrierAccount}
                onChange={(e) => handleChange('carrierAccount', e.target.value)}
                required 
              />
            </div>
            <div>
              <Label>Наименование банка *</Label>
              <Input 
                placeholder="БИК 045354601" 
                value={formData.carrierBank}
                onChange={(e) => handleChange('carrierBank', e.target.value)}
                required 
              />
            </div>
          </div>
          <div>
            <Label>Адрес *</Label>
            <Input 
              placeholder="юр. адрес 460044, г.Оренбург, ул. Конституции СССР, д. 5, кв. 22..." 
              value={formData.carrierAddress}
              onChange={(e) => handleChange('carrierAddress', e.target.value)}
              required 
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input 
              type="email"
              placeholder="vezet56@mail.ru" 
              value={formData.carrierEmail}
              onChange={(e) => handleChange('carrierEmail', e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
