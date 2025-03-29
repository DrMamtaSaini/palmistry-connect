import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hand, Users, MessageCircle, Star, Brain, Sparkles, Zap, BookOpen, Download } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import FeatureCard from '@/components/FeatureCard';
import { revealAnimation } from '@/lib/animations';
import { generatePDF, generateDemoReport } from '@/lib/pdfUtils';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  console.log("Index page rendering...");
  const { toast } = useToast();
  
  useEffect(() => {
    console.log("Index page mounted");
    const cleanup = revealAnimation();
    return () => {
      console.log("Index page unmounting");
      cleanup();
    };
  }, []);

  const handleDownloadDemo = async () => {
    toast({
      title: "Generating Demo PDF",
      description: "Your sample report is being prepared for download...",
    });
    
    try {
      await generateDemoReport();
      
      toast({
        title: "Success",
        description: "Your demo report has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate the demo report. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1323]">
      <Header />
      
      {/* Hero section */}
      <HeroSection />
      
      {/* Features section */}
      <section className="py-24 relative overflow-hidden bg-[#0a1323]">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-[#00FF7F]/5 rounded-full filter blur-3xl" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full filter blur-3xl" />
        
        <div className="content-container">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <h2 className="heading-lg mb-4 text-white">Advanced AI Palm Reading Features</h2>
            <p className="text-black text-lg font-medium">
              Our powerful AI technology analyzes your palm's unique features to provide detailed, 
              accurate insights about your life and relationships.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Detailed Palm Analysis" 
              description="Our AI analyzes your palm lines, mounts, and skin texture to create comprehensive insights into your personality, career, health, and more."
              icon={Hand}
              index={0}
            />
            <FeatureCard 
              title="Compatibility Matching" 
              description="Discover your relationship compatibility by analyzing both your palm and your partner's palm, revealing strengths and potential challenges."
              icon={Users}
              index={1}
            />
            <FeatureCard 
              title="Multilingual Reports" 
              description="Access your palm reading reports in multiple languages including English, Hindi, Spanish, French, and more for global accessibility."
              icon={MessageCircle}
              index={2}
            />
            <FeatureCard 
              title="AI Chatbot Guidance" 
              description="Get personalized answers to your questions about your palm reading report from our intelligent AI chatbot."
              icon={Brain}
              index={3}
            />
            <FeatureCard 
              title="Personalized Insights" 
              description="Receive tailored advice based on your unique palm features, helping you make better decisions in career, relationships, and life choices."
              icon={Sparkles}
              index={4}
            />
            <FeatureCard 
              title="Future Predictions" 
              description="Explore potential future paths with our AI-generated forecasts based on the timeline indicators in your palm."
              icon={Zap}
              index={5}
            />
          </div>
        </div>
      </section>
      
      {/* Demo Report Section */}
      <section className="py-24 relative overflow-hidden bg-[#0a1323]">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-[#00FF7F]/5 rounded-full filter blur-3xl" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full filter blur-3xl" />
        
        <div className="content-container">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <h2 className="heading-lg mb-4 text-white">Preview Our Detailed Reports</h2>
            <p className="text-black text-lg font-medium">
              Explore a sample of our comprehensive palm reading and relationship compatibility reports to discover
              the depth of insights you can gain from our premium service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center reveal">
            <div className="glass-panel rounded-2xl p-6 lg:p-10">
              <div className="flex items-center mb-6">
                <BookOpen className="h-6 w-6 text-[#00FF7F] mr-3" />
                <h3 className="text-2xl font-semibold text-white">Sample Report Preview</h3>
              </div>
              
              <div className="space-y-4 mb-8">
                <Card className="border-[#00FF7F]/20">
                  <CardHeader>
                    <CardTitle>Deep Personality Insights</CardTitle>
                    <CardDescription>Discover your character traits and strengths</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Detailed analysis of your personality based on palm lines, hand shape, and mounts.</p>
                  </CardContent>
                </Card>
                
                <Card className="border-[#00FF7F]/20">
                  <CardHeader>
                    <CardTitle>Relationship Compatibility</CardTitle>
                    <CardDescription>Palm and Vedic astrology compatibility</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Comprehensive breakdown of relationship dynamics including Guna Milan score and element compatibility.</p>
                  </CardContent>
                </Card>
                
                <Card className="border-[#00FF7F]/20">
                  <CardHeader>
                    <CardTitle>Life Path Predictions</CardTitle>
                    <CardDescription>Future trends and opportunities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Timeline analysis with key milestones and potential future scenarios based on your unique palm features.</p>
                  </CardContent>
                </Card>
              </div>
              
              <button 
                onClick={handleDownloadDemo}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full bg-[#00FF7F] text-primary-foreground hover:bg-[#00FF7F]/90 transition-colors"
              >
                <Download className="h-5 w-5" />
                <span>Download Sample Report</span>
              </button>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 bg-[#00FF7F]/20 rounded-full blur-2xl animate-pulse-slow"></div>
              <img 
                src="https://images.unsplash.com/photo-1589860170912-6b83cf6f8809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                alt="Sample Palm Reading Report" 
                className="relative z-10 w-full max-h-[700px] object-cover rounded-lg shadow-elegant"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="py-24 bg-[#0c172b] relative overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-[#00FF7F]/5 rounded-full filter blur-3xl" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-[#00FF7F]/5 rounded-full filter blur-3xl" />
        
        <div className="content-container relative z-10 text-center">
          <div className="max-w-3xl mx-auto reveal">
            <h2 className="heading-lg mb-6 text-white">Discover Your Destiny Today</h2>
            <p className="text-black text-lg font-medium mb-10">
              Unlock the secrets hidden in your palm and gain valuable insights about your life path, relationships, and future possibilities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link 
                to="/palm-reading" 
                className="px-8 py-3 rounded-full bg-[#00FF7F] text-white text-base font-medium transition-all hover:bg-[#00FF7F]/90"
              >
                Try Palm Reading
              </Link>
              <Link 
                to="/pricing" 
                className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground text-base font-medium transition-all hover:bg-secondary/80"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials section */}
      <section className="py-24 relative overflow-hidden">
        <div className="content-container">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <h2 className="heading-lg mb-4 text-white">What Our Users Say</h2>
            <p className="text-black text-lg font-medium">
              Thousands of users have discovered meaningful insights through our AI palm reading technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-300/80 p-8 rounded-2xl hover:shadow-elegant transition-all duration-500 reveal">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#00FF7F] flex items-center justify-center">
                    <span className="font-bold text-white">S</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-white">Sarah M.</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#00FF7F] text-[#00FF7F]" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-black font-medium">"The detailed analysis of my palm was shockingly accurate. It revealed things about my personality and career path that resonated deeply with me."</p>
            </div>
            
            <div className="bg-gray-300/80 p-8 rounded-2xl hover:shadow-elegant transition-all duration-500 reveal">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#00FF7F] flex items-center justify-center">
                    <span className="font-bold text-white">R</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-white">Raj K.</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#00FF7F] text-[#00FF7F]" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-black font-medium">"The compatibility analysis for me and my partner was eye-opening. It helped us understand our relationship dynamics and has improved our communication."</p>
            </div>
            
            <div className="bg-gray-300/80 p-8 rounded-2xl hover:shadow-elegant transition-all duration-500 reveal">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-[#00FF7F] flex items-center justify-center">
                    <span className="font-bold text-white">J</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-white">Jessica L.</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#00FF7F] text-[#00FF7F]" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-black font-medium">"I was skeptical at first, but the insights about my health tendencies were spot on. The report helped me make better lifestyle choices."</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
