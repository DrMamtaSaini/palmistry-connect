import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hand, Download, Share2, Loader2, AlertCircle, RefreshCw, FileText, Book, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserProfileForm from '@/components/UserProfileForm';
import { revealAnimation } from '@/lib/animations';
import { generatePDF } from '@/lib/pdfUtils';
import { toast } from '@/hooks/use-toast';
import { useGemini } from '@/contexts/GeminiContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PalmReadingResult = () => {
  const navigate = useNavigate();
  const [palmAnalysis, setPalmAnalysis] = useState<string | null>(null);
  const [comprehensivePalmAnalysis, setComprehensivePalmAnalysis] = useState<string | null>(null);
  const [comprehensive50PageReport, setComprehensive50PageReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingComprehensive, setIsGeneratingComprehensive] = useState(false);
  const [isGenerating50Page, setIsGenerating50Page] = useState(false);
  const [hasAttemptedAnalysis, setHasAttemptedAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const { gemini, isLoading: isGeminiLoading } = useGemini();
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  
  // Add debug state
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUserId(data.session.user.id);
      }
    };
    
    checkAuth();
  }, []);
  
  const saveReadingToDatabase = async (readingText: string, isComprehensive: boolean = false) => {
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
          language: 'english',
          is_comprehensive: isComprehensive
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
      
      // Important: Store in session storage for persistence
      sessionStorage.setItem('palmReadingResult', result);
      setDebugInfo(`Result length: ${result.length} characters. First 100 chars: ${result.substring(0, 100)}`);
      
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
  
  const generateComprehensiveReport = useCallback(async () => {
    console.log('Starting comprehensive palm analysis...');
    const storedImage = sessionStorage.getItem('palmImage');
    const userName = sessionStorage.getItem('userName') || "User";
    
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
    
    setIsGeneratingComprehensive(true);
    setError(null); // Clear any previous errors
    
    try {
      console.log('Sending image to Gemini API for comprehensive analysis...');
      toast({
        title: "Generating Comprehensive Report",
        description: "Creating your 20-page PalmCode™ Life Blueprint Report. This may take a minute...",
      });
      
      const result = await gemini.analyzeComprehensivePalm(storedImage, userName);
      console.log('Comprehensive analysis received:', result ? `Success (${result.length} chars)` : 'Empty result');
      
      if (!result || typeof result !== 'string' || result.trim() === '') {
        throw new Error('Empty or invalid result from Gemini API for comprehensive report');
      }
      
      console.log('Comprehensive analysis complete, setting result');
      setComprehensivePalmAnalysis(result);
      
      // Important: Store in session storage for persistence
      sessionStorage.setItem('comprehensivePalmReadingResult', result);
      
      if (userId) {
        await saveReadingToDatabase(result, true);
      }
      
      setActiveTab('comprehensive');
      setError(null);
      
      toast({
        title: "20-Page Report Ready",
        description: "Your comprehensive PalmCode™ Life Blueprint Report has been generated successfully!",
      });
      
      return true;
    } catch (error) {
      console.error('Error generating comprehensive palm analysis:', error);
      setError(`Error generating comprehensive report: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: "Analysis Error",
        description: "There was an error generating your comprehensive palm reading. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsGeneratingComprehensive(false);
    }
  }, [gemini, userId]);

  const generate50PageReport = useCallback(async (userProfile: any) => {
    console.log('Starting 50-page comprehensive report generation...');
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
    
    setIsGenerating50Page(true);
    setError(null);
    
    try {
      console.log('Generating 50-page report with user profile...');
      toast({
        title: "Generating 50-Page Report",
        description: "Creating your comprehensive palmistry and astrology report. This may take several minutes...",
      });
      
      const result = await gemini.generateComprehensive50PageReport(storedImage, userProfile);
      console.log('50-page report received:', result ? `Success (${result.length} chars)` : 'Empty result');
      
      if (!result || typeof result !== 'string' || result.trim() === '') {
        throw new Error('Empty or invalid result from Gemini API for 50-page report');
      }
      
      console.log('50-page report complete, setting result');
      setComprehensive50PageReport(result);
      
      // Store in session storage for persistence
      sessionStorage.setItem('comprehensive50PageReport', result);
      
      if (userId) {
        await saveReadingToDatabase(result, true);
      }
      
      setActiveTab('50page');
      setShowProfileForm(false);
      setError(null);
      
      toast({
        title: "50-Page Report Ready",
        description: "Your comprehensive palmistry and astrology report has been generated successfully!",
      });
      
      return true;
    } catch (error) {
      console.error('Error generating 50-page report:', error);
      setError(`Error generating 50-page report: ${error instanceof Error ? error.message : 'Unknown error'}`);
      toast({
        title: "Analysis Error",
        description: "There was an error generating your 50-page report. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsGenerating50Page(false);
    }
  }, [gemini, userId]);
  
  useEffect(() => {
    const cleanup = revealAnimation();
    
    const loadData = async () => {
      try {
        setError(null);
        setDebugInfo('Looking for existing palm reading...');
        
        // Try to get the reading from Supabase if user is logged in
        let foundReadingInDb = false;
        
        if (userId) {
          console.log('Checking for reading in database for user:', userId);
          const { data: readings, error: readingsError } = await supabase
            .from('palm_readings')
            .select('results, is_comprehensive')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(2);
            
          if (!readingsError && readings && readings.length > 0) {
            console.log('Found reading(s) in database, using them');
            
            // Process each reading
            readings.forEach(reading => {
              // Ensure results is treated as a string
              const readingText = typeof reading.results === 'object' 
                ? JSON.stringify(reading.results) 
                : String(reading.results);
              
              if (readingText && readingText.length > 100) {
                if (reading.is_comprehensive) {
                  console.log('Setting comprehensive palm analysis from database:', readingText.substring(0, 100) + '...');
                  setComprehensivePalmAnalysis(readingText);
                  sessionStorage.setItem('comprehensivePalmReadingResult', readingText);
                } else {
                  console.log('Setting regular palm analysis from database:', readingText.substring(0, 100) + '...');
                  setPalmAnalysis(readingText);
                  sessionStorage.setItem('palmReadingResult', readingText);
                }
                setHasAttemptedAnalysis(true);
                foundReadingInDb = true;
                setDebugInfo(`Found reading in database: ${readingText.length} characters`);
              }
            });
          } else if (readingsError) {
            console.log('Error fetching readings:', readingsError);
          } else {
            console.log('No readings found in database');
          }
        }
        
        if (!foundReadingInDb) {
          const storedReading = sessionStorage.getItem('palmReadingResult');
          const storedComprehensiveReading = sessionStorage.getItem('comprehensivePalmReadingResult');
          const stored50PageReport = sessionStorage.getItem('comprehensive50PageReport');
          const storedImage = sessionStorage.getItem('palmImage');
          
          console.log('Checking stored reading:', storedReading ? 'Found' : 'Not found');
          console.log('Checking stored comprehensive reading:', storedComprehensiveReading ? 'Found' : 'Not found');
          console.log('Checking stored 50-page report:', stored50PageReport ? 'Found' : 'Not found');
          console.log('Checking stored image:', storedImage ? 'Found' : 'Not found');
          
          if (stored50PageReport && stored50PageReport.trim().length > 10) {
            setComprehensive50PageReport(stored50PageReport);
            setHasAttemptedAnalysis(true);
            setDebugInfo(`Using stored 50-page report: ${stored50PageReport.length} characters`);
            setActiveTab('50page');
          } else if (storedComprehensiveReading && storedComprehensiveReading.trim().length > 10) {
            setComprehensivePalmAnalysis(storedComprehensiveReading);
            setHasAttemptedAnalysis(true);
            setDebugInfo(`Using stored comprehensive reading: ${storedComprehensiveReading.length} characters`);
            setActiveTab('comprehensive');
          }
          
          if (storedReading && storedReading.trim().length > 10) {
            // Content exists and is reasonably long
            console.log('Found valid stored reading, using it');
            console.log('Reading preview:', storedReading.substring(0, 100) + '...');
            setPalmAnalysis(storedReading);
            setHasAttemptedAnalysis(true);
            setDebugInfo(`Using stored reading: ${storedReading.length} characters`);
            
            if (!storedComprehensiveReading && !stored50PageReport) {
              setActiveTab('basic');
            }
          } else if (storedImage && gemini && !isGeminiLoading && !isAnalyzing) {
            console.log('No valid stored reading but we have image and gemini, analyzing now...');
            setDebugInfo('Starting new analysis...');
            await analyzePalm();
          } else if (!storedImage) {
            console.log('No palm image found, redirecting to upload page');
            setDebugInfo('No palm image found, redirecting...');
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
        setDebugInfo(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    
    if (!isGeminiLoading) {
      loadData();
    }
    
    return () => {
      cleanup();
    };
  }, [navigate, gemini, isGeminiLoading, analyzePalm, userId]);

  // Fixed function to properly format and display content
  const formatAnalysisContent = (content: string) => {
    if (!content || typeof content !== 'string' || content.trim() === '') {
      console.log('No content to format or invalid content type');
      return <p className="text-black font-medium">No analysis content available.</p>;
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
            elements.push(<ul key={`list-${index}`} className="list-disc my-4 ml-6">
                {currentList}
              </ul>);
            currentList = [];
            inList = false;
          }
          elements.push(<div key={`empty-${index}`} className="my-2"></div>);
          return;
        }
        
        // Handle headers
        if (line.match(/^# /)) {
          if (inList) {
            elements.push(<ul key={`list-${index}`} className="list-disc my-4 ml-6">
                {currentList}
              </ul>);
            currentList = [];
            inList = false;
          }
          elements.push(
            <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-black">
              {line.replace(/^# /, '')}
            </h1>
          );
          return;
        }
        
        if (line.match(/^## /)) {
          if (inList) {
            elements.push(<ul key={`list-${index}`} className="list-disc my-4 ml-6">
                {currentList}
              </ul>);
            currentList = [];
            inList = false;
          }
          elements.push(
            <h2 key={index} className="text-xl font-bold mt-5 mb-3 text-black">
              {line.replace(/^## /, '')}
            </h2>
          );
          return;
        }
        
        if (line.match(/^### /)) {
          if (inList) {
            elements.push(<ul key={`list-${index}`} className="list-disc my-4 ml-6">
                {currentList}
              </ul>);
            currentList = [];
            inList = false;
          }
          elements.push(
            <h3 key={index} className="text-lg font-bold mt-4 mb-2 text-black">
              {line.replace(/^### /, '')}
            </h3>
          );
          return;
        }

        // Special handling for page numbers in comprehensive report
        if (line.match(/^PAGE \d+:/)) {
          if (inList) {
            elements.push(<ul key={`list-${index}`} className="list-disc my-4 ml-6">
                {currentList}
              </ul>);
            currentList = [];
            inList = false;
          }
          elements.push(
            <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-primary border-b border-primary pb-2">
              {line}
            </h2>
          );
          return;
        }
        
        // Handle lists
        if (line.match(/^- /) || line.match(/^\* /)) {
          inList = true;
          const listItem = (
            <li key={`item-${index}`} className="mb-1 text-black">
              {renderFormattedText(line.replace(/^-\s+/, '').replace(/^\*\s+/, ''))}
            </li>
          );
          currentList.push(listItem);
          return;
        }
        
        // Handle horizontal rule
        if (line.match(/^---+$/)) {
          if (inList) {
            elements.push(<ul key={`list-${index}`} className="list-disc my-4 ml-6">
                {currentList}
              </ul>);
            currentList = [];
            inList = false;
          }
          elements.push(<hr key={index} className="my-6 border-t border-gray-300" />);
          return;
        }
        
        // Default paragraph handling
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc my-4 ml-6">
              {currentList}
            </ul>);
          currentList = [];
          inList = false;
        }
        
        elements.push(
          <p key={index} className="mb-3 text-black">
            {renderFormattedText(line)}
          </p>
        );
      });
      
      // Add any remaining list items
      if (inList && currentList.length > 0) {
        elements.push(<ul key="list-end" className="list-disc my-4 ml-6">{currentList}</ul>);
      }
      
      return <div className="palm-reading-content text-black">{elements}</div>;
    } catch (error) {
      console.error('Error formatting content:', error);
      // Fallback rendering if there's an error in the formatting logic
      return (
        <div className="palm-reading-content-fallback whitespace-pre-wrap text-black bg-gray-50 p-4 rounded-md border border-gray-200">
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
              return <strong key={idx} className="text-black">{part.substring(2, part.length - 2)}</strong>;
            }
            return <span key={idx} className="text-black">{part}</span>;
          })}
        </>
      );
    } catch (error) {
      console.error('Error in renderFormattedText:', error);
      return <span className="text-black">{text}</span>;
    }
  };

  const handleFullReportDownload = async () => {
    const currentAnalysis = activeTab === 'basic' ? palmAnalysis : 
                            activeTab === 'comprehensive' ? comprehensivePalmAnalysis : 
                            comprehensive50PageReport;
    const title = activeTab === 'basic' ? "Palm Reading Analysis" : 
                  activeTab === 'comprehensive' ? "PalmCode™ Life Blueprint Report" : 
                  "Comprehensive 50-Page Palmistry & Astrology Report";
    const subtitle = activeTab === 'basic' ? "Comprehensive Personal Insights" : 
                     activeTab === 'comprehensive' ? "20-Page Personalized Analysis" : 
                     "50-Page In-Depth Life Report";
    const fileName = activeTab === 'basic' ? "Palm_Reading_Report.pdf" : 
                     activeTab === 'comprehensive' ? "PalmCode_Life_Blueprint_Report.pdf" : 
                     "50_Page_Comprehensive_Report.pdf";
    
    toast({
      title: "Generating Report",
      description: `Your ${activeTab === 'basic' ? 'palmistry report' : activeTab === 'comprehensive' ? '20-page PalmCode™ report' : '50-page comprehensive report'} is being prepared for download...`,
    });
    
    try {
      await generatePDF({
        title,
        subtitle,
        content: currentAnalysis || "No analysis available",
        fileName
      });
      
      toast({
        title: "Success",
        description: "Your report has been downloaded successfully.",
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
    if (activeTab === 'basic') {
      setPalmAnalysis(null);
      sessionStorage.removeItem('palmReadingResult');
      await analyzePalm();
    } else if (activeTab === 'comprehensive') {
      setComprehensivePalmAnalysis(null);
      sessionStorage.removeItem('comprehensivePalmReadingResult');
      await generateComprehensiveReport();
    } else {
      setComprehensive50PageReport(null);
      sessionStorage.removeItem('comprehensive50PageReport');
      setShowProfileForm(true);
    }
  };
  
  const isLoading = isGeminiLoading || isAnalyzing || isGeneratingComprehensive || isGenerating50Page;
  
  if (isLoading && !showProfileForm) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="content-container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  {isGenerating50Page 
                    ? "Creating Your 50-Page Comprehensive Report" 
                    : isGeneratingComprehensive 
                    ? "Creating Your 20-Page PalmCode™ Life Blueprint Report" 
                    : "Analyzing Your Palm"
                  }
                </h2>
                <p className="text-muted-foreground">
                  {isGenerating50Page 
                    ? "Our AI is generating your comprehensive 50-page personalized report with palmistry and astrology insights. This may take 3-5 minutes..." 
                    : isGeneratingComprehensive 
                    ? "Our AI is generating your comprehensive 20-page personalized report. This may take 1-2 minutes..." 
                    : "Our AI is carefully analyzing your palm image to generate a palmistry report. This may take a moment..."
                  }
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (showProfileForm) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32 pb-24">
          <div className="content-container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="heading-lg mb-4 text-black">Generate 50-Page Comprehensive Report</h1>
                <p className="text-muted-foreground text-lg">
                  Provide your personal details for an in-depth palmistry and astrology analysis that combines traditional wisdom with modern insights.
                </p>
              </div>
              <UserProfileForm 
                onSubmit={generate50PageReport} 
                isLoading={isGenerating50Page}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="content-container">
          <div className="max-w-4xl mx-auto text-center mb-12 reveal">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Hand className="h-4 w-4 mr-2" />
              Comprehensive Palmistry Analysis
            </div>
            <h1 className="heading-lg mb-6 text-black">Your Palm Reading Report</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              This analysis is based on traditional palmistry principles, examining your hand shape, lines, mounts, and unique features to provide insights into your personality and life journey.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-10 mb-16 reveal bg-white">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h2 className="heading-md text-black">
                {activeTab === '50page' 
                  ? "50-Page Comprehensive Report" 
                  : activeTab === 'comprehensive' 
                  ? "PalmCode™ Life Blueprint Report" 
                  : "Palmistry Report"
                }
              </h2>
              <div className="flex gap-3 flex-wrap">
                <button 
                  onClick={handleFullReportDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                  disabled={!palmAnalysis && !comprehensivePalmAnalysis && !comprehensive50PageReport}
                >
                  <Download className="h-4 w-4" />
                  <span>Download Report</span>
                </button>
                {!comprehensive50PageReport && (
                  <button 
                    onClick={() => setShowProfileForm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-colors cursor-pointer"
                  >
                    <Star className="h-4 w-4" />
                    <span>Generate 50-Page Report</span>
                  </button>
                )}
                {!comprehensivePalmAnalysis && palmAnalysis && (
                  <button 
                    onClick={generateComprehensiveReport}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors cursor-pointer"
                    disabled={isGeneratingComprehensive}
                  >
                    <Book className="h-4 w-4" />
                    <span>Generate 20-Page Report</span>
                  </button>
                )}
                <button 
                  onClick={retryAnalysis}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors cursor-pointer"
                  title="Generate a new reading with the same image"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>
            
            {(comprehensivePalmAnalysis || comprehensive50PageReport) && (
              <Tabs defaultValue={activeTab} className="w-full mb-6" onValueChange={setActiveTab}>
                <TabsList className={`grid w-full ${comprehensive50PageReport ? 'grid-cols-3' : 'grid-cols-2'} mb-8`}>
                  <TabsTrigger value="basic" className="text-sm">Standard Report</TabsTrigger>
                  <TabsTrigger value="comprehensive" className="text-sm">20-Page PalmCode™</TabsTrigger>
                  {comprehensive50PageReport && (
                    <TabsTrigger value="50page" className="text-sm">50-Page Complete</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="basic" className="mt-0">
                  {/* Basic report content */}
                  {palmAnalysis ? (
                    <div className="prose prose-lg max-w-none text-left bg-white text-black border p-6 rounded-lg shadow-sm">
                      {formatAnalysisContent(palmAnalysis)}
                    </div>
                  ) : error ? (
                    <div className="p-6 border border-red-300 rounded-lg bg-red-50 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
                        <h3 className="text-xl font-medium text-red-700">Analysis Failed</h3>
                      </div>
                      <p className="text-red-600 font-medium mb-2">Error: {error}</p>
                      <Button onClick={analyzePalm} variant="default">Try Again</Button>
                    </div>
                  ) : (
                    <div className="p-6 border border-yellow-300 rounded-lg bg-yellow-50 text-center">
                      <p className="text-center text-gray-700 italic mb-4">
                        {hasAttemptedAnalysis 
                          ? "Analysis could not be generated. Please try uploading a clearer image of your palm." 
                          : "No palm analysis available. Please upload a palm image for analysis."}
                      </p>
                      <Button onClick={() => navigate('/palm-reading')} variant="default">Upload Palm Image</Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="comprehensive" className="mt-0">
                  {/* Comprehensive report content */}
                  {comprehensivePalmAnalysis ? (
                    <div className="prose prose-lg max-w-none text-left bg-white text-black border p-6 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-6 pb-3 border-b">
                        <h1 className="text-2xl font-bold text-primary">PalmCode™ Life Blueprint Report</h1>
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      {formatAnalysisContent(comprehensivePalmAnalysis)}
                    </div>
                  ) : (
                    <div className="p-6 border border-blue-300 rounded-lg bg-blue-50 text-center">
                      <div className="flex items-center justify-center mb-4">
                        <Book className="h-8 w-8 text-blue-500 mr-2" />
                        <h3 className="text-xl font-medium text-blue-700">Generate Your 20-Page Report</h3>
                      </div>
                      <p className="text-gray-700 mb-4">
                        Unlock a comprehensive 20-page PalmCode™ Life Blueprint Report that provides deep insights into your personality, relationships, career, purpose, and more.
                      </p>
                      <Button 
                        onClick={generateComprehensiveReport} 
                        variant="default"
                        disabled={isGeneratingComprehensive}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isGeneratingComprehensive ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Book className="mr-2 h-4 w-4" />
                            Generate 20-Page Report
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {comprehensive50PageReport && (
                  <TabsContent value="50page" className="mt-0">
                    <div className="prose prose-lg max-w-none text-left bg-white text-black border p-6 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-6 pb-3 border-b">
                        <h1 className="text-2xl font-bold text-gradient bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">50-Page Comprehensive Report</h1>
                        <Star className="h-6 w-6 text-purple-600" />
                      </div>
                      {formatAnalysisContent(comprehensive50PageReport)}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            )}
            
            {!comprehensivePalmAnalysis && !comprehensive50PageReport && (
              <div className="prose prose-lg max-w-none text-left bg-white text-black border p-6 rounded-lg shadow-sm">
                {palmAnalysis ? (
                  formatAnalysisContent(palmAnalysis)
                ) : error ? (
                  <div className="p-6 border border-red-300 rounded-lg bg-red-50 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
                      <h3 className="text-xl font-medium text-red-700">Analysis Failed</h3>
                    </div>
                    <p className="text-red-600 font-medium mb-2">Error: {error}</p>
                    <p className="text-gray-700 mb-4">
                      Unable to generate palm analysis. This could be due to one of the following reasons:
                    </p>
                    <ul className="text-left list-disc mb-6 mx-auto max-w-md text-gray-700">
                      <li className="mb-2">Your Gemini API key may be invalid or expired</li>
                      <li className="mb-2">The palm image might not be clear enough for analysis</li>
                      <li className="mb-2">There might be connection issues with the Gemini API</li>
                    </ul>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={retryAnalysis}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
                      >
                        Try Again
                      </button>
                      <button
                        onClick={() => navigate('/palm-reading')}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer"
                      >
                        Upload New Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border border-yellow-300 rounded-lg bg-yellow-50 text-center">
                    <p className="text-center text-gray-700 italic mb-4">
                      {hasAttemptedAnalysis 
                        ? "Analysis could not be generated. Please try uploading a clearer image of your palm." 
                        : "No palm analysis available. Please upload a palm image for analysis."}
                    </p>
                    <button
                      onClick={() => navigate('/palm-reading')}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer"
                    >
                      Upload Palm Image
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Upgrade banners */}
            {!isGenerating50Page && !comprehensive50PageReport && (palmAnalysis || comprehensivePalmAnalysis) && (
              <div className="mt-8 p-6 border border-purple-300 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-purple-600 mr-2" />
                  <h3 className="text-xl font-medium text-purple-700">Upgrade to 50-Page Comprehensive Report</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Get the ultimate palmistry and astrology analysis with detailed predictions, timing, career guidance, relationship insights, health patterns, and actionable success strategies!
                </p>
                <Button 
                  onClick={() => setShowProfileForm(true)} 
                  variant="default"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Star className="mr-2 h-4 w-4" />
                  Generate 50-Page Report
                </Button>
              </div>
            )}

            {!isGeneratingComprehensive && !comprehensivePalmAnalysis && !comprehensive50PageReport && palmAnalysis && (
              <div className="mt-8 p-6 border border-primary/30 rounded-lg bg-primary/5 text-center">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-primary mr-2" />
                  <h3 className="text-xl font-medium text-primary">Upgrade to 20-Page PalmCode™ Life Blueprint Report</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Get a detailed 20-page personalized analysis covering personality, relationships, career path, purpose, health, success timing, and more!
                </p>
                <Button 
                  onClick={generateComprehensiveReport} 
                  variant="default"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Book className="mr-2 h-4 w-4" />
                  Generate 20-Page Report
                </Button>
              </div>
            )}
          </div>
          
          <div className="text-center max-w-2xl mx-auto reveal">
            <Link to="/palm-reading" className="inline-block px-8 py-3 rounded-full bg-secondary text-secondary-foreground text-base font-medium hover:bg-secondary/90 transition-colors mb-6">
              Upload Another Palm Image
            </Link>
            <p className="text-muted-foreground">
              Want even more detailed insights? Check out our <Link to="/compatibility" className="text-primary hover:underline">compatibility analysis</Link> for relationship matching.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PalmReadingResult;
