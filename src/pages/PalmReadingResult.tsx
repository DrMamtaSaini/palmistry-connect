
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hand, Download, Share2, BookOpen, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { revealAnimation } from '@/lib/animations';
import { generatePDF } from '@/lib/pdfUtils';
import { toast } from '@/hooks/use-toast';
import { useGemini } from '@/contexts/GeminiContext';

const PalmReadingResult = () => {
  const navigate = useNavigate();
  const [palmAnalysis, setPalmAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAttemptedAnalysis, setHasAttemptedAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { gemini, isLoading: isGeminiLoading } = useGemini();
  
  const analyzePalm = useCallback(async () => {
    const storedImage = sessionStorage.getItem('palmImage');
    
    if (!storedImage || !gemini) {
      console.error('Missing image or Gemini not initialized');
      setError('Missing image or Gemini not initialized');
      return false;
    }
    
    setIsAnalyzing(true);
    try {
      console.log('Starting palm analysis...');
      const result = await gemini.analyzePalm(storedImage);
      console.log('Analysis complete, setting result');
      setPalmAnalysis(result);
      sessionStorage.setItem('palmReadingResult', result);
      return true;
    } catch (error) {
      console.error('Error analyzing palm:', error);
      setError('Error analyzing palm. Please try again.');
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
  }, [gemini]);
  
  useEffect(() => {
    const cleanup = revealAnimation();
    
    const loadData = async () => {
      // Get stored palm reading from sessionStorage
      const storedReading = sessionStorage.getItem('palmReadingResult');
      const storedImage = sessionStorage.getItem('palmImage');
      
      if (storedReading) {
        console.log('Found stored reading, using it');
        setPalmAnalysis(storedReading);
        setHasAttemptedAnalysis(true);
      } else if (storedImage && gemini && !isGeminiLoading && !hasAttemptedAnalysis) {
        console.log('No stored reading but we have image and gemini, analyzing');
        await analyzePalm();
      } else if (!storedImage) {
        // If no image, redirect to upload page
        console.log('No palm image found, redirecting to upload page');
        toast({
          title: "No Palm Image",
          description: "Please upload a palm image for analysis first.",
        });
        navigate('/palm-reading');
      }
    };
    
    if (!isGeminiLoading) {
      loadData();
    }
    
    return () => {
      cleanup();
    };
  }, [navigate, gemini, isGeminiLoading, analyzePalm, hasAttemptedAnalysis]);

  const formatAnalysisContent = (content: string) => {
    // Convert markdown-style sections into formatted HTML
    const sections = content.split(/\n#{2,3} /);
    
    if (sections.length <= 1) {
      return content.split('\n').map((para, idx) => (
        <p key={idx} className="mb-4">{para}</p>
      ));
    }
    
    // Extract the first section (intro text)
    const intro = sections[0];
    const formattedSections = sections.slice(1).map((section, index) => {
      const sectionTitle = section.split('\n')[0];
      const sectionContent = section.slice(sectionTitle.length).trim();
      
      return (
        <div key={index} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{sectionTitle}</h3>
          {sectionContent.split('\n\n').map((para, paraIdx) => (
            <p key={paraIdx} className="mb-4">{para}</p>
          ))}
        </div>
      );
    });
    
    return (
      <>
        {intro.split('\n\n').map((para, idx) => (
          <p key={`intro-${idx}`} className="mb-4">{para}</p>
        ))}
        {formattedSections}
      </>
    );
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
                  Our AI is carefully analyzing your palm image. This may take a moment...
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
              Complete Palm Analysis
            </div>
            <h1 className="heading-lg mb-6">Your Premium Palm Reading Results</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              This analysis is based on our AI's interpretation of your palm image using traditional palmistry principles.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-10 mb-16 reveal">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
              <h2 className="heading-md">Complete Analysis</h2>
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
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
            
            <div className="prose prose-lg max-w-none text-left">
              {palmAnalysis ? (
                formatAnalysisContent(palmAnalysis)
              ) : error ? (
                <div className="p-6 border border-red-300 rounded-lg bg-red-50 text-center">
                  <p className="text-red-600 font-medium mb-2">Error: {error}</p>
                  <p className="text-muted-foreground">
                    Unable to generate palm analysis. Please try uploading a clearer image.
                  </p>
                </div>
              ) : (
                <p className="text-center text-muted-foreground italic">
                  {hasAttemptedAnalysis 
                    ? "Analysis could not be generated. Please try uploading a clearer image of your palm." 
                    : "No palm analysis available. Please upload a palm image for analysis."}
                </p>
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
