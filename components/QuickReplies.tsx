import React from 'react';
import { Reply } from '../types';

interface QuickRepliesProps {
  replies: Reply[];
  onQuickReply: (reply: string) => void;
  isLoading: boolean;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ replies, onQuickReply, isLoading }) => {
  if (!replies || replies.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-2 pb-4 flex flex-wrap gap-2 justify-start">
      {replies.map((reply, index) => (
        <button
          key={index}
          onClick={() => onQuickReply(reply.action)}
          disabled={isLoading}
          className="flex items-center px-4 py-2 text-sm font-medium text-green-200 bg-gray-700 border border-green-600 rounded-full hover:bg-gray-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {reply.icon}
          {reply.text}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;