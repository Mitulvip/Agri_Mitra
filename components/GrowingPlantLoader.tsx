import React from 'react';
import BotIcon from './icons/BotIcon';

const GrowingPlantLoader: React.FC = () => (
  <div className="flex items-start gap-4 p-4 animate-fade-in-slide-up">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
      <BotIcon />
    </div>
    <div className="max-w-xl p-4 rounded-lg shadow-md bg-gray-700 text-gray-200">
      <div className="flex items-center space-x-3">
        <svg width="50" height="40" viewBox="0 0 50 40" className="text-green-400">
          <path d="M 5 35 H 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path className="stem" d="M 25 35 V 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path className="leaf" d="M 25 25 C 15 20, 15 15, 25 15" stroke="currentColor" strokeWidth="2" fill="none" />
          <path className="leaf" style={{ animationDelay: '0.2s' }} d="M 25 25 C 35 20, 35 15, 25 15" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
        <span className="text-gray-300 animate-pulse text-sm font-medium">Analyzing...</span>
      </div>
    </div>
  </div>
);

export default GrowingPlantLoader;
