
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingCard from '@/components/PricingCard';
import { revealAnimation } from '@/lib/animations';

const Pricing = () => {
  useEffect(() => {
    const cleanup = revealAnimation();
    return cleanup;
  }, []);

  const palmReadingPlans = [
    {
      title: "Basic Report",
      price: "Free",
      description: "A simple 1-page summary of your palm reading",
      features: [
        { text: "Basic palm line analysis", included: true },
        { text: "1-page summary report", included: true },
        { text: "Personality insights", included: true },
        { text: "PDF download", included: false },
        { text: "Career analysis", included: false },
        { text: "Health insights", included: false },
        { text: "Relationship predictions", included: false },
        { text: "Wealth forecasts", included: false },
      ],
      buttonText: "Get Free Reading",
      buttonLink: "/palm-reading",
      highlighted: false,
    },
    {
      title: "Part 1 Report",
      price: "$50",
      description: "Detailed analysis of key aspects of your life",
      features: [
        { text: "Comprehensive palm analysis", included: true },
        { text: "25-50 page detailed report", included: true },
        { text: "Personality deep dive", included: true },
        { text: "Career path analysis", included: true },
        { text: "Health insights", included: true },
        { text: "Relationship predictions", included: true },
        { text: "PDF & digital access", included: true },
        { text: "Wealth forecasts", included: false },
      ],
      buttonText: "Get Part 1 Report",
      buttonLink: "/palm-reading",
      highlighted: false,
    },
    {
      title: "Complete Reading",
      price: "$70",
      description: "Our most comprehensive palm analysis package",
      features: [
        { text: "Complete palm analysis", included: true },
        { text: "50-100 page detailed report", included: true },
        { text: "Personality deep dive", included: true },
        { text: "Career path analysis", included: true },
        { text: "Health insights", included: true },
        { text: "Relationship predictions", included: true },
        { text: "Wealth & prosperity forecasts", included: true },
        { text: "Spiritual growth insights", included: true },
        { text: "Family dynamics", included: true },
        { text: "Life timeline predictions", included: true },
        { text: "PDF & digital access", included: true },
        { text: "30-day follow-up questions", included: true },
      ],
      buttonText: "Get Complete Reading",
      buttonLink: "/palm-reading",
      highlighted: true,
    },
    {
      title: "Part 2 Report",
      price: "$50",
      description: "Focused on wealth and spiritual aspects",
      features: [
        { text: "Detailed palm analysis", included: true },
        { text: "25-50 page detailed report", included: true },
        { text: "Wealth & prosperity forecasts", included: true },
        { text: "Spiritual growth insights", included: true },
        { text: "Family dynamics", included: true },
        { text: "Life timeline predictions", included: true },
        { text: "PDF & digital access", included: true },
        { text: "Career analysis", included: false },
      ],
      buttonText: "Get Part 2 Report",
      buttonLink: "/palm-reading",
      highlighted: false,
    },
  ];

  const compatibilityPlans = [
    {
      title: "Basic Compatibility",
      price: "Free",
      description: "A simple overview of your compatibility",
      features: [
        { text: "Basic compatibility score", included: true },
        { text: "1-page summary", included: true },
        { text: "Relationship strengths", included: true },
        { text: "Detailed analysis", included: false },
        { text: "Communication insights", included: false },
        { text: "Conflict resolution tips", included: false },
      ],
      buttonText: "Check Compatibility",
      buttonLink: "/compatibility",
      highlighted: false,
    },
    {
      title: "Standard Compatibility",
      price: "$60",
      description: "Detailed compatibility analysis for couples",
      features: [
        { text: "Comprehensive compatibility analysis", included: true },
        { text: "20-40 page detailed report", included: true },
        { text: "Emotional & psychological alignment", included: true },
        { text: "Relationship strengths & weaknesses", included: true },
        { text: "Communication style insights", included: true },
        { text: "Conflict resolution guidance", included: true },
        { text: "Future compatibility outlook", included: false },
        { text: "Follow-up questions", included: false },
      ],
      buttonText: "Get Standard Analysis",
      buttonLink: "/compatibility",
      highlighted: false,
    },
    {
      title: "Premium Compatibility",
      price: "$90",
      description: "Our most comprehensive relationship analysis",
      features: [
        { text: "In-depth compatibility analysis", included: true },
        { text: "40-80 page detailed report", included: true },
        { text: "Emotional & psychological alignment", included: true },
        { text: "Relationship strengths & weaknesses", included: true },
        { text: "Communication style insights", included: true },
        { text: "Conflict resolution guidance", included: true },
        { text: "Future compatibility outlook", included: true },
        { text: "Long-term relationship forecast", included: true },
        { text: "PDF & digital access", included: true },
        { text: "30-day follow-up questions", included: true },
      ],
      buttonText: "Get Premium Analysis",
      buttonLink: "/compatibility",
      highlighted: true,
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="content-container">
          <div className="text-center max-w-3xl mx-auto mb-12 reveal">
            <h1 className="heading-lg mb-6">Pricing Plans</h1>
            <p className="text-muted-foreground text-lg">
              Choose the perfect plan to unlock the secrets hidden in your palm 
              and discover meaningful insights about your life and relationships.
            </p>
          </div>
          
          <div className="mb-24">
            <h2 className="heading-md text-center mb-12 reveal">Palm Reading Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {palmReadingPlans.map((plan, index) => (
                <PricingCard 
                  key={plan.title}
                  {...plan}
                  index={index}
                />
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="heading-md text-center mb-12 reveal">Compatibility Analysis</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {compatibilityPlans.map((plan, index) => (
                <PricingCard 
                  key={plan.title}
                  {...plan}
                  index={index}
                />
              ))}
            </div>
          </div>
          
          <div className="mt-24 glass-panel rounded-2xl p-10 max-w-3xl mx-auto reveal">
            <h2 className="heading-md text-center mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">How accurate is the AI palm reading?</h3>
                <p className="text-muted-foreground">
                  Our AI has been trained on thousands of palm images and traditional palmistry knowledge.
                  While results vary by individual, most users report 80-90% accuracy in personality and trait analysis.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">How do I take a good palm photo?</h3>
                <p className="text-muted-foreground">
                  Take a photo in natural light, with your palm fully open and fingers slightly spread. 
                  Ensure all lines are clearly visible and the image is not blurry.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Can I get a refund if I'm not satisfied?</h3>
                <p className="text-muted-foreground">
                  Yes, we offer a 100% satisfaction guarantee. If you're not happy with your reading,
                  contact us within 7 days of purchase for a full refund.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">How long does it take to receive my report?</h3>
                <p className="text-muted-foreground">
                  Basic reports are generated instantly. Detailed reports (Part 1, Part 2, and Complete) 
                  are typically delivered within 24 hours of your payment.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Are my palm images and data secure?</h3>
                <p className="text-muted-foreground">
                  Yes, we take your privacy seriously. All palm images and personal data are encrypted
                  and used solely for analysis purposes. We never share your information with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
