import React from 'react';

export interface PriceDataPoint {
  date: string;
  price: number;
}

export interface PriceTrend {
  cropName: string;
  prices: PriceDataPoint[];
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  image?: string; // data URL for display
  sources?: {
    uri: string;
    title: string;
  }[];
  priceTrends?: PriceTrend[];
}

export interface FarmerProfile {
  location: string;
  soilType: 'loamy' | 'clay' | 'sandy' | 'silty' | 'peaty' | '';
  waterAvailability: 'high' | 'medium' | 'low' | '';
  currentCrops: string;
}

export interface Reply {
  text: string;
  icon: React.ReactNode;
  action: string;
}
