import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hand, Download, Share2, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { revealAnimation } from '@/lib/animations';
import { generatePDF } from '@/lib/pdfUtils';
import { toast } from '@/hooks/use-toast';
import { useGemini } from '@/contexts/GeminiContext';
import { supabase } from '@/integrations/supabase/client';

const PalmReadingResult = () => {
  const navigate = useNavigate();
  const [palmAnalysis, setPalmAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAttemptedAnalysis, setHasAttemptedAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { gemini, isLoading: isGeminiLoading } = useGemini();
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUserId(data.session.user.id);
      }
    };
    
    checkAuth();
  }, []);
  
  const saveReadingToDatabase = async (readingText: string) => {
    if (!userId) return;
    
    try {
      const palmImageData = sessionStorage.getItem('palmImage');
      console.log('Saving reading to database for user:', userId);
      
      const { error } = await supabase
        .from('palm_readings')
        .insert({
          user_id: userId,
          image_url: palmImageData || '',
          results: readingText,
          language: 'english'
        });
      
      if (error) {
        console.error('Error saving reading to database:', error);
        toast({
          title: "Database Error",
          description: "Failed to save your reading to the database.",
          variant: "destructive",
        });
      } else {
        console.log('Successfully saved reading to database');
      }
    } catch (err) {
      console.error('Error in saveReadingToDatabase:', err);
    }
  };
  
  const analyzePalm = useCallback(async () => {
    console.log('Starting palm analysis...');
    const storedImage = sessionStorage.getItem('palmImage');
    
    if (!storedImage) {
      console.error('No palm image found in session storage');
      setError('No palm image found. Please upload an image first.');
      return false;
    }
    
    if (!gemini) {
      console.error('Gemini not initialized');
      setError('Gemini AI not initialized. Please check your API key.');
      return false;
    }
    
    setIsAnalyzing(true);
    setError(null); // Clear any previous errors
    
    try {
      console.log('Sending image to Gemini API for analysis...');
      
      // Clear any existing result before starting new analysis
      setPalmAnalysis(null);
      sessionStorage.removeItem('palmReadingResult');
      
      const result = await gemini.analyzePalm(storedImage);
      console.log('Analysis result received:', result ? `Success (${result.length} chars)` : 'Empty result');
      console.log('Sample of result received:', result ? result.substring(0, 500) : 'No result');
      
      if (!result || typeof result !== 'string' || result.trim() === '') {
        throw new Error('Empty or invalid result from Gemini API');
      }
      
      // Check if the result contains demo-related words
      const demoKeywords = ['demo', 'example', 'sample', 'this is a demonstration'];
      const containsDemoKeywords = demoKeywords.some(keyword => 
        result.toLowerCase().includes(keyword.toLowerCase()));
      
      if (containsDemoKeywords) {
        console.error('Result contains demo keywords, retrying analysis');
        throw new Error('The AI generated a demo response. Retrying for a real analysis.');
      }
      
      console.log('Analysis complete, setting result');
      setPalmAnalysis(result);
      sessionStorage.setItem('palmReadingResult', result);
      
      if (userId) {
        await saveReadingToDatabase(result);
      }
      
      setError(null);
      console.log('Palm analysis result has been set:', result.substring(0, 100) + '...');
      return true;
    } catch (error) {
      console.error('Error analyzing palm:', error);
      setError(`Error analyzing palm: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: "Analysis Error",
        description: "There was an error analyzing your palm image. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsAnalyzing(false);
      setHasAttemptedAnalysis(true);
    }
  }, [gemini, userId]);
  
  useEffect(() => {
    const cleanup = revealAnimation();
    
    const loadData = async () => {
      try {
        setError(null);
        
        // Try to get the reading from Supabase if user is logged in
        let foundReadingInDb = false;
        
        if (userId) {
          console.log('Checking for reading in database for user:', userId);
          const { data: readings, error: readingsError } = await supabase
            .from('palm_readings')
            .select('results')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (!readingsError && readings && readings.length > 0 && readings[0].results) {
            console.log('Found reading in database, using it');
            // Ensure results is treated as a string
            const readingText = typeof readings[0].results === 'object' 
              ? JSON.stringify(readings[0].results) 
              : String(readings[0].results);
            
            if (readingText && readingText.length > 100) {
              console.log('Setting palm analysis from database:', readingText.substring(0, 100) + '...');
              setPalmAnalysis(readingText);
              sessionStorage.setItem('palmReadingResult', readingText);
              setHasAttemptedAnalysis(true);
              foundReadingInDb = true;
            }
          } else {
            console.log('No readings found in database or error:', readingsError);
          }
        }
        
        if (!foundReadingInDb) {
          const storedReading = sessionStorage.getItem('palmReadingResult');
          const storedImage = sessionStorage.getItem('palmImage');
          
          console.log('Checking stored reading:', storedReading ? 'Found' : 'Not found');
          console.log('Checking stored image:', storedImage ? 'Found' : 'Not found');
          
          if (storedReading && storedReading.trim().length > 10) {
            // Content exists and is reasonably long
            console.log('Found valid stored reading, using it');
            console.log('Reading preview:', storedReading.substring(0, 100) + '...');
            setPalmAnalysis(storedReading);
            setHasAttemptedAnalysis(true);
          } else if (storedImage && gemini && !isGeminiLoading && !isAnalyzing) {
            console.log('No valid stored reading but we have image and gemini, analyzing now...');
            await analyzePalm();
          } else if (!storedImage) {
            console.log('No palm image found, redirecting to upload page');
            toast({
              title: "No Palm Image",
              description: "Please upload a palm image for analysis first.",
            });
            navigate('/palm-reading');
          }
        }
      } catch (err) {
        console.error('Error in loadData:', err);
        setError(`Failed to load palm reading: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    
    if (!isGeminiLoading) {
      loadData();
    }
    
    return () => {
      cleanup();
    };
  }, [navigate, gemini, isGeminiLoading, analyzePalm, userId]);

  const formatAnalysisContent = (content: string) => {
    if (!content || typeof content !== 'string' || content.trim() === '') {
      console.log('No content to format or invalid content type');
      return <p>No analysis content available.</p>;
    }

    console.log('Formatting analysis content, length:', content.length);
    console.log('Content preview:', content.substring(0, 100));
    
    try {
      // Process the content for rendering with enhanced markdown support
      const lines = content.split('\n');
      const elements: JSX.Element[] = [];
      let currentList: JSX.Element[] = [];
      let inList = false;
      
      lines.forEach((line, index) => {
        // Handle empty lines
        if (line.trim() === '') {
          if (inList) {
            // End the current list
            elements.push(<ul key={`list-${index}`} className="list-disc my-4 ml-6">{currentList}</ul>);
            currentList = [];
            inList = false;
          }
          elements.push(<div key={`empty-${index}`} className="my-2"></div>);
          return;
        }
        
        // Handle headers
        if (line.match(/^# /)) {
          if (inList) {
            elements.push(<ul key={`list-${index}`} className="list-disc my-4 ml-6">{currentList}</ul>);
            currentList = [];
            inList = false;
          }
          elements.push(<h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.replace(/^# /, '')}</h1>);
          return;
        }
        
        if (line.match(/^## /)) {
          if (inList) {
            elements.push(<ul key={`list-${index}`} className="list-disc my-4 ml-6">{currentList}</ul>);
            currentList = [];
            inList = false;
          }
          elements.push(<h2 key={index} className="text-xl font-bold mt-5 mb-3">{line.replace(/^## /, '')}</h2>);
          return;
        }
        
        if (line.match(/^### /)) {
          if (inList) {
            elements.push(<ul key={`list-${index}`} className="list-disc my-4 ml-6">{currentList}</ul>);
            currentList = [];
            inList = false;
          }
          elements.push(<h3 key={index} className="text-lg font-bold mt-4 mb-2">{line.replace(/^### /, '')}</h3>);
          return;
        }
        
        // Handle lists
        if (line.match(/^- /) || line.match(/^\* /)) {
          inList = true;
          const listItem = (
            <li key={`item-${index}`} className="mb-1">
              {renderFormattedText(line.replace(/^-\s+/, '').replace(/^\*\s+/, ''))}
            </li>
          );
          currentList.push(listItem);
          return;
        }
        
        // Handle horizontal rule
        if (line.match(/^---+$/)) {
          if (inList) {
            elements.push(<ul key={`list-${index}`} className="list-disc my-4 ml-6">{currentList}</ul>);
            currentList = [];
            inList = false;
          }
          elements.push(<hr key={index} className="my-6 border-t border-gray-300" />);
          return;
        }
        
        // Default paragraph handling
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc my-4 ml-6">{currentList}</ul>);
          currentList = [];
          inList = false;
        }
        
        elements.push(
          <p key={index} className="mb-3">
            {renderFormattedText(line)}
          </p>
        );
      });
      
      // Add any remaining list items
      if (inList && currentList.length > 0) {
        elements.push(<ul key="list-end" className="list-disc my-4 ml-6">{currentList}</ul>);
      }
      
      return <div className="palm-reading-content">{elements}</div>;
    } catch (error) {
      console.error('Error formatting content:', error);
      // Fallback rendering if there's an error in the formatting logic
      return (
        <div className="palm-reading-content-fallback whitespace-pre-wrap">
          {content}
        </div>
      );
    }
  };
  
  // Helper function to render formatted text (bold, italic, etc.)
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    
    try {
      // Process bold text
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return (
        <>
          {parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={idx}>{part.substring(2, part.length - 2)}</strong>;
            }
            return <span key={idx}>{part}</span>;
          })}
        </>
      );
    } catch (error) {
      console.error('Error in renderFormattedText:', error);
      return <span>{text}</span>;
    }
  };

  const handleFullReportDownload = async () => {
    toast({
      title: "Generating Full Report",
      description: "Your comprehensive report is being prepared for download...",
    });
    
    try {
      await generatePDF({
        title: "Complete Palm Reading Analysis",
        subtitle: "Comprehensive Personal Insights",
        content: palmAnalysis || "No analysis available",
        fileName: "Palm_Reading_Full_Report.pdf"
      });
      
      toast({
        title: "Success",
        description: "Your comprehensive report has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate the report. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleBasicReportDownload = async () => {
    toast({
      title: "Generating Basic Report",
      description: "Your basic report is being prepared for download...",
    });
    
    const basicContent = palmAnalysis 
      ? palmAnalysis.split('\n').slice(0, 20).join('\n') + '\n\n(This is a basic version of your report. For full insights, please download the complete report.)'
      : "No analysis available";
    
    try {
      await generatePDF({
        title: "Basic Palm Reading Analysis",
        subtitle: "Essential Personal Insights",
        content: basicContent,
        fileName: "Palm_Reading_Basic_Report.pdf"
      });
      
      toast({
        title: "Success",
        description: "Your basic report has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate the report. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const retryAnalysis = async () => {
    setPalmAnalysis(null);
    setError(null);
    sessionStorage.removeItem('palmReadingResult');
    
    await analyzePalm();
  };
  
  const isLoading = isGeminiLoading || isAnalyzing;
  
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-32 pb-24">
          <div className="content-container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h2 className="text-xl font-semibold">Analyzing Your Palm</h2>
                <p className="text-muted-foreground">
                  Our AI is carefully analyzing your palm image to generate a comprehensive palmistry report. This may take a moment...
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="content-container">
          <div className="max-w-4xl mx-auto text-center mb-12 reveal">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Hand className="h-4 w-4 mr-2" />
              Comprehensive Palmistry Analysis
            </div>
            <h1 className="heading-lg mb-6">Your Complete Palm Reading Report</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              This in-depth analysis is based on traditional palmistry principles, examining your hand shape, lines, mounts, and unique features to provide insights into your personality and life journey.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-10 mb-16 reveal">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h2 className="heading-md">Full Palmistry Report</h2>
              <div className="flex gap-3 flex-wrap">
                <button 
                  onClick={handleFullReportDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  disabled={!palmAnalysis}
                >
                  <Download className="h-4 w-4" />
                  <span>Download Full Report</span>
                </button>
                <button 
                  onClick={handleBasicReportDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
                  disabled={!palmAnalysis}
                >
                  <Download className="h-4 w-4" />
                  <span>Download Basic Report</span>
                </button>
                <button 
                  onClick={retryAnalysis}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
                  title="Generate a new reading with the same image"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none text-left">
              {palmAnalysis ? (
                <>
                  {console.log('Rendering palm analysis, length:', palmAnalysis.length)}
                  {formatAnalysisContent(palmAnalysis)}
                </>
              ) : error ? (
                <div className="p-6 border border-red-300 rounded-lg bg-red-50 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
                    <h3 className="text-xl font-medium text-red-700">Analysis Failed</h3>
                  </div>
                  <p className="text-red-600 font-medium mb-2">Error: {error}</p>
                  <p className="text-muted-foreground mb-4">
                    Unable to generate palm analysis. This could be due to one of the following reasons:
                  </p>
                  <ul className="text-left list-disc mb-6 mx-auto max-w-md">
                    <li className="mb-2">Your Gemini API key may be invalid or expired</li>
                    <li className="mb-2">The palm image might not be clear enough for analysis</li>
                    <li className="mb-2">There might be connection issues with the Gemini API</li>
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={retryAnalysis}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => navigate('/palm-reading')}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                      Upload New Image
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 border border-yellow-300 rounded-lg bg-yellow-50 text-center">
                  <p className="text-center text-muted-foreground italic mb-4">
                    {hasAttemptedAnalysis 
                      ? "Analysis could not be generated. Please try uploading a clearer image of your palm." 
                      : "No palm analysis available. Please upload a palm image for analysis."}
                  </p>
                  <button
                    onClick={() => navigate('/palm-reading')}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    Upload Palm Image
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-center max-w-2xl mx-auto reveal">
            <Link to="/palm-reading" className="inline-block px-8 py-3 rounded-full bg-secondary text-secondary-foreground text-base font-medium hover:bg-secondary/90 transition-colors mb-6">
              Upload Another Palm Image
            </Link>
            <p className="text-muted-foreground">
              Want even more detailed insights? Check out our <Link to="/pricing" className="text-primary hover:underline">premium plans</Link>.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PalmReadingResult;
