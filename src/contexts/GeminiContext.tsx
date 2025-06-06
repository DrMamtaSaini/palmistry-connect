
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
        console.log('Loading Gemini API key from localStorage');
        const savedApiKey = localStorage.getItem('gemini_api_key');
        if (savedApiKey && savedApiKey.trim() !== '') {
          console.log('Found saved API key, will initialize Gemini');
          setApiKey(savedApiKey);
        } else {
          console.log('No saved API key found or API key is empty');
          setApiKey(null);
          localStorage.removeItem('gemini_api_key');
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
    if (!apiKey || apiKey.trim() === '') {
      console.log('No API key available, clearing Gemini instance');
      setGemini(null);
      return;
    }
    
    const initializeGemini = async () => {
      setIsInitializing(true);
      
      try {
        // Check if API key looks valid (basic validation)
        if (!apiKey.startsWith('AIza') || apiKey.length < 20) {
          throw new Error('API key format appears invalid. Please check your Gemini API key.');
        }
        
        // Test the API key with a simple request before saving
        const testUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const testResponse = await fetch(testUrl);
        
        if (!testResponse.ok) {
          const errorData = await testResponse.json();
          console.error('API key test failed:', errorData);
          throw new Error(`API key validation failed: ${errorData.error?.message || 'Unknown error'}`);
        }
        
        // Save the API key to localStorage
        console.log('Saving API key to localStorage');
        localStorage.setItem('gemini_api_key', apiKey);
        
        // Initialize the Gemini API with the specific model for palm reading
        console.log('Initializing Gemini with API key');
        console.log('Initializing Gemini with model: gemini-1.5-flash');
        const geminiInstance = GeminiAI.initialize(apiKey, "gemini-1.5-flash");
        
        // Set the Gemini instance in state
        setGemini(geminiInstance);
        
        // Show success toast
        toast({
          title: "Gemini API Connected",
          description: "You can now analyze palm images and check compatibility.",
        });
        
        console.log('Gemini successfully initialized');
      } catch (error) {
        console.error('Failed to initialize Gemini:', error);
        // Clear invalid API key
        localStorage.removeItem('gemini_api_key');
        toast({
          title: "Gemini Initialization Failed",
          description: error instanceof Error ? error.message : "There was a problem connecting to the Gemini API. Please check your API key.",
          variant: "destructive",
        });
        setGemini(null);
        setApiKey(null);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeGemini();
  }, [apiKey]);
  
  const clearApiKey = () => {
    // Clear API key and all stored results
    console.log('Clearing API key and stored results');
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
