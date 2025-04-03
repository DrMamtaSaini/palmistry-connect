
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
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [gemini, setGemini] = useState<GeminiAI | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  
  // Load API key from localStorage on first render
  useEffect(() => {
    const loadApiKey = async () => {
      setIsLoading(true);
      try {
        const savedApiKey = localStorage.getItem('gemini_api_key');
        if (savedApiKey) {
          setApiKey(savedApiKey);
        }
      } catch (error) {
        console.error('Error loading API key:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadApiKey();
  }, []);
  
  // Initialize Gemini when API key changes
  useEffect(() => {
    if (!apiKey) {
      setGemini(null);
      return;
    }
    
    const initializeGemini = async () => {
      setIsInitializing(true);
      
      try {
        // Save the API key to localStorage
        localStorage.setItem('gemini_api_key', apiKey);
        
        // Initialize the Gemini API
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
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeGemini();
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
    isLoading: isLoading || isInitializing,
    clearApiKey
  };
  
  return (
    <GeminiContext.Provider value={contextValue}>
      {children}
    </GeminiContext.Provider>
  );
};

export default GeminiContext;
