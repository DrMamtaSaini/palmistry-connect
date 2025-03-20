
import { Link } from 'react-router-dom';
import { Hand, Users } from 'lucide-react';

const HeroSection = () => {
  console.log("HeroSection rendering...");
  
  return (
    <div className="min-h-screen flex flex-col justify-center pt-16 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -top-[20%] -right-[20%] w-[70%] h-[70%] bg-primary/5 rounded-full filter blur-3xl" />
      <div className="absolute -bottom-[20%] -left-[20%] w-[70%] h-[70%] bg-primary/5 rounded-full filter blur-3xl" />
      
      <div className="content-container relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            Discover Your Destiny Through AI Palm Reading
          </div>
          
          <h1 className="heading-xl max-w-4xl mb-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
            Unlock the <span className="text-primary">Secrets</span> Hidden in Your Palm
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="glass-panel p-6 rounded-2xl hover:shadow-elegant transition-all duration-500">
              <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-muted-foreground">Our deep learning models analyze your palm lines, mounts, and skin texture with exceptional precision.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl hover:shadow-elegant transition-all duration-500">
              <h3 className="text-lg font-semibold mb-2">Personalized Reports</h3>
              <p className="text-muted-foreground">Receive a comprehensive report covering personality, career, health, love, and wealth insights.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl hover:shadow-elegant transition-all duration-500">
              <h3 className="text-lg font-semibold mb-2">Relationship Compatibility</h3>
              <p className="text-muted-foreground">Discover how well you match with your partner through our AI compatibility analysis.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl hover:shadow-elegant transition-all duration-500">
              <h3 className="text-lg font-semibold mb-2">Multilingual Support</h3>
              <p className="text-muted-foreground">Access your reports in multiple languages including English, Hindi, Spanish, and more.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
