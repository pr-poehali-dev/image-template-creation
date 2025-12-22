import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

interface AIAssistantProps {
  onAction?: (action: string, data: any) => void;
}

const AIAssistant = ({ onAction }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      text: 'Привет! Я AI-помощник. Могу помочь с:\n\n• Поиск организации по ИНН\n• Проверка БИК банка\n• Заполнение форм контрагентов\n\nПросто отправь мне ИНН или БИК, и я помогу!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const innMatch = input.match(/\d{10,12}/);
      const bikMatch = input.match(/\d{9}/);

      let response = '';
      
      if (innMatch) {
        response = `Ищу данные по ИНН ${innMatch[0]}...\n\nЧтобы подключить автозаполнение:\n1. Добавь DADATA_API_KEY в секреты\n2. Я смогу автоматически заполнять формы`;
      } else if (bikMatch) {
        response = `Проверяю БИК ${bikMatch[0]}...\n\nДля работы нужен DaData API ключ в секретах.`;
      } else {
        response = 'Не распознал команду. Попробуй отправить ИНН (10-12 цифр) или БИК (9 цифр).';
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        text: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-line text-sm">{message.text}</p>
              <span className={`text-xs mt-1 block ${
                message.type === 'user' ? 'text-white/70' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString('ru-RU', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                <span className="text-sm text-gray-600">Думаю...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Введи ИНН или БИК..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="Send" size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Примеры: "7707083893" (ИНН), "044525225" (БИК)
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
