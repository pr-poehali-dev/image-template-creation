interface ModalFooterProps {
  onCancel: () => void;
  onSave: () => void;
  disabled?: boolean;
}

export default function ModalFooter({ onCancel, onSave, disabled }: ModalFooterProps) {
  return (
    <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-3 border-t border-gray-200 bg-white">
      <button
        onClick={onCancel}
        disabled={disabled}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Отмена
      </button>
      <button
        onClick={onSave}
        disabled={disabled}
        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Сохранить
      </button>
    </div>
  );
}