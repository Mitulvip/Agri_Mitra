
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onSignUp: () => void;
}

const PlantVisual: React.FC = () => (
    <svg className="w-full h-full text-green-400" viewBox="0 0 100 100" >
      {/* Soil */}
      <path d="M 0 90 Q 50 80, 100 90 L 100 100 L 0 100 Z" fill="currentColor" opacity="0.2" />
      
      {/* Stem */}
      <path d="M 50 90 V 40" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Leaves */}
      <path d="M 50 60 C 40 50, 40 40, 50 40" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 50 60 C 60 50, 60 40, 50 40" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      
      <path d="M 50 75 C 30 65, 30 50, 50 50" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 50 75 C 70 65, 70 50, 50 50" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
)

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onSignUp }) => {
  return (
    <div className="min-h-screen bg-texture flex flex-col font-sans text-gray-200">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-6 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold text-green-300">
                Kisan Mitra
            </div>
            <nav className="hidden md:flex items-center gap-4">
                <button onClick={onLogin} className="font-semibold hover:text-green-300 transition-colors">
                    Login
                </button>
                <button onClick={onSignUp} className="px-5 py-2 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                    Sign Up
                </button>
            </nav>
          </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          {/* Left Side: Text and CTA */}
          <div className="text-center md:text-left animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Welcome to <span className="text-green-600">Kisan Mitra</span>
            </h1>
            <p className="mt-4 text-lg text-gray-300 max-w-lg mx-auto md:mx-0">
              Your AI companion for modern farming. Get instant advice on crops, weather, and market prices.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-green-600 text-white font-bold rounded-full text-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg"
              >
                Get Started Now
              </button>
            </div>
          </div>

          {/* Right Side: Visual Element */}
          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-96 h-96">
                <div className="absolute inset-0 bg-green-900/30 rounded-full blur-2xl"></div>
                <div className="relative w-full h-full p-8">
                   <PlantVisual />
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
