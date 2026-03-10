import React from 'react';
import { Message } from '../types';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';
import PriceTrendChart from './PriceTrendChart';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start gap-4 my-2 animate-fade-in-slide-up ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white ${isUser ? 'bg-gray-500' : 'bg-green-600'}`}>
        {isUser ? <UserIcon /> : <BotIcon />}
      </div>
      <div
        className={`max-w-lg p-3 rounded-lg shadow-md ${
          isUser
            ? 'bg-green-600 text-white'
            : 'bg-gray-700 text-gray-200'
        }`}
      >
        {message.image && (
          <img src={message.image} alt="User upload" className="mb-2 rounded-lg max-w-full h-auto" />
        )}
        <div style={{ whiteSpace: 'pre-wrap' }}>
            {message.text}
        </div>
        {message.priceTrends && <PriceTrendChart data={message.priceTrends} />}
        {message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <h4 className="text-xs font-semibold mb-1 text-gray-400">Sources:</h4>
            <ul className="list-none p-0 m-0 space-y-1">
              {message.sources.map((source, index) => (
                <li key={index} className="text-xs">
                  <a
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline break-all"
                  >
                    {source.title || source.uri}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;