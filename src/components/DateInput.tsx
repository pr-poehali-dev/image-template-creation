import { useState, ChangeEvent, FocusEvent } from 'react';
import Icon from './ui/icon';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxDate?: 'today' | 'none';
  label?: string;
  required?: boolean;
  className?: string;
}

export default function DateInput({
  value,
  onChange,
  placeholder = 'ДД-ММ-ГГГГ',
  maxDate = 'none',
  label,
  required = false,
  className = ''
}: DateInputProps) {
  const [error, setError] = useState<string>('');
  const [showError, setShowError] = useState(false);

  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const getDaysInMonth = (month: number, year: number): number => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && isLeapYear(year)) return 29;
    return daysInMonth[month - 1];
  };

  const validateDate = (dateStr: string): { valid: boolean; message: string } => {
    if (!dateStr || dateStr.length < 10) {
      return { valid: false, message: 'Неполная дата' };
    }

    const parts = dateStr.split('-');
    if (parts.length !== 3) {
      return { valid: false, message: 'Неверный формат даты' };
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return { valid: false, message: 'Неверный ввод даты' };
    }

    if (year < 1900 || year > 2100) {
      return { valid: false, message: 'Год должен быть в диапазоне 1900-2100' };
    }

    if (month < 1 || month > 12) {
      return { valid: false, message: 'Месяц должен быть от 01 до 12' };
    }

    const maxDay = getDaysInMonth(month, year);
    if (day < 1 || day > maxDay) {
      return { valid: false, message: `День должен быть от 01 до ${maxDay} для ${month}-го месяца` };
    }

    if (maxDate === 'today') {
      const inputDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (inputDate > today) {
        return { valid: false, message: 'Дата не может быть больше сегодняшней' };
      }
    }

    return { valid: true, message: '' };
  };

  const formatDateInput = (input: string): string => {
    const digits = input.replace(/\D/g, '');
    
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 8)}`;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value);
    onChange(formatted);
    
    if (error) setError('');
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;

    const validation = validateDate(val);
    if (!validation.valid) {
      setError(validation.message);
      setShowError(true);
    }
  };

  const handleErrorClose = () => {
    setShowError(false);
  };

  return (
    <>
      {showError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <Icon name="AlertCircle" size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Ошибка ввода</h3>
            </div>
            
            <p className="text-gray-600 mb-6 ml-15">{error}</p>

            <div className="flex justify-end">
              <button
                onClick={handleErrorClose}
                className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            maxLength={10}
            className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-10 bg-white`}
          />
          <Icon 
            name="Calendar" 
            size={18} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
          />
        </div>
      </div>
    </>
  );
}
