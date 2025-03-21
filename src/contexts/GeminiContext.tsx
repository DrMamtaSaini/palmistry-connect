
import React, { createContext, useContext, useState, useEffect } from 'react';
import GeminiAI from '@/lib/gemini';

interface GeminiContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  gemini: GeminiAI | null;
  isConfigured: boolean;
}

const GeminiContext = createContext<GeminiContextType>({
  apiKey: null,
  setApiKey: () => {},
  gemini: null,
  isConfigured: false
});

export const useGemini = () => useContext(GeminiContext);

export const GeminiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [gemini, setGemini] = useState<GeminiAI | null>(null);
  
  useEffect(() => {
    // Try to load the API key from localStorage
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);
  
  useEffect(() => {
    if (apiKey) {
      // Save the API key to localStorage
      localStorage.setItem('gemini_api_key', apiKey);
      
      // Initialize the Gemini API
      try {
        const geminiInstance = GeminiAI.initialize(apiKey);
        setGemini(geminiInstance);
      } catch (error) {
        console.error('Failed to initialize Gemini:', error);
        setGemini(null);
      }
    } else {
      setGemini(null);
    }
  }, [apiKey]);
  
  const contextValue = {
    apiKey,
    setApiKey,
    gemini,
    isConfigured: !!gemini
  };
  
  return (
    <GeminiContext.Provider value={contextValue}>
      {children}
    </GeminiContext.Provider>
  );
};

export default GeminiContext;
