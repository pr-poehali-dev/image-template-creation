import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from './ui/icon';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (report: ReportFormData) => void;
}

export interface ReportFormData {
  number: string;
  date: string;
  
  customerName: string;
  customerInn: string;
  customerOgrn: string;
  customerAddress: string;
  customerOkpo: string;
  customerOkvd: string;
  customerAccount: string;
  customerBank: string;
  customerBik: string;
  customerCorAccount: string;
  customerDirector: string;
  
  carrierName: string;
  carrierInn: string;
  carrierOgrn: string;
  carrierAccount: string;
  carrierBank: string;
  carrierAddress: string;
  carrierEmail: string;
  
  cargoType: string;
  bodyType: string;
  weight: string;
  volume: string;
  specialConditions: string;
  extraConditions: string;
  
  cargoName: string;
  
  loadingAddress: string;
  loadingDate: string;
  loadingContact: string;
  
  unloadingAddress: string;
  unloadingDate: string;
  unloadingContact: string;
  
  amount: string;
  paymentTerms: string;
  paymentConditions: string;
  
  driverName: string;
  driverPassport: string;
  driverLicense: string;
  
  vehicleModel: string;
  vehicleNumber: string;
  trailerNumber: string;
  
  transportConditions: string;
}

export default function ReportModal({ isOpen, onClose, onSave }: ReportModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ReportFormData>({
    number: '',
    date: '',
    customerName: '',
    customerInn: '',
    customerOgrn: '',
    customerAddress: '',
    customerOkpo: '',
    customerOkvd: '',
    customerAccount: '',
    customerBank: '',
    customerBik: '',
    customerCorAccount: '',
    customerDirector: '',
    carrierName: '',
    carrierInn: '',
    carrierOgrn: '',
    carrierAccount: '',
    carrierBank: '',
    carrierAddress: '',
    carrierEmail: '',
    cargoType: '',
    bodyType: '',
    weight: '',
    volume: '',
    specialConditions: '',
    extraConditions: '',
    cargoName: '',
    loadingAddress: '',
    loadingDate: '',
    loadingContact: '',
    unloadingAddress: '',
    unloadingDate: '',
    unloadingContact: '',
    amount: '',
    paymentTerms: '',
    paymentConditions: '',
    driverName: '',
    driverPassport: '',
    driverLicense: '',
    vehicleModel: '',
    vehicleNumber: '',
    trailerNumber: '',
    transportConditions: ''
  });

  const handleChange = (field: keyof ReportFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const convertDateFormat = (dateStr: string) => {
    if (!dateStr) return '';
    const match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (match) {
      return `${match[3]}-${match[2]}-${match[1]}`;
    }
    return dateStr;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Пожалуйста, загрузите PDF файл');
      return;
    }

    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        const base64Data = base64.split(',')[1];

        const response = await fetch('https://functions.poehali.dev/8eb81581-d997-4368-abcd-924530939855', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file: base64Data })
        });

        const result = await response.json();
        
        if (result.success && result.data) {
          setFormData({
            number: result.data.number || '',
            date: convertDateFormat(result.data.date) || '',
            customerName: result.data.customerName || '',
            customerInn: result.data.customerInn || '',
            customerOgrn: result.data.customerOgrn || '',
            customerAddress: result.data.customerAddress || '',
            customerOkpo: result.data.customerOkpo || '',
            customerOkvd: result.data.customerOkvd || '',
            customerAccount: result.data.customerAccount || '',
            customerBank: result.data.customerBank || '',
            customerBik: result.data.customerBik || '',
            customerCorAccount: result.data.customerCorAccount || '',
            customerDirector: result.data.customerDirector || '',
            carrierName: result.data.carrierName || '',
            carrierInn: result.data.carrierInn || '',
            carrierOgrn: result.data.carrierOgrn || '',
            carrierAccount: result.data.carrierAccount || '',
            carrierBank: result.data.carrierBank || '',
            carrierAddress: result.data.carrierAddress || '',
            carrierEmail: result.data.carrierEmail || '',
            cargoType: result.data.cargoType || '',
            bodyType: result.data.bodyType || '',
            weight: result.data.weight || '',
            volume: result.data.volume || '',
            specialConditions: result.data.specialConditions || '',
            extraConditions: result.data.extraConditions || '',
            cargoName: result.data.cargoName || '',
            loadingAddress: result.data.loadingAddress || '',
            loadingDate: convertDateFormat(result.data.loadingDate) || '',
            loadingContact: result.data.loadingContact || '',
            unloadingAddress: result.data.unloadingAddress || '',
            unloadingDate: convertDateFormat(result.data.unloadingDate) || '',
            unloadingContact: result.data.unloadingContact || '',
            amount: result.data.amount || '',
            paymentTerms: result.data.paymentTerms || '',
            paymentConditions: result.data.paymentConditions || '',
            driverName: result.data.driverName || '',
            driverPassport: result.data.driverPassport || '',
            driverLicense: result.data.driverLicense || '',
            vehicleModel: result.data.vehicleModel || '',
            vehicleNumber: result.data.vehicleNumber || '',
            trailerNumber: result.data.trailerNumber || '',
            transportConditions: result.data.transportConditions || ''
          });
        } else {
          alert('Не удалось распознать данные из PDF');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Ошибка загрузки PDF:', error);
      alert('Ошибка при загрузке файла');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="FileText" size={24} />
              Создать договор-заявку
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Загрузить PDF для автозаполнения"
            >
              <Icon name="Upload" size={16} />
              {isLoading ? 'Загрузка...' : 'Загрузить PDF'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Номер договора-заявки *</Label>
              <Input 
                placeholder="2012ФМ-1" 
                value={formData.number}
                onChange={(e) => handleChange('number', e.target.value)}
                required 
              />
            </div>
            <div>
              <Label>Дата *</Label>
              <Input 
                type="date" 
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required 
              />
            </div>
          </div>

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

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Сохранить договор-заявку
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}