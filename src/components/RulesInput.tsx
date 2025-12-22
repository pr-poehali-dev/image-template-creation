import { useState, ChangeEvent, FocusEvent } from 'react';
import Icon from './ui/icon';

type InputType = 'date' | 'text';

interface RulesInputProps {
  type: InputType;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxDate?: 'today' | 'none';
  label?: string;
  required?: boolean;
  className?: string;
  iconName?: string;
}

export default function RulesInput({
  type,
  value,
  onChange,
  placeholder = '',
  maxDate = 'none',
  label,
  required = false,
  className = '',
  iconName
}: RulesInputProps) {
  const [error, setError] = useState<string>('');

  const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const getDaysInMonth = (month: number, year: number): number => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && isLeapYear(year)) return 29;
    return daysInMonth[month - 1];
  };

  const validateAndFixDate = (dateStr: string): string => {
    if (!dateStr || dateStr.length < 10) {
      return dateStr;
    }

    const parts = dateStr.split('-');
    if (parts.length !== 3) {
      return dateStr;
    }

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      return dateStr;
    }

    if (year < 1900 || year > 2100) {
      setError('Год должен быть в диапазоне 1900-2100');
      return '';
    }

    if (month < 1 || month > 12) {
      setError('Месяц должен быть от 01 до 12');
      return parts[0] + '---' + parts[2];
    }

    const maxDay = getDaysInMonth(month, year);
    if (day < 1 || day > maxDay) {
      setError(`В ${month}-м месяце ${year} года максимум ${maxDay} дней`);
      return '';
    }

    if (maxDate === 'today') {
      const inputDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      
      if (inputDate > today) {
        setError('Дата не может быть больше сегодняшней');
        return '';
      }
    }

    setError('');
    return dateStr;
  };

  const formatDateInput = (input: string, currentValue: string): string => {
    const digits = input.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    
    if (digits.length <= 2) {
      const day = parseInt(digits, 10);
      if (day > 31) {
        setError('День не может быть больше 31');
        return '';
      }
      return digits;
    }
    
    if (digits.length <= 4) {
      const day = parseInt(digits.slice(0, 2), 10);
      const month = parseInt(digits.slice(2), 10);
      
      if (day > 31) {
        setError('День не может быть больше 31');
        return '';
      }
      
      if (digits.length === 4 && month > 12) {
        setError('Месяц не может быть больше 12');
        const parts = currentValue.split('-');
        return parts[0] ? parts[0] + '-' : '';
      }
      
      return `${digits.slice(0, 2)}-${digits.slice(2)}`;
    }
    
    const formatted = `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 8)}`;
    
    if (digits.length === 8) {
      return validateAndFixDate(formatted);
    }
    
    return formatted;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (type === 'date') {
      newValue = formatDateInput(newValue, value);
    }

    onChange(newValue);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) {
      setError('');
      return;
    }

    if (type === 'date' && val.length === 10) {
      const validated = validateAndFixDate(val);
      if (validated !== val) {
        onChange(validated);
      }
    }
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    if (type === 'date') return 'ДД-ММ-ГГГГ';
    return '';
  };

  const getMaxLength = () => {
    if (type === 'date') return 10;
    return undefined;
  };

  const getIcon = () => {
    if (iconName) return iconName;
    if (type === 'date') return 'Calendar';
    return null;
  };

  const icon = getIcon();

  return (
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
          placeholder={getPlaceholder()}
          maxLength={getMaxLength()}
          className={`w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${icon ? 'pr-10' : ''} bg-white`}
        />
        {icon && (
          <Icon 
            name={icon} 
            size={18} 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
          />
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
