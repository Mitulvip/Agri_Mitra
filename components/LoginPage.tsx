
import React, { useState, useEffect } from 'react';
import { FarmerProfile } from '../types';
import LogoIcon from './icons/LogoIcon';

interface LoginPageProps {
  onSave: (profile: FarmerProfile) => void;
  currentProfile: FarmerProfile;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSave, currentProfile }) => {
  const [profile, setProfile] = useState<FarmerProfile>(currentProfile);

  useEffect(() => {
    setProfile(currentProfile);
  }, [currentProfile]);

  const handleSave = () => {
    // Basic validation could be added here to ensure fields aren't empty
    onSave(profile);
  };

  return (
    <div className="min-h-screen bg-texture flex items-center justify-center p-4 font-sans">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-block text-green-400">
              <LogoIcon />
            </div>
            <h2 className="text-2xl font-bold text-white mt-2">Set Up Your Farm Profile</h2>
            <p className="text-sm text-gray-400 mt-1">
              Provide your details for personalized advice.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300">
                Location (e.g., Village, District, State)
              </label>
              <input
                type="text"
                id="location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="soilType" className="block text-sm font-medium text-gray-300">
                Soil Type
              </label>
              <select
                id="soilType"
                value={profile.soilType}
                onChange={(e) => setProfile({ ...profile, soilType: e.target.value as FarmerProfile['soilType'] })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              >
                <option value="">Select a soil type</option>
                <option value="loamy">Loamy</option>
                <option value="clay">Clay</option>
                <option value="sandy">Sandy</option>
                <option value="silty">Silty</option>
                <option value="peaty">Peaty</option>
              </select>
            </div>
            <div>
              <label htmlFor="waterAvailability" className="block text-sm font-medium text-gray-300">
                Water Availability
              </label>
              <select
                id="waterAvailability"
                value={profile.waterAvailability}
                onChange={(e) =>
                  setProfile({ ...profile, waterAvailability: e.target.value as FarmerProfile['waterAvailability'] })
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              >
                <option value="">Select water availability</option>
                <option value="high">High (Canal, Borewell)</option>
                <option value="medium">Medium (Tank, Pond)</option>
                <option value="low">Low (Rain-fed)</option>
              </select>
            </div>
            <div>
              <label htmlFor="currentCrops" className="block text-sm font-medium text-gray-300">
                Currently Growing Crops (comma-separated)
              </label>
              <input
                type="text"
                id="currentCrops"
                value={profile.currentCrops}
                onChange={(e) => setProfile({ ...profile, currentCrops: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          <div className="mt-8">
            <button
              onClick={handleSave}
              className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Start Chatting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;