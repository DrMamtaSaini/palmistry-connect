import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hand, Upload, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUploader from '@/components/ImageUploader';
import { revealAnimation } from '@/lib/animations';
import GeminiSetup from '@/components/GeminiSetup';
import { useGemini } from '@/contexts/GeminiContext';

const PalmReading = () => {
  const [palmImage, setPalmImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { isConfigured } = useGemini();
  
  useEffect(() => {
    const cleanup = revealAnimation();
    return cleanup;
  }, []);
  
  const handleImageSelect = (file: File) => {
    setPalmImage(file);
  };
  
  const handleUpload = () => {
    if (!palmImage) return;
    
    setIsUploading(true);
    
    // Simulate upload and analysis
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="content-container">
          <div className="max-w-4xl mx-auto text-center mb-16 reveal">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Hand className="h-4 w-4 mr-2" />
              Palm Reading Analysis
            </div>
            <h1 className="heading-lg mb-6">Discover the Secrets in Your Palm</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Upload a clear image of your palm and our AI will analyze it to reveal insights about your personality, 
              career, health, relationships, and more.
            </p>
            
            <div className="mt-6">
              <GeminiSetup variant="button" className="mx-auto" />
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto glass-panel rounded-2xl p-10 mb-16 reveal">
            <h2 className="heading-md mb-6 text-center">Upload Your Palm Image</h2>
            
            {!isConfigured && (
              <div className="mb-8 p-4 bg-amber-50 text-amber-800 rounded-lg">
                <p className="font-medium">Please configure your Gemini API key before uploading.</p>
                <p className="text-sm mt-1">Click the "Configure Gemini API Key" button above to set up your key.</p>
              </div>
            )}
            
            <div className="grid gap-8 mb-8">
              <div>
                <p className="text-muted-foreground mb-6 text-center">
                  Please upload a clear, well-lit photo of your palm, showing all lines clearly. 
                  For best results, capture your dominant hand with fingers slightly spread.
                </p>
                
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div className="text-center">
                    <div className="border border-border p-1 rounded-md inline-block mb-2">
                      <img 
                        src="https://placehold.co/200x300/png?text=Good+Example" 
                        alt="Good palm image example" 
                        className="w-24 h-32 object-cover"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Good example</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="border border-border p-1 rounded-md inline-block mb-2">
                      <img 
                        src="https://placehold.co/200x300/png?text=Bad+Example" 
                        alt="Bad palm image example" 
                        className="w-24 h-32 object-cover"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Avoid blurry images</p>
                  </div>
                </div>
                
                <ImageUploader 
                  onImageSelect={handleImageSelect}
                  label="Upload Palm Image"
                  className="max-w-md mx-auto"
                  imagePreviewClassName="aspect-[3/4] max-w-md mx-auto"
                />
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleUpload}
                disabled={!palmImage || isUploading || !isConfigured}
                className={`
                  px-8 py-3 rounded-full text-base font-medium flex items-center transition-all
                  ${(!palmImage || !isConfigured)
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
                    Analyze My Palm
                  </>
                )}
              </button>
            </div>
            
            {uploadSuccess && (
              <div className="mt-8 p-4 bg-green-50 text-green-800 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Palm image uploaded successfully!</p>
                  <p className="text-sm mt-1">Your analysis is being prepared. Please check the <Link to="/pricing" className="underline">pricing options</Link> to view your detailed report.</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="max-w-4xl mx-auto reveal">
            <h2 className="heading-md mb-8 text-center">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Palm</h3>
                <p className="text-muted-foreground">Take a clear photo of your palm and upload it to our secure platform.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                <p className="text-muted-foreground">Our advanced AI model analyzes your palm lines, mounts, and skin texture.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2">Get Your Report</h3>
                <p className="text-muted-foreground">Receive a detailed report with insights about your personality, career, and relationships.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PalmReading;
