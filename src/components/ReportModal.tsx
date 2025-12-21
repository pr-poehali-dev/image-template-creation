import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Icon from './ui/icon';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="FileText" size={24} />
            Создать отчет по договору-заявке
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Номер договора *</Label>
              <Input placeholder="2112ФМ-1" required />
            </div>
            <div>
              <Label>Дата *</Label>
              <Input type="date" required />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Заказчик</h3>
            <div className="space-y-3">
              <div>
                <Label>Наименование *</Label>
                <Input placeholder="ООО «ФЛАУЭР МАСТЕР»" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ИНН *</Label>
                  <Input placeholder="7724449594" required />
                </div>
                <div>
                  <Label>КПП</Label>
                  <Input placeholder="772201001" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Перевозчик</h3>
            <div className="space-y-3">
              <div>
                <Label>Наименование *</Label>
                <Input placeholder="ООО «Везет 56»" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ИНН *</Label>
                  <Input placeholder="5609087575" required />
                </div>
                <div>
                  <Label>КПП</Label>
                  <Input placeholder="560901001" />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Груз и транспорт</h3>
            <div className="space-y-3">
              <div>
                <Label>Наименование груза *</Label>
                <Input placeholder="Луковицы" required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Вес (тонн) *</Label>
                  <Input type="number" placeholder="20" required />
                </div>
                <div>
                  <Label>Объем (м³) *</Label>
                  <Input type="number" placeholder="82" required />
                </div>
                <div>
                  <Label>Тип кузова *</Label>
                  <Input placeholder="рефрижератор" required />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Маршрут</h3>
            <div className="space-y-3">
              <div>
                <Label>Погрузка *</Label>
                <Input placeholder="г. Казань, РТ, Пестречинский район..." required />
              </div>
              <div>
                <Label>Дата погрузки *</Label>
                <Input type="date" required />
              </div>
              <div>
                <Label>Разгрузка *</Label>
                <Input placeholder="Московская обл., г.о. Люберцы..." required />
              </div>
              <div>
                <Label>Дата разгрузки *</Label>
                <Input type="date" required />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Оплата</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Сумма (руб.) *</Label>
                <Input type="number" placeholder="150000" required />
              </div>
              <div>
                <Label>Условия оплаты *</Label>
                <Input placeholder="с НДС, 5-7 б/д" required />
              </div>
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
              Сохранить отчет
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
