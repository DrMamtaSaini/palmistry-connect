
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Upload, AlertCircle, Camera } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageUploader from '@/components/ImageUploader';
import { revealAnimation } from '@/lib/animations';
import { useGemini } from '@/contexts/GeminiContext';
import GeminiSetup from '@/components/GeminiSetup';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const birthDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().optional(),
  birthPlace: z.string().optional(),
});

const compatibilitySchema = z.object({
  yourDetails: birthDetailsSchema,
  partnerDetails: birthDetailsSchema
});

const Compatibility = () => {
  const [yourPalmImage, setYourPalmImage] = useState<File | null>(null);
  const [partnerPalmImage, setPartnerPalmImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completionProgress, setCompletionProgress] = useState(0);
  const { gemini, isConfigured } = useGemini();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<z.infer<typeof compatibilitySchema>>({
    resolver: zodResolver(compatibilitySchema),
    defaultValues: {
      yourDetails: {
        name: '',
        birthDate: '',
        birthTime: '',
        birthPlace: ''
      },
      partnerDetails: {
        name: '',
        birthDate: '',
        birthTime: '',
        birthPlace: ''
      }
    }
  });
  
  useEffect(() => {
    const cleanup = revealAnimation();
    return cleanup;
  }, []);
  
  useEffect(() => {
    // Calculate completion progress
    let progress = 0;
    
    // Required fields: 2 names, 2 birthdates, 2 images
    const requiredFields = 6;
    let completedFields = 0;
    
    // Check required fields
    if (form.getValues('yourDetails.name')) completedFields++;
    if (form.getValues('yourDetails.birthDate')) completedFields++;
    if (form.getValues('partnerDetails.name')) completedFields++;
    if (form.getValues('partnerDetails.birthDate')) completedFields++;
    if (yourPalmImage) completedFields++;
    if (partnerPalmImage) completedFields++;
    
    // Optional fields: 2 birthTimes, 2 birthPlaces (these add a small bonus)
    const optionalFields = 4;
    let optionalCompleted = 0;
    
    if (form.getValues('yourDetails.birthTime')) optionalCompleted++;
    if (form.getValues('yourDetails.birthPlace')) optionalCompleted++;
    if (form.getValues('partnerDetails.birthTime')) optionalCompleted++;
    if (form.getValues('partnerDetails.birthPlace')) optionalCompleted++;
    
    // Calculate base progress from required fields
    progress = (completedFields / requiredFields) * 85;
    
    // Add bonus from optional fields
    progress += (optionalCompleted / optionalFields) * 15;
    
    setCompletionProgress(Math.round(progress));
  }, [form.watch(), yourPalmImage, partnerPalmImage]);
  
  const handleYourImageSelect = (file: File) => {
    setYourPalmImage(file);
    setError(null);
  };
  
  const handlePartnerImageSelect = (file: File) => {
    setPartnerPalmImage(file);
    setError(null);
  };
  
  const onSubmit = async (values: z.infer<typeof compatibilitySchema>) => {
    if (!yourPalmImage || !partnerPalmImage) {
      toast({
        title: "Missing Images",
        description: "Please upload both palm images for analysis.",
        variant: "destructive"
      });
      return;
    }
    
    if (!isConfigured || !gemini) {
      toast({
        title: "API Key Required",
        description: "Please configure your Gemini API key first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Convert images to base64
      const yourPalmBase64 = await fileToBase64(yourPalmImage);
      const partnerPalmBase64 = await fileToBase64(partnerPalmImage);
      
      // Store birth details in sessionStorage for the results page
      sessionStorage.setItem('yourName', values.yourDetails.name);
      sessionStorage.setItem('partnerName', values.partnerDetails.name);
      sessionStorage.setItem('yourBirthdate', values.yourDetails.birthDate);
      sessionStorage.setItem('partnerBirthdate', values.partnerDetails.birthDate);
      sessionStorage.setItem('yourBirthTime', values.yourDetails.birthTime || '');
      sessionStorage.setItem('partnerBirthTime', values.partnerDetails.birthTime || '');
      sessionStorage.setItem('yourBirthPlace', values.yourDetails.birthPlace || '');
      sessionStorage.setItem('partnerBirthPlace', values.partnerDetails.birthPlace || '');
      
      // Create a compatibility data object to pass to Gemini
      const compatibilityData = {
        yourDetails: {
          name: values.yourDetails.name,
          birthDate: values.yourDetails.birthDate,
          birthTime: values.yourDetails.birthTime || '',
          birthPlace: values.yourDetails.birthPlace || '',
          palmImage: yourPalmBase64
        },
        partnerDetails: {
          name: values.partnerDetails.name,
          birthDate: values.partnerDetails.birthDate,
          birthTime: values.partnerDetails.birthTime || '',
          birthPlace: values.partnerDetails.birthPlace || '',
          palmImage: partnerPalmBase64
        }
      };
      
      // Analyze compatibility using Gemini with the data object
      const result = await gemini.checkCompatibility(compatibilityData);
      
      // Store result and navigate to results page
      sessionStorage.setItem('compatibilityResult', result);
      
      toast({
        title: "Success",
        description: "Compatibility analysis completed successfully!",
      });
      
      // Navigate to results page
      navigate('/compatibility-result');
    } catch (error) {
      console.error('Error during compatibility analysis:', error);
      setError(error instanceof Error ? error.message : 'There was a problem analyzing your palm images. Please try again.');
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
            <h2 className="heading-md mb-4 text-center">Complete Your Compatibility Profile</h2>
            
            <div className="mb-8">
              <p className="text-center text-muted-foreground mb-3">Profile completion</p>
              <div className="flex items-center gap-2">
                <Progress value={completionProgress} className="h-2" />
                <span className="text-sm font-medium">{completionProgress}%</span>
              </div>
            </div>
            
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Your Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-center">Your Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="yourDetails.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="yourDetails.birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Birth Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="yourDetails.birthTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Birth Time (Optional)</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormDescription>
                            For more accurate Guna Milan analysis
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="yourDetails.birthPlace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Birth Place (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="City, Country" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enhances astrological compatibility calculation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <ImageUploader 
                        onImageSelect={handleYourImageSelect}
                        label="Upload Your Palm Image"
                        imagePreviewClassName="aspect-[3/4]"
                      />
                      <div className="mt-3 text-sm text-muted-foreground">
                        <p className="font-semibold text-primary">For best results:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-1">
                          <li>Use high-resolution images in good lighting</li>
                          <li>Capture your dominant hand (usually right)</li>
                          <li>Ensure all lines and mounts are clearly visible</li>
                          <li>Keep your palm flat and fully extended</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Partner's Information */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold mb-4 text-center">Partner's Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="partnerDetails.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Partner's Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter partner's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="partnerDetails.birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Partner's Birth Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="partnerDetails.birthTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Partner's Birth Time (Optional)</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormDescription>
                            For more accurate Guna Milan analysis
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="partnerDetails.birthPlace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Partner's Birth Place (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="City, Country" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enhances astrological compatibility calculation
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                      <ImageUploader 
                        onImageSelect={handlePartnerImageSelect}
                        label="Upload Partner's Palm Image"
                        imagePreviewClassName="aspect-[3/4]"
                      />
                      <div className="mt-3 text-sm text-muted-foreground">
                        <p className="font-semibold text-primary">For best results:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-1">
                          <li>Use high-resolution images in good lighting</li>
                          <li>Capture the dominant hand (usually right)</li>
                          <li>Ensure all lines and mounts are clearly visible</li>
                          <li>Keep the palm flat and fully extended</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-8">
                  <button
                    type="submit"
                    disabled={!yourPalmImage || !partnerPalmImage || isUploading || !isConfigured}
                    className={`
                      px-8 py-3 rounded-full text-base font-medium flex items-center transition-all mx-auto
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
                  <p className="text-sm text-muted-foreground mt-4">
                    More complete birth details result in a more accurate compatibility analysis.
                  </p>
                </div>
              </form>
            </Form>
          </div>
          
          <div className="max-w-4xl mx-auto reveal">
            <h2 className="heading-md mb-8 text-center">What You'll Discover</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-panel p-6 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Vedic Guna Milan</h3>
                <p className="text-sm text-muted-foreground">Traditional 36-point compatibility score based on birth details.</p>
              </div>
              
              <div className="glass-panel p-6 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Palm Line Analysis</h3>
                <p className="text-sm text-muted-foreground">Detailed assessment of key palm lines and their compatibility.</p>
              </div>
              
              <div className="glass-panel p-6 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Element Compatibilities</h3>
                <p className="text-sm text-muted-foreground">How your hand elements interact for relationship harmony.</p>
              </div>
              
              <div className="glass-panel p-6 rounded-xl text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <span className="font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Custom Recommendations</h3>
                <p className="text-sm text-muted-foreground">Personalized advice for strengthening your relationship.</p>
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
