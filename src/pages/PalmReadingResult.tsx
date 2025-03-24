
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hand, Download, Share2, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { revealAnimation } from '@/lib/animations';

const PalmReadingResult = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const cleanup = revealAnimation();
    
    // Redirect if accessed directly without going through the palm reading process
    const hasAnalyzed = localStorage.getItem('palmAnalyzed');
    if (!hasAnalyzed) {
      navigate('/palm-reading');
    }
    
    return () => {
      cleanup();
    };
  }, [navigate]);
  
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
              This is a simulated pro version of the palm reading results to help you test the feature.
              In a real implementation, this would contain AI-generated insights about your palm.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-10 mb-16 reveal">
            <div className="flex items-center justify-between mb-8">
              <h2 className="heading-md">Reading Summary</h2>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="text-xl font-semibold mb-4">Personality Traits</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="font-medium">Strong Leadership Qualities</p>
                    <p className="text-black mt-1">Your palm shows distinct markings indicative of natural leadership abilities and decision-making skills.</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="font-medium">Creative Thinking</p>
                    <p className="text-black mt-1">The unique pattern on your palm suggests a creative mind with excellent problem-solving capabilities.</p>
                  </div>
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="font-medium">Emotional Intelligence</p>
                    <p className="text-black mt-1">Your palm lines reveal a high degree of empathy and emotional understanding of others.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Life Path Insights</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-secondary/5 rounded-lg">
                    <p className="font-medium">Career Trajectory</p>
                    <p className="text-black mt-1">The fate line on your palm indicates potential for significant career advancement in the next 2-3 years.</p>
                  </div>
                  <div className="p-4 bg-secondary/5 rounded-lg">
                    <p className="font-medium">Relationship Patterns</p>
                    <p className="text-black mt-1">Your heart line suggests deep, meaningful connections with a small circle of close relationships.</p>
                  </div>
                  <div className="p-4 bg-secondary/5 rounded-lg">
                    <p className="font-medium">Financial Outlook</p>
                    <p className="text-black mt-1">Multiple intersecting lines indicate periods of financial stability alternating with growth opportunities.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4">Major Life Lines Analysis</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 border border-primary/20 rounded-xl">
                  <h4 className="font-medium mb-2">Heart Line</h4>
                  <p className="text-black">Your heart line indicates emotional stability and capacity for deep connections. You approach relationships with authenticity and value loyalty above all.</p>
                </div>
                <div className="p-6 border border-primary/20 rounded-xl">
                  <h4 className="font-medium mb-2">Head Line</h4>
                  <p className="text-black">Your head line shows analytical thinking and strategic planning abilities. You make decisions carefully, considering multiple perspectives.</p>
                </div>
                <div className="p-6 border border-primary/20 rounded-xl">
                  <h4 className="font-medium mb-2">Life Line</h4>
                  <p className="text-black">Your life line indicates vitality and resilience. The depth suggests good health and energy for pursuing your goals and passions.</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Health & Wellbeing</h3>
              <p className="text-black mb-4">Based on your palm's characteristics, here are some health insights and recommendations:</p>
              <ul className="list-disc list-inside space-y-2 text-black">
                <li>Your palm shows signs of good overall vitality, but may benefit from stress management practices.</li>
                <li>Consider incorporating more mindfulness activities to balance your analytical tendencies.</li>
                <li>Your hand structure suggests a potential need for better wrist and hand ergonomics, especially if you do computer work.</li>
                <li>Regular cardiovascular exercise would complement your natural energy patterns.</li>
                <li>Your palm suggests you may benefit from creative activities as a form of stress relief.</li>
              </ul>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-10 mb-16 reveal">
            <div className="flex items-center mb-6">
              <BookOpen className="h-6 w-6 text-primary mr-3" />
              <h2 className="heading-md">Future Timeline Predictions</h2>
            </div>
            
            <div className="mb-8">
              <p className="text-black mb-6">Based on your palm's unique markers, we can identify key potential turning points in your future:</p>
              
              <div className="relative border-l-2 border-primary/30 pl-8 ml-4 pb-4">
                <div className="mb-8 relative">
                  <div className="absolute w-4 h-4 bg-primary rounded-full -left-[41px] top-0"></div>
                  <h3 className="text-lg font-semibold mb-2">Next 6 Months</h3>
                  <p className="text-black">A period of transition appears likely, with new opportunities in your professional life. Be open to unexpected offers or changes in your current role.</p>
                </div>
                
                <div className="mb-8 relative">
                  <div className="absolute w-4 h-4 bg-primary rounded-full -left-[41px] top-0"></div>
                  <h3 className="text-lg font-semibold mb-2">1-2 Years</h3>
                  <p className="text-black">Significant relationship developments are indicated, either strengthening existing bonds or forming important new connections that will influence your path.</p>
                </div>
                
                <div className="mb-8 relative">
                  <div className="absolute w-4 h-4 bg-primary rounded-full -left-[41px] top-0"></div>
                  <h3 className="text-lg font-semibold mb-2">3-5 Years</h3>
                  <p className="text-black">A major achievement or milestone is suggested in this timeframe. Your preparation and skills will converge to create a significant breakthrough.</p>
                </div>
                
                <div className="relative">
                  <div className="absolute w-4 h-4 bg-primary rounded-full -left-[41px] top-0"></div>
                  <h3 className="text-lg font-semibold mb-2">5+ Years</h3>
                  <p className="text-black">Long-term prosperity is indicated, with stability in multiple areas of life. The foundations you're building now will support continued growth and fulfillment.</p>
                </div>
              </div>
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
