import React, { useState, useEffect } from 'react';
import { FarmerProfile } from '../types';
import CloseIcon from './icons/CloseIcon';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: FarmerProfile) => void;
  currentProfile: FarmerProfile;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSave, currentProfile }) => {
  const [profile, setProfile] = useState<FarmerProfile>(currentProfile);

  useEffect(() => {
    setProfile(currentProfile);
  }, [currentProfile, isOpen]);

  const handleSave = () => {
    onSave(profile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Your Farm Profile</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Close profile modal"
            >
              <CloseIcon />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Provide your farm's details for more personalized advice.
          </p>
          <div className="space-y-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location (e.g., Village, District, State)
              </label>
              <input
                type="text"
                id="location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="soilType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Soil Type
              </label>
              <select
                id="soilType"
                value={profile.soilType}
                onChange={(e) => setProfile({ ...profile, soilType: e.target.value as FarmerProfile['soilType'] })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
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
              <label htmlFor="waterAvailability" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Water Availability
              </label>
              <select
                id="waterAvailability"
                value={profile.waterAvailability}
                onChange={(e) =>
                  setProfile({ ...profile, waterAvailability: e.target.value as FarmerProfile['waterAvailability'] })
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              >
                <option value="">Select water availability</option>
                <option value="high">High (Canal, Borewell)</option>
                <option value="medium">Medium (Tank, Pond)</option>
                <option value="low">Low (Rain-fed)</option>
              </select>
            </div>
             <div>
              <label htmlFor="currentCrops" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Currently Growing Crops (comma-separated)
              </label>
              <input
                type="text"
                id="currentCrops"
                value={profile.currentCrops}
                onChange={(e) => setProfile({ ...profile, currentCrops: e.target.value })}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
