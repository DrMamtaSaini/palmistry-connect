
import { Link } from 'react-router-dom';
import { Hand, Users, Brain, Sparkles } from 'lucide-react';

const HeroSection = () => {
  console.log("HeroSection rendering...");
  
  return (
    <div className="min-h-screen flex flex-col justify-center pt-16 relative overflow-hidden hero-gradient">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full filter blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/10 rounded-full filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full filter blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-secondary/10 rounded-full filter blur-xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
      
      {/* Floating notification */}
      <div className="palm-notification absolute bottom-10 left-10 right-10 md:left-auto md:right-auto md:bottom-auto md:top-32 md:left-10 max-w-sm p-4 rounded-lg shadow-lg z-20">
        <p className="text-foreground text-sm">
          <span className="font-bold">Sophie from Berlin</span> has just generated her Palm Analysis.
        </p>
      </div>
      
      <div className="content-container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left content */}
        <div className="flex flex-col items-start text-left">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Hand className="h-4 w-4 mr-2" />
            Palm Reading through AI
          </div>
          
          <h1 className="heading-lg font-bold mb-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <span className="heading-gradient text-5xl md:text-6xl lg:text-7xl font-bold">
              PalmistryAI
            </span>
            <br />
            <span className="text-3xl md:text-4xl mt-2 text-foreground">
              Discover Your Destiny
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mb-10 animate-fade-in" style={{ animationDelay: '400ms' }}>
            Our advanced AI analyzes your palm lines to reveal insights about your personality, 
            relationships, career, and more with stunning accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-fade-in" style={{ animationDelay: '500ms' }}>
            <Link 
              to="/palm-reading" 
              className="px-8 py-3 rounded-full bg-primary text-primary-foreground text-base font-medium transition-all hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              <Hand className="h-5 w-5" />
              Try Palm Reading
            </Link>
            <Link 
              to="/compatibility" 
              className="px-8 py-3 rounded-full bg-secondary text-secondary-foreground text-base font-medium transition-all hover:bg-secondary/80 flex items-center justify-center gap-2"
            >
              <Users className="h-5 w-5" />
              Check Compatibility
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 max-w-md w-full animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="glass-panel p-4 rounded-xl hover:shadow-elegant transition-all duration-500">
              <div className="flex items-center">
                <div className="mr-3 bg-primary/20 p-2 rounded-full">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <span className="font-medium">AI Analysis</span>
              </div>
            </div>
            <div className="glass-panel p-4 rounded-xl hover:shadow-elegant transition-all duration-500">
              <div className="flex items-center">
                <div className="mr-3 bg-secondary/20 p-2 rounded-full">
                  <Sparkles className="h-5 w-5 text-secondary" />
                </div>
                <span className="font-medium">Accurate Results</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right content - Palm image */}
        <div className="hidden lg:flex justify-center items-center animate-fade-in" style={{ animationDelay: '700ms' }}>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl animate-pulse-slow"></div>
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
              alt="Palm Reading Analysis" 
              className="relative max-h-[600px] object-contain z-10 rounded-lg shadow-elegant"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
