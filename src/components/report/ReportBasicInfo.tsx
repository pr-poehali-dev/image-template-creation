import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ReportFormData } from '../ReportModal';

interface ReportBasicInfoProps {
  formData: ReportFormData;
  handleChange: (field: keyof ReportFormData, value: string) => void;
}

export default function ReportBasicInfo({ formData, handleChange }: ReportBasicInfoProps) {
  return (
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
  );
}
