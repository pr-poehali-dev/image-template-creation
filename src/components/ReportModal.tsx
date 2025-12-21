import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from './ui/icon';
import ReportBasicInfo from './report/ReportBasicInfo';
import ReportPartySection from './report/ReportPartySection';
import ReportCargoSection from './report/ReportCargoSection';
import ReportDriverSection from './report/ReportDriverSection';

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
          <ReportBasicInfo formData={formData} handleChange={handleChange} />
          <ReportPartySection formData={formData} handleChange={handleChange} />
          <ReportCargoSection formData={formData} handleChange={handleChange} />
          <ReportDriverSection formData={formData} handleChange={handleChange} />

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
