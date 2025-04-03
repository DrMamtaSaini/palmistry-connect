
import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import GeminiAI from '@/lib/gemini';
import { toast } from '@/hooks/use-toast';

interface GeminiContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  gemini: GeminiAI | null;
  isConfigured: boolean;
  isLoading: boolean;
  clearApiKey: () => void;
}

const GeminiContext = createContext<GeminiContextType>({
  apiKey: null,
  setApiKey: () => {},
  gemini: null,
  isConfigured: false,
  isLoading: false,
  clearApiKey: () => {}
});

export const useGemini = () => useContext(GeminiContext);

export const GeminiProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiKey, setApiKey] = React.useState<string | null>(null);
  const [gemini, setGemini] = React.useState<GeminiAI | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  
  React.useEffect(() => {
    // Try to load the API key from localStorage
    const savedApiKey = localStorage.getItem('gemini_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    setIsLoading(false);
  }, []);
  
  React.useEffect(() => {
    if (apiKey) {
      // Save the API key to localStorage
      localStorage.setItem('gemini_api_key', apiKey);
      
      // Initialize the Gemini API
      try {
        const geminiInstance = GeminiAI.initialize(apiKey);
        setGemini(geminiInstance);
      } catch (error) {
        console.error('Failed to initialize Gemini:', error);
        toast({
          title: "Gemini Initialization Failed",
          description: "There was a problem connecting to the Gemini API. Please check your API key.",
          variant: "destructive",
        });
        setGemini(null);
      }
    } else {
      setGemini(null);
    }
  }, [apiKey]);
  
  const clearApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    sessionStorage.removeItem('palmReadingResult');
    sessionStorage.removeItem('palmImage');
    sessionStorage.removeItem('compatibilityResult');
    setApiKey(null);
    setGemini(null);
    toast({
      title: "API Key Removed",
      description: "Your Gemini API key has been removed and all stored results cleared.",
    });
  };
  
  const contextValue = {
    apiKey,
    setApiKey,
    gemini,
    isConfigured: !!gemini,
    isLoading,
    clearApiKey
  };
  
  return (
    <GeminiContext.Provider value={contextValue}>
      {children}
    </GeminiContext.Provider>
  );
};

export default GeminiContext;
