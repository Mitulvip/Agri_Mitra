import React, { useState, useRef } from 'react';
import MicIcon from './icons/MicIcon';
import SendIcon from './icons/SendIcon';
import PaperclipIcon from './icons/PaperclipIcon';
import CloseIcon from './icons/CloseIcon';

interface ChatInputProps {
  onSendMessage: (message: string, image?: { base64: string; mimeType: string, dataUrl: string }) => void;
  onToggleVoice: () => void;
  isLoading: boolean;
  isListening: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onToggleVoice, isLoading, isListening }) => {
  const [inputValue, setInputValue] = useState('');
  const [image, setImage] = useState<{ file: File; base64: string; mimeType: string; dataUrl: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (inputValue.trim() || image) {
      onSendMessage(inputValue, image ?? undefined);
      setInputValue('');
      setImage(null);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',')[1];
        setImage({ file, base64, mimeType: file.type, dataUrl });
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSend();
    }
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm border-t border-gray-700">
        <div className="max-w-4xl mx-auto p-4">
            {image && (
                <div className="relative inline-block mb-2">
                    <img src={image.dataUrl} alt="Selected crop" className="h-20 w-20 object-cover rounded-md border border-gray-300" />
                    <button 
                        onClick={() => setImage(null)} 
                        className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full p-0.5 hover:bg-gray-900"
                        aria-label="Remove image"
                    >
                        <CloseIcon />
                    </button>
                </div>
            )}
            <div className="flex items-center gap-2 md:gap-4">
                <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                />
                <button
                    // FIX: Corrected typo from `fileInput_current` to `fileInputRef.current`.
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-500 hover:text-green-400 transition-colors"
                    disabled={isLoading || isListening}
                    aria-label="Attach image"
                >
                    <PaperclipIcon />
                </button>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message or use the mic..."
                className="flex-grow p-3 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white transition"
                disabled={isLoading || isListening}
            />
            <button
                onClick={onToggleVoice}
                className={`p-2 rounded-full transition-colors ${
                isListening ? 'text-white bg-red-500' : 'text-gray-500 hover:text-green-400'
                }`}
                disabled={isLoading || !!image}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
                <MicIcon isListening={isListening} />
            </button>
            <button
                onClick={handleSend}
                disabled={(!inputValue.trim() && !image) || isLoading || isListening}
                className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
            >
                <SendIcon />
            </button>
            </div>
        </div>
    </div>
  );
};

export default ChatInput;