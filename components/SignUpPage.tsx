
import React, { useState } from 'react';
import LogoIcon from './icons/LogoIcon';

interface SignUpPageProps {
  onSignUpSuccess: () => void;
  onNavigateToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUpSuccess, onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSignUp = () => {
    // Basic validation
    if (email.trim() && phone.trim()) {
      // In a real app, you'd make an API call here.
      console.log('Signing up with:', { email, phone });
      onSignUpSuccess();
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="min-h-screen bg-texture flex items-center justify-center p-4 font-sans">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-block text-green-400">
              <LogoIcon />
            </div>
            <h2 className="text-2xl font-bold text-white mt-2">Create an Account</h2>
            <p className="text-sm text-gray-400 mt-1">
              Join Kisan Mitra to get started.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>
          <div className="mt-8">
            <button
              onClick={handleSignUp}
              className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Sign Up
            </button>
          </div>
          <div className="text-center mt-4">
             <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <button onClick={onNavigateToLogin} className="font-medium text-green-400 hover:underline">
                    Login
                </button>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
