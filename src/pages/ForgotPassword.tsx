
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Mail, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate password reset process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Just for demo purposes
      if (email) {
        setIsSubmitted(true);
        toast({
          title: "Reset link sent",
          description: "If an account exists with this email, you'll receive a reset link",
        });
      } else {
        throw new Error("Please enter your email address");
      }
    } catch (error) {
      toast({
        title: "Failed to send reset link",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="heading-lg mb-2">Reset Your Password</h1>
            <p className="text-muted-foreground">
              {isSubmitted 
                ? "Check your email for a reset link" 
                : "Enter your email and we'll send you a reset link"
              }
            </p>
          </div>
          
          <div className="glass-panel rounded-xl p-8">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="yourname@example.com"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  className={`w-full py-3 px-4 rounded-full bg-primary text-primary-foreground font-medium ${
                    isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-primary/90"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending reset link..." : "Send reset link"}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">
                  <p>
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p className="mt-2">
                    Please check your email and click the link to reset your password.
                  </p>
                </div>
                
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 text-primary hover:underline flex items-center justify-center mx-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Try another email
                </button>
              </div>
            )}
            
            <div className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
