
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Upload, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUploader from '@/components/ImageUploader';
import { revealAnimation } from '@/lib/animations';
import { useGemini } from '@/contexts/GeminiContext';
import GeminiSetup from '@/components/GeminiSetup';
import { useToast } from '@/hooks/use-toast';

const Compatibility = () => {
  const [yourPalmImage, setYourPalmImage] = useState<File | null>(null);
  const [partnerPalmImage, setPartnerPalmImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [compatibilityResult, setCompatibilityResult] = useState<string | null>(null);
  const { gemini, isConfigured } = useGemini();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const cleanup = revealAnimation();
    return cleanup;
  }, []);
  
  const handleYourImageSelect = (file: File) => {
    setYourPalmImage(file);
  };
  
  const handlePartnerImageSelect = (file: File) => {
    setPartnerPalmImage(file);
  };
  
  const handleUpload = async () => {
    if (!yourPalmImage || !partnerPalmImage) return;
    
    if (!isConfigured || !gemini) {
      toast({
        title: "API Key Required",
        description: "Please configure your Gemini API key first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Convert images to base64
      const yourPalmBase64 = await fileToBase64(yourPalmImage);
      const partnerPalmBase64 = await fileToBase64(partnerPalmImage);
      
      // Analyze compatibility using Gemini
      const result = await gemini.checkCompatibility(yourPalmBase64, partnerPalmBase64);
      
      // Store result and navigate to results page
      setCompatibilityResult(result);
      
      toast({
        title: "Success",
        description: "Compatibility analysis completed successfully!",
      });
      
      // Store the result in sessionStorage to pass to a results page
      sessionStorage.setItem('compatibilityResult', result);
      
      // Navigate to results page or display in the current page
      // For now, we'll just display in the current page
    } catch (error) {
      console.error('Error during compatibility analysis:', error);
      toast({
        title: "Analysis Failed",
        description: "There was a problem analyzing your palm images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="content-container">
          <div className="max-w-4xl mx-auto text-center mb-16 reveal">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Users className="h-4 w-4 mr-2" />
              Relationship Compatibility Analysis
            </div>
            <h1 className="heading-lg mb-6">Discover Your Relationship Compatibility</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Upload palm images of you and your partner to receive a detailed AI-generated compatibility analysis,
              revealing relationship strengths, challenges, and future potential.
            </p>
          </div>
          
          {!isConfigured && (
            <div className="max-w-4xl mx-auto mb-8 text-center">
              <GeminiSetup variant="card" className="mx-auto max-w-md" />
            </div>
          )}
          
          <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-10 mb-16 reveal">
            <h2 className="heading-md mb-8 text-center">Upload Palm Images</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-center">Your Palm</h3>
                <ImageUploader 
                  onImageSelect={handleYourImageSelect}
                  label="Upload Your Palm Image"
                  imagePreviewClassName="aspect-[3/4]"
                />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-center">Partner's Palm</h3>
                <ImageUploader 
                  onImageSelect={handlePartnerImageSelect}
                  label="Upload Partner's Palm Image"
                  imagePreviewClassName="aspect-[3/4]"
                />
              </div>
            </div>
            
            <div className="text-center mb-8">
              <p className="text-muted-foreground text-sm">
                For best results, please upload clear, well-lit photos of both palms,
                showing all lines clearly. Dominant hands are preferred.
              </p>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleUpload}
                disabled={!yourPalmImage || !partnerPalmImage || isUploading || !isConfigured}
                className={`
                  px-8 py-3 rounded-full text-base font-medium flex items-center transition-all
                  ${(!yourPalmImage || !partnerPalmImage || !isConfigured) 
                    ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }
                `}
              >
                {isUploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    Analyze Compatibility
                  </>
                )}
              </button>
            </div>
            
            {compatibilityResult && (
              <div className="mt-12 border rounded-lg p-6 bg-white/50">
                <h3 className="text-xl font-semibold mb-4">Compatibility Analysis</h3>
                <div className="prose prose-sm max-w-none whitespace-pre-line">
                  {compatibilityResult.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="max-w-4xl mx-auto reveal">
            <h2 className="heading-md mb-8 text-center">What You'll Discover</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-6 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Emotional Connection</h3>
                <p className="text-sm text-muted-foreground">How well you connect emotionally and understand each other's feelings.</p>
              </div>
              
              <div className="glass-panel p-6 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Communication Style</h3>
                <p className="text-sm text-muted-foreground">Your communication patterns and how to improve understanding.</p>
              </div>
              
              <div className="glass-panel p-6 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Relationship Strengths</h3>
                <p className="text-sm text-muted-foreground">The unique strengths you bring to the relationship together.</p>
              </div>
              
              <div className="glass-panel p-6 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <span className="font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Growth Potential</h3>
                <p className="text-sm text-muted-foreground">How your relationship can evolve and grow over time.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Compatibility;
