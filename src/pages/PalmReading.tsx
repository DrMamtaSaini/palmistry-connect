
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hand, Upload, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUploader from '@/components/ImageUploader';
import { revealAnimation } from '@/lib/animations';
import GeminiSetup from '@/components/GeminiSetup';
import { useGemini } from '@/contexts/GeminiContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const PalmReading = () => {
  const [palmImage, setPalmImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { gemini, isConfigured } = useGemini();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const cleanup = revealAnimation();

    // Clear any existing sessions when loading the upload page
    // This ensures we don't see previous images
    sessionStorage.removeItem('palmImage');
    sessionStorage.removeItem('palmReadingResult');
    console.log('Cleared palm session data on page load');
    
    return cleanup;
  }, []);
  
  const handleImageSelect = (file: File) => {
    console.log('Image selected:', file.name);
    setPalmImage(file);
    setUploadSuccess(false); // Reset success state when new image is selected
  };
  
  const handleUpload = async () => {
    console.log('handleUpload clicked!');
    
    if (!palmImage || !gemini) {
      console.log('Cannot upload: palmImage or gemini is missing', { 
        hasPalmImage: !!palmImage, 
        hasGemini: !!gemini 
      });
      return;
    }
    
    setIsUploading(true);
    console.log('Starting palm image upload and analysis process');
    
    try {
      // Convert image to base64 for storage and analysis
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        if (e.target?.result) {
          const base64Image = e.target.result.toString();
          console.log('Image converted to base64 successfully');
          
          // Clear any existing reading result
          sessionStorage.removeItem('palmReadingResult');
          
          // Store the image in sessionStorage for the result page
          sessionStorage.setItem('palmImage', base64Image);
          console.log('Palm image saved to sessionStorage');
          
          try {
            console.log('Starting Gemini palm analysis');
            const analysisResult = await gemini.analyzePalm(base64Image);
            console.log('Gemini analysis completed successfully');
            
            // Store the result in sessionStorage
            sessionStorage.setItem('palmReadingResult', analysisResult);
            console.log('Analysis result saved to sessionStorage');
            
            // Update success state
            setUploadSuccess(true);
            
            toast({
              title: "Analysis Complete",
              description: "Your palm reading is ready. You'll be redirected to your results shortly.",
              duration: 3000,
            });
            
            // Redirect to results page after a short delay to allow toast to be seen
            setTimeout(() => {
              navigate('/palm-reading-result');
            }, 1500);
          } catch (analysisError) {
            console.error("Error during palm analysis:", analysisError);
            setIsUploading(false);
            toast({
              title: "Analysis Failed",
              description: analysisError instanceof Error ? analysisError.message : "Could not analyze your palm image. Please try again.",
              variant: "destructive",
              duration: 5000,
            });
          }
        }
      };
      
      reader.onerror = () => {
        setIsUploading(false);
        console.error("Error reading the image file");
        toast({
          title: "Upload Failed",
          description: "There was a problem uploading your image. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      };
      
      reader.readAsDataURL(palmImage);
    } catch (error) {
      console.error("Error processing image:", error);
      setIsUploading(false);
      toast({
        title: "Upload Failed",
        description: "There was a problem processing your image. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
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
              <Button 
                onClick={handleUpload}
                disabled={!palmImage || isUploading || !isConfigured}
                variant="default"
                size="lg"
                className={`
                  px-8 py-6 rounded-full text-base font-medium transition-all duration-200
                  ${(!palmImage || !isConfigured) 
                    ? 'bg-gray-400 hover:bg-gray-500 cursor-not-allowed' 
                    : 'bg-primary hover:bg-primary/80 hover:scale-105 hover:shadow-lg active:scale-95'
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
              </Button>
            </div>
            
            {uploadSuccess && (
              <div className="mt-8 p-4 bg-green-50 text-green-800 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Palm image uploaded successfully!</p>
                  <p className="text-sm mt-1">Your analysis is being prepared. You'll be redirected to your results shortly.</p>
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
