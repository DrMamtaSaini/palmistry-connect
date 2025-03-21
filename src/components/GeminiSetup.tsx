
import { useState } from 'react';
import { useGemini } from '@/contexts/GeminiContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Key } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface GeminiSetupProps {
  variant?: 'button' | 'card';
  className?: string;
}

const GeminiSetup = ({ variant = 'button', className }: GeminiSetupProps) => {
  const { apiKey, setApiKey, isConfigured } = useGemini();
  const [tempApiKey, setTempApiKey] = useState(apiKey || '');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const handleSave = () => {
    if (tempApiKey.trim()) {
      setApiKey(tempApiKey.trim());
      setIsOpen(false);
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved successfully.",
      });
    }
  };
  
  const handleRemove = () => {
    setApiKey('');
    setTempApiKey('');
    setIsOpen(false);
    localStorage.removeItem('gemini_api_key');
    toast({
      title: "API Key Removed",
      description: "Your Gemini API key has been removed.",
      variant: "destructive",
    });
  };
  
  if (variant === 'card') {
    return (
      <div className={`bg-gray-100 p-6 rounded-2xl shadow-md ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Key className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-black">Gemini API Setup</h3>
          <p className="text-black font-medium mb-4">
            {isConfigured 
              ? "Gemini API is configured and ready to use" 
              : "Configure your Gemini API key to analyze palm images"}
          </p>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant={isConfigured ? "outline" : "default"}>
                {isConfigured ? "Update API Key" : "Configure API Key"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Gemini API Configuration</DialogTitle>
                <DialogDescription>
                  Enter your Gemini API key to enable AI-powered palm reading and compatibility analysis.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="apiKey" className="text-sm font-medium">
                    Gemini API Key
                  </label>
                  <Input
                    id="apiKey"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your API key is stored locally in your browser and is never sent to our servers.
                  </p>
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
                {isConfigured && (
                  <Button variant="destructive" onClick={handleRemove}>
                    Remove API Key
                  </Button>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={isConfigured ? "outline" : "default"} className={className}>
          {isConfigured ? "Update Gemini API Key" : "Configure Gemini API Key"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gemini API Configuration</DialogTitle>
          <DialogDescription>
            Enter your Gemini API key to enable AI-powered palm reading and compatibility analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              Gemini API Key
            </label>
            <Input
              id="apiKey"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="Enter your Gemini API key"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally in your browser and is never sent to our servers.
            </p>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          {isConfigured && (
            <Button variant="destructive" onClick={handleRemove}>
              Remove API Key
            </Button>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GeminiSetup;
