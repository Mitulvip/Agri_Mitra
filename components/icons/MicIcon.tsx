
import React from 'react';

interface MicIconProps {
  isListening: boolean;
}

const MicIcon: React.FC<MicIconProps> = ({ isListening }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-6 h-6 transition-colors duration-300 ${isListening ? 'text-red-500' : 'text-gray-500'}`}
  >
    {isListening && (
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    )}
    <path
      d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z"
      style={isListening ? { filter: 'url(#glow)' } : {}}
    />
    <path d="M6 15a1.5 1.5 0 00-1.5 1.5v.062a8.25 8.25 0 0015 0v-.062a1.5 1.5 0 00-1.5-1.5h-12z" />
  </svg>
);

export default MicIcon;
