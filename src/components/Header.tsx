
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('User');
  const location = useLocation();
  const { toast } = useToast();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Palm Reading', href: '/palm-reading' },
    { name: 'Compatibility', href: '/compatibility' },
    { name: 'Pricing', href: '/pricing' },
  ];
  
  // Simulate check for logged in status
  useEffect(() => {
    // For demo purposes, just assume the user is logged in
    // In a real app, this would check auth state from context/cookies/localStorage
    setIsLoggedIn(true);
    setUsername('User');
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Close mobile menu when changing routes
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    // In a real app, this would clear auth state/cookies/localStorage
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    // Redirect to home page
    window.location.href = '/';
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-subtle" : "bg-transparent"
      )}
    >
      <div className="content-container flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2"
        >
          <span className="font-display text-2xl font-bold">Palmistry<span className="text-primary/80">AI</span></span>
        </Link>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary button-link",
                location.pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">Welcome, {username}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90"
            >
              Sign In
            </Link>
          )}
        </nav>
        
        {/* Mobile menu button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          aria-expanded="false"
        >
          <span className="sr-only">Open menu</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="content-container py-4 flex justify-between items-center">
            <Link 
              to="/" 
              className="flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="font-display text-2xl font-bold">Palmistry<span className="text-primary/80">AI</span></span>
            </Link>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav className="mt-16 content-container">
            <div className="grid gap-12 text-center">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-2xl font-display transition-colors hover:text-primary",
                    location.pathname === item.href ? "text-primary" : "text-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {isLoggedIn ? (
                <div className="flex flex-col items-center gap-4">
                  <span className="text-lg font-medium">Welcome, {username}</span>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-3 mt-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="mt-8 px-6 py-3 rounded-full bg-primary text-primary-foreground text-base font-medium transition-all hover:bg-primary/90 inline-block mx-auto"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
