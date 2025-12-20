interface ModalFooterProps {
  onCancel: () => void;
  onSave: () => void;
}

export default function ModalFooter({ onCancel, onSave }: ModalFooterProps) {
  return (
    <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-3 border-t border-gray-200 bg-white">
      <button
        onClick={onCancel}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
      >
        Отмена
      </button>
      <button
        onClick={onSave}
        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium"
      >
        Сохранить
      </button>
    </div>
  );
}
