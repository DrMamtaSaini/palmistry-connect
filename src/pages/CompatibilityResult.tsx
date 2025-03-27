
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { revealAnimation } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Heart } from 'lucide-react';

const CompatibilityResult = () => {
  const [result, setResult] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const cleanup = revealAnimation();
    return cleanup;
  }, []);
  
  useEffect(() => {
    // Get compatibility result from sessionStorage
    const storedResult = sessionStorage.getItem('compatibilityResult');
    if (storedResult) {
      setResult(storedResult);
    } else {
      // If no result, redirect back to compatibility page
      navigate('/compatibility');
    }
  }, [navigate]);
  
  const handleBackClick = () => {
    navigate('/compatibility');
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
            <h1 className="heading-lg mb-6">Your Relationship Compatibility Results</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Based on the palm images provided, our AI has analyzed your relationship compatibility.
              The following insights reveal your relationship dynamics, strengths, and potential.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-10 mb-12 reveal">
            {result ? (
              <div className="prose prose-lg max-w-none">
                {result.split('\n').map((paragraph, index) => (
                  <p key={index} className={index === 0 ? 'font-medium text-lg' : ''}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading compatibility analysis...</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-4 reveal">
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
              disabled={!result}
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CompatibilityResult;
