import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { revealAnimation } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Heart, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { generatePDF } from '@/lib/pdfUtils';
import { useToast } from '@/hooks/use-toast';

const CompatibilityResult = () => {
  const [result, setResult] = useState<string | null>(null);
  const [sections, setSections] = useState<{[key: string]: string}>({});
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [yourName, setYourName] = useState<string>('');
  const [partnerName, setPartnerName] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const cleanup = revealAnimation();
    return cleanup;
  }, []);
  
  useEffect(() => {
    // Get compatibility result from sessionStorage
    const storedResult = sessionStorage.getItem('compatibilityResult');
    const storedYourName = sessionStorage.getItem('yourName') || '';
    const storedPartnerName = sessionStorage.getItem('partnerName') || '';
    
    setYourName(storedYourName);
    setPartnerName(storedPartnerName);
    
    if (storedResult) {
      setResult(storedResult);
      parseResultSections(storedResult);
    } else {
      // If no result, redirect back to compatibility page
      navigate('/compatibility');
    }
  }, [navigate]);
  
  const parseResultSections = (resultText: string) => {
    const sectionMap: {[key: string]: string} = {};
    const lines = resultText.split('\n');
    
    let currentSection = 'Overview';
    let currentContent: string[] = [];
    
    // Extract overall percentage if available
    const percentageMatch = resultText.match(/(\d{1,3})%/);
    if (percentageMatch) {
      setOverallScore(parseInt(percentageMatch[1]));
    }
    
    // Parse sections
    for (const line of lines) {
      // Check if line is a header
      if (line.match(/^#+\s/) || line.match(/^[0-9]+\.\s/) || line.startsWith('Overall Compatibility') || 
          line.startsWith('Hand Shape') || line.startsWith('Heart Line') ||
          line.startsWith('Head Line') || line.startsWith('Fate Line') || 
          line.startsWith('Venus Mount') || line.startsWith('Marriage Line') ||
          line.startsWith('Relationship Strengths') || line.startsWith('Relationship Challenges') ||
          line.startsWith('Personalized Advice')) {
        
        // Save previous section
        if (currentContent.length > 0) {
          sectionMap[currentSection] = currentContent.join('\n');
        }
        
        // Start new section
        currentSection = line.replace(/^#+\s/, '').replace(/^[0-9]+\.\s/, '');
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }
    
    // Add the last section
    if (currentContent.length > 0) {
      sectionMap[currentSection] = currentContent.join('\n');
    }
    
    setSections(sectionMap);
  };
  
  const handleBackClick = () => {
    navigate('/compatibility');
  };
  
  const handleDownloadReport = async () => {
    if (!result) return;
    
    setIsDownloading(true);
    try {
      const fileName = `Palm_Compatibility_${yourName ? yourName + '_' : ''}${partnerName ? partnerName : 'Report'}.pdf`;
      
      await generatePDF({
        title: 'Palm Compatibility Analysis',
        subtitle: yourName && partnerName ? `${yourName} & ${partnerName}` : 'Relationship Compatibility Report',
        content: result,
        fileName
      });
      
      toast({
        title: "Report Downloaded",
        description: "Your compatibility report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was a problem downloading your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Function to get score color based on value
  const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-300";
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-emerald-400";
    if (score >= 40) return "bg-yellow-500";
    if (score >= 20) return "bg-orange-500";
    return "bg-red-500";
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="content-container">
          <div className="max-w-4xl mx-auto text-center mb-12 reveal">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Heart className="h-4 w-4 mr-2" />
              Compatibility Analysis
            </div>
            <h1 className="heading-lg mb-6">
              {yourName && partnerName 
                ? `${yourName} & ${partnerName}'s Compatibility`
                : 'Your Relationship Compatibility Results'}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Based on palmistry principles, our AI has analyzed your relationship compatibility.
              The following insights reveal your relationship dynamics, strengths, and potential.
            </p>
            
            {overallScore !== null && (
              <div className="mt-8 mb-4">
                <div className="text-2xl font-bold mb-2">Overall Compatibility Score</div>
                <div className="w-full max-w-md mx-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Low</span>
                    <span className="text-lg font-bold">{overallScore}%</span>
                    <span className="text-sm">High</span>
                  </div>
                  <Progress value={overallScore} className="h-3" indicatorClassName={getScoreColor(overallScore)} />
                </div>
              </div>
            )}
          </div>
          
          <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-8 mb-12 reveal">
            {result ? (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="emotional">Emotional</TabsTrigger>
                  <TabsTrigger value="communication">Communication</TabsTrigger>
                  <TabsTrigger value="life-path">Life Path</TabsTrigger>
                  <TabsTrigger value="advice">Advice</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="prose prose-lg max-w-none">
                    {sections['Overall Compatibility'] && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Overall Compatibility</h3>
                        <p>{sections['Overall Compatibility']}</p>
                      </div>
                    )}
                    
                    {sections['Hand Shape & Element Matching'] && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Hand Shape & Element Matching</h3>
                        <p>{sections['Hand Shape & Element Matching']}</p>
                      </div>
                    )}
                    
                    {sections['Relationship Strengths'] && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Relationship Strengths</h3>
                        <p>{sections['Relationship Strengths']}</p>
                      </div>
                    )}
                    
                    {sections['Relationship Challenges'] && (
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Relationship Challenges</h3>
                        <p>{sections['Relationship Challenges']}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="emotional" className="space-y-6">
                  <div className="prose prose-lg max-w-none">
                    {sections['Heart Line Analysis'] && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Heart Line Analysis</h3>
                        <p>{sections['Heart Line Analysis']}</p>
                      </div>
                    )}
                    
                    {sections['Venus Mount Analysis'] && (
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Venus Mount Analysis</h3>
                        <p>{sections['Venus Mount Analysis']}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="communication" className="space-y-6">
                  <div className="prose prose-lg max-w-none">
                    {sections['Head Line Analysis'] && (
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Head Line Analysis</h3>
                        <p>{sections['Head Line Analysis']}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="life-path" className="space-y-6">
                  <div className="prose prose-lg max-w-none">
                    {sections['Fate Line Comparison'] && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Fate Line Comparison</h3>
                        <p>{sections['Fate Line Comparison']}</p>
                      </div>
                    )}
                    
                    {sections['Marriage Line Assessment'] && (
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Marriage Line Assessment</h3>
                        <p>{sections['Marriage Line Assessment']}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="advice" className="space-y-6">
                  <div className="prose prose-lg max-w-none">
                    {sections['Personalized Advice'] || sections['Personalized Advice for Improving Compatibility'] ? (
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Personalized Advice</h3>
                        <p>{sections['Personalized Advice'] || sections['Personalized Advice for Improving Compatibility']}</p>
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground">No personalized advice available in this report.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12">
                <Loader2 className="animate-spin h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading compatibility analysis...</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-4 flex-wrap reveal">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Compatibility
            </Button>
            
            <Button 
              className="flex items-center gap-2"
              disabled={!result || isDownloading}
              onClick={handleDownloadReport}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Report
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CompatibilityResult;
