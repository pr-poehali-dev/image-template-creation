import Icon from '../ui/icon';

interface TemplateEditorHeaderProps {
  templateName: string;
  templateDescription: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onClose: () => void;
}

export default function TemplateEditorHeader({
  templateName,
  templateDescription,
  onNameChange,
  onDescriptionChange,
  onClose
}: TemplateEditorHeaderProps) {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900">Редактор шаблона</h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <Icon name="X" size={20} className="text-gray-600" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Название шаблона</label>
          <input
            type="text"
            value={templateName}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Введите название"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Описание</label>
          <input
            type="text"
            value={templateDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Введите описание"
          />
        </div>
      </div>
      <p className="text-xs text-gray-600 mt-2">Выделите текст в PDF. Красные = не настроены, зеленые = настроены</p>
    </div>
  );
}
