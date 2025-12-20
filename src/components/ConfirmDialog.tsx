import Icon from './ui/icon';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Да',
  cancelText = 'Нет',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Icon name="AlertTriangle" size={24} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
          
          <p className="text-gray-600 mb-6 ml-15">{message}</p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
