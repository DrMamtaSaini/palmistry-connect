import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Hand, Download, Share2, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { revealAnimation } from '@/lib/animations';
import { generatePDF } from '@/lib/pdfUtils';
import { toast } from '@/hooks/use-toast';

const PalmReadingResult = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const cleanup = revealAnimation();
    return () => {
      cleanup();
    };
  }, [navigate]);

  const handleFullReportDownload = async () => {
    toast({
      title: "Generating Full Report",
      description: "Your comprehensive report is being prepared for download...",
    });
    
    const demoContent = `
# **Palm Reading Analysis Report**

📅 **Date of Analysis:** ${new Date().toLocaleDateString()}

## **Personality Traits**

**Strong Leadership Qualities**
Your palm shows distinct markings indicative of natural leadership abilities and decision-making skills. The strong, straight head line that crosses your palm indicates analytical thinking and strategic planning abilities. You have a natural inclination to take charge in situations and guide others.

**Creative Thinking**
The unique pattern on your palm suggests a creative mind with excellent problem-solving capabilities. The branches extending from your head line toward your mount of Luna show imagination and creative thinking. You can visualize solutions that others might miss.

**Emotional Intelligence**
Your palm lines reveal a high degree of empathy and emotional understanding of others. The well-developed heart line with small branches indicates sensitivity to others' feelings and needs. You can navigate complex social situations with ease and build strong relationships.

## **Life Path Insights**

**Career Trajectory**
The fate line on your palm indicates potential for significant career advancement in the next 2-3 years. The deep, clear line running from the base of your palm toward your middle finger suggests a focused and purposeful career path. A branch around the middle of this line indicates a positive shift or opportunity that will advance your professional life.

**Relationship Patterns**
Your heart line suggests deep, meaningful connections with a small circle of close relationships. The curved line that sweeps across the upper palm indicates a romantic and idealistic approach to relationships. You value quality over quantity in your connections and prefer deep, meaningful bonds.

**Financial Outlook**
Multiple intersecting lines indicate periods of financial stability alternating with growth opportunities. The triangle formation between your fate, head, and life lines suggests periods of financial good fortune. You have the ability to recognize and act on profitable opportunities when they present themselves.

## **Comprehensive Life Analysis**

**Detailed Career Trajectory**
Your palm shows exceptional career potential with multiple branching opportunities. The intersection of your fate line with other major lines indicates:

- Leadership roles in innovative fields
- Entrepreneurial success markers
- Creative problem-solving abilities
- Strategic thinking capabilities

The strong connection between your head line and fate line suggests you'll excel in roles that require both analytical thinking and decisive action. Your success will come from combining practical skills with innovative approaches.

**Deep Relationship Analysis**
Your heart and head lines reveal complex relationship patterns:

- Deep emotional connections with select individuals
- Strong family bonds and genetic influences
- Professional relationship dynamics
- Friendship circle analysis

The distance between your heart and head lines indicates a good balance between emotional and rational thinking in relationships. This allows you to form strong bonds while maintaining healthy boundaries.

**Financial Prosperity Indicators**
Multiple wealth lines and markers suggest:

- Investment opportunities and timing
- Risk assessment capabilities
- Long-term financial stability indicators
- Wealth accumulation patterns

The money triangle formed by the intersection of various minor lines on your palm indicates a natural ability to attract and grow wealth. Your financial journey will include periods of steady growth interrupted by occasional significant gains.

## **Health & Wellbeing**

Based on your palm's characteristics, here are some health insights and recommendations:

- Your palm shows signs of good overall vitality, but may benefit from stress management practices.
- Consider incorporating more mindfulness activities to balance your analytical tendencies.
- Your hand structure suggests a potential need for better wrist and hand ergonomics, especially if you do computer work.
- Regular cardiovascular exercise would complement your natural energy patterns.
- Your palm suggests you may benefit from creative activities as a form of stress relief.

## **Future Timeline Predictions**

**Next 6 Months**
A period of transition appears likely, with new opportunities in your professional life. Be open to unexpected offers or changes in your current role. The intersection of influence lines with your fate line suggests a significant meeting or connection that will impact your career trajectory.

**1-2 Years**
Significant relationship developments are indicated, either strengthening existing bonds or forming important new connections that will influence your path. A clear line of influence approaching your heart line suggests romantic developments or deepening of existing relationships.

**3-5 Years**
A major achievement or milestone is suggested in this timeframe. Your preparation and skills will converge to create a significant breakthrough. The strengthening of your fate line during this period indicates recognition or achievement in your chosen field.

**5+ Years**
Long-term prosperity is indicated, with stability in multiple areas of life. The foundations you're building now will support continued growth and fulfillment. The clarity of your life line extending into the future suggests good health and vitality to enjoy your achievements.
`;
    
    try {
      await generatePDF({
        title: "Complete Palm Reading Analysis",
        subtitle: "Comprehensive Personal Insights",
        content: demoContent,
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
    
    const basicContent = `
# **Basic Palm Reading Analysis**

## **Personality Overview**
Your palm reveals a balanced personality with strong analytical abilities and creative tendencies. The head line shows clear thinking and problem-solving capabilities.

## **Life Direction Summary**
The fate line indicates a focused career path with potential for advancement in the next 1-2 years. Your natural leadership qualities will help you progress.

## **Relationship Insights**
Your heart line shows emotional depth and capacity for meaningful connections. You value quality over quantity in relationships.

## **Basic Health Indicators**
Good overall vitality is indicated, with suggestions to incorporate more stress management practices into your routine.

## **Key Recommendations**
- Leverage your analytical abilities in professional settings
- Take time to nurture your most important relationships
- Balance work with creative pursuits to maintain wellbeing
- Practice mindfulness to optimize your natural strengths
`;
    
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
              <h2 className="heading-md">Complete Analysis (70+ Pages)</h2>
              <div className="flex gap-3">
                <button 
                  onClick={handleFullReportDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Full Report</span>
                </button>
                <button 
                  onClick={handleBasicReportDownload}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
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
              <h3 className="text-xl font-semibold mb-4">Comprehensive Life Analysis</h3>
              <div className="grid gap-6">
                <div className="p-6 border border-primary/20 rounded-xl">
                  <h4 className="font-medium mb-4">Detailed Career Trajectory (Pages 5-15)</h4>
                  <p className="text-black mb-4">Your palm shows exceptional career potential with multiple branching opportunities. The intersection of your fate line with other major lines indicates:</p>
                  <ul className="list-disc list-inside space-y-2 text-black">
                    <li>Leadership roles in innovative fields</li>
                    <li>Entrepreneurial success markers</li>
                    <li>Creative problem-solving abilities</li>
                    <li>Strategic thinking capabilities</li>
                  </ul>
                </div>

                <div className="p-6 border border-primary/20 rounded-xl">
                  <h4 className="font-medium mb-4">Deep Relationship Analysis (Pages 16-30)</h4>
                  <p className="text-black mb-4">Your heart and head lines reveal complex relationship patterns:</p>
                  <ul className="list-disc list-inside space-y-2 text-black">
                    <li>Deep emotional connections with select individuals</li>
                    <li>Strong family bonds and genetic influences</li>
                    <li>Professional relationship dynamics</li>
                    <li>Friendship circle analysis</li>
                  </ul>
                </div>

                <div className="p-6 border border-primary/20 rounded-xl">
                  <h4 className="font-medium mb-4">Financial Prosperity Indicators (Pages 31-45)</h4>
                  <p className="text-black mb-4">Multiple wealth lines and markers suggest:</p>
                  <ul className="list-disc list-inside space-y-2 text-black">
                    <li>Investment opportunities and timing</li>
                    <li>Risk assessment capabilities</li>
                    <li>Long-term financial stability indicators</li>
                    <li>Wealth accumulation patterns</li>
                  </ul>
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
