
import React, { useState, useEffect, useRef } from 'react';
// FIX: The 'LiveSession' type is not exported from '@google/genai'.
import { GoogleGenAI, LiveServerMessage, Modality, Type } from '@google/genai';
import { Message, FarmerProfile, Reply, PriceTrend } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import QuickReplies from './components/QuickReplies';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import LogoIcon from './components/icons/LogoIcon';
import WeatherIcon from './components/icons/WeatherIcon';
import PlantIcon from './components/icons/PlantIcon';
import SchemeIcon from './components/icons/SchemeIcon';
import CameraIcon from './components/icons/CameraIcon';
import CalendarIcon from './components/icons/CalendarIcon';
import PriceIcon from './components/icons/PriceIcon';
import AlertIcon from './components/icons/AlertIcon';
import BotIcon from './components/icons/BotIcon';
import SoilIcon from './components/icons/SoilIcon';
import WaterIcon from './components/icons/WaterIcon';
import PestIcon from './components/icons/PestIcon';
import CompareIcon from './components/icons/CompareIcon';
import { createPcmBlob, decode, decodeAudioData } from './utils/audioUtils';
import GrowingPlantLoader from './components/GrowingPlantLoader';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'login' | 'chat' | 'signup'>('landing');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile>({
    location: 'Maharashtra, India',
    soilType: 'loamy',
    waterAvailability: 'medium',
    currentCrops: 'Cotton, Sugarcane',
  });
  const [contextualReplies, setContextualReplies] = useState<Reply[]>([]);

  // FIX: The 'LiveSession' type is not exported from '@google/genai'. Using 'any' as a workaround.
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 'init',
        sender: 'bot',
        text: "Hello! I am your personal farm assistant. How can I help you today? You can ask me about crop management, weather, government schemes, or anything else. Don't forget to fill out your profile for tailored advice!",
      },
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const constructSystemInstruction = () => {
    let instruction = "You are an expert agricultural assistant for farmers in India. Provide concise, actionable advice. ";
    if (farmerProfile.location) instruction += `The farm is located in ${farmerProfile.location}. `;
    if (farmerProfile.soilType) instruction += `The soil is ${farmerProfile.soilType}. `;
    if (farmerProfile.waterAvailability) instruction += `Water availability is ${farmerProfile.waterAvailability}. `;
    if (farmerProfile.currentCrops) instruction += `Current crops are ${farmerProfile.currentCrops}. `;
    return instruction + "Always answer in a helpful and supportive tone.";
  };

  const handleSendMessage = async (message: string, image?: { base64: string; mimeType: string; dataUrl: string }) => {
    if (!message.trim() && !image) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
      image: image?.dataUrl,
    };
    setMessages((prev) => [...prev, userMessage]);
    setContextualReplies([]); // Clear previous contextual replies
    setIsLoading(true);

    try {
      const parts: any[] = [];
      if (image) {
        parts.push({ inlineData: { data: image.base64, mimeType: image.mimeType } });
      }
      parts.push({ text: message });

      const isWeatherQuery = /weather|forecast|temperature|rain|humidity/i.test(message);
      const isMarketPriceQuery = /market prices|mandi rates|crop prices/i.test(message);
      
      const config: any = {
        systemInstruction: constructSystemInstruction(),
      };

      if (isWeatherQuery && !image) {
          config.tools = [{googleSearch: {}}];
      } else if (isMarketPriceQuery && !image) {
        config.responseMimeType = "application/json";
        config.responseSchema = {
            type: Type.OBJECT,
            properties: {
              summary: { 
                type: Type.STRING, 
                description: "A textual summary of the market prices and trends for the farmer's crops. Mention the current prices clearly." 
              },
              trends: {
                type: Type.ARRAY,
                description: "An array of historical price data for each of the farmer's current crops.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    cropName: { 
                      type: Type.STRING,
                      description: "The name of the crop."
                    },
                    prices: {
                      type: Type.ARRAY,
                      description: "An array of price data points for the last 30 days.",
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          date: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
                          price: { type: Type.NUMBER, description: "Price per quintal in INR" }
                        },
                        required: ['date', 'price']
                      }
                    }
                  },
                  required: ['cropName', 'prices']
                }
              }
            },
            required: ['summary', 'trends']
        };
      }
      
      const response = await ai.models.generateContent({
        model: image ? 'gemini-2.5-flash-image' : 'gemini-2.5-flash',
        contents: { parts },
        config: config
      });
      
      if (isMarketPriceQuery && !image) {
        try {
            const jsonResponse = JSON.parse(response.text);
            const botMessage: Message = {
                id: Date.now().toString() + '-bot',
                sender: 'bot',
                text: jsonResponse.summary,
                priceTrends: jsonResponse.trends as PriceTrend[],
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (e) {
            console.error("Failed to parse JSON response for market prices:", e);
            const botMessage: Message = {
                id: Date.now().toString() + '-bot',
                sender: 'bot',
                text: "I found some information on market prices, but couldn't generate the trend chart. Here is the text:\n\n" + response.text,
            };
            setMessages((prev) => [...prev, botMessage]);
        }
      } else {
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const sources = groundingChunks
          ?.filter((chunk: any) => chunk.web)
          .map((chunk: any) => ({
              uri: chunk.web.uri,
              title: chunk.web.title,
          }));

        const botMessage: Message = {
          id: Date.now().toString() + '-bot',
          sender: 'bot',
          text: response.text,
          sources: sources,
        };
        setMessages((prev) => [...prev, botMessage]);
      }

      if (message === 'What crops should I plant next season?') {
        setContextualReplies([
            { text: 'Soil Needs', icon: <SoilIcon />, action: 'What are the optimal soil conditions for the suggested crops?' },
            { text: 'Water Needs', icon: <WaterIcon />, action: 'What are the water requirements for the suggested crops?' },
            { text: 'Common Pests', icon: <PestIcon />, action: 'What are some common pests for the suggested crops?' },
            { text: 'Compare Them', icon: <CompareIcon />, action: 'Can you compare the pros and cons of these suggestions?' },
        ]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const stopListening = async () => {
    setIsListening(false);
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then((session) => session.close());
      sessionPromiseRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
      mediaStreamSourceRef.current = null;
    }
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    audioSourcesRef.current.forEach(source => source.stop());
    audioSourcesRef.current.clear();
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
        outputAudioContextRef.current.close();
        outputAudioContextRef.current = null;
    }
  };

  const startListening = async () => {
    setIsListening(true);
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!outputAudioContextRef.current || outputAudioContextRef.current.state === 'closed') {
        outputAudioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }
      const outputNode = outputAudioContextRef.current.createGain();
      outputNode.connect(outputAudioContextRef.current.destination);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      if (!inputAudioContextRef.current || inputAudioContextRef.current.state === 'closed') {
        inputAudioContextRef.current = new AudioContext({ sampleRate: 16000 });
      }

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log('Live session opened.');
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            mediaStreamSourceRef.current = source;
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;
            // FIX: Corrected typo 'onaudiprocess' to 'onaudioprocess'
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              sessionPromiseRef.current?.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
             if (audioData) {
                const outputCtx = outputAudioContextRef.current!;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                const audioBuffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
                const source = outputCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNode);
                source.addEventListener('ended', () => { audioSourcesRef.current.delete(source) });
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                audioSourcesRef.current.add(source);
             }
             if (message.serverContent?.interrupted) {
                audioSourcesRef.current.forEach(source => source.stop());
                audioSourcesRef.current.clear();
                nextStartTimeRef.current = 0;
             }
          },
          onerror: (e: ErrorEvent) => {
            console.error('Live session error:', e);
            stopListening();
          },
          onclose: () => {
            console.log('Live session closed.');
            if (isListening) {
                stopListening();
            }
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: constructSystemInstruction(),
        },
      });
    } catch (error) {
      console.error('Failed to start listening:', error);
      setIsListening(false);
    }
  };

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleSaveProfile = (profile: FarmerProfile) => {
    setFarmerProfile(profile);
    setView('chat');
    setMessages(prev => [...prev, {id: 'profile-update', sender: 'bot', text: 'Your profile has been updated! Welcome!'}])
  };

  const quickReplies: Reply[] = [
    { text: 'Weather Forecast', icon: <WeatherIcon />, action: 'What is the weather forecast for the next 5 days?' },
    { text: 'Crop Suggestion', icon: <PlantIcon />, action: 'What crops should I plant next season?' },
    { text: 'Govt. Schemes', icon: <SchemeIcon />, action: 'Tell me about recent government schemes for farmers.' },
    { text: 'Identify Disease', icon: <CameraIcon />, action: 'I will upload a picture of my plant. Can you identify the disease?' },
    { text: 'Planting Calendar', icon: <CalendarIcon />, action: 'What is the ideal planting calendar for my region?' },
    { text: 'Market Prices', icon: <PriceIcon />, action: 'What are the current market prices for my crops?' },
    { text: 'Pest Alert', icon: <AlertIcon />, action: 'Are there any pest alerts for my area?' },
  ];

  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('login')} onLogin={() => setView('login')} onSignUp={() => setView('signup')} />;
  }

  if (view === 'signup') {
    return <SignUpPage onSignUpSuccess={() => setView('login')} onNavigateToLogin={() => setView('login')} />;
  }

  if (view === 'login') {
    return <LoginPage onSave={handleSaveProfile} currentProfile={farmerProfile} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 font-sans">
      <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
          <div className="text-green-600"><LogoIcon /></div>
          <h1 className="text-xl font-bold text-white">Farm Assistant</h1>
        </div>
      </header>
      
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && <GrowingPlantLoader />}
      </main>

      <div className="flex-shrink-0">
        <QuickReplies 
          replies={contextualReplies.length > 0 ? contextualReplies : quickReplies} 
          onQuickReply={handleQuickReply} 
          isLoading={isLoading || isListening} 
        />
      </div>

      <footer className="flex-shrink-0">
        <ChatInput
          onSendMessage={handleSendMessage}
          onToggleVoice={handleToggleVoice}
          isLoading={isLoading}
          isListening={isListening}
        />
      </footer>
    </div>
  );
};

export default App;