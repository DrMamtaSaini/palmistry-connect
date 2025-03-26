
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  buttonLink: string;
  highlighted?: boolean;
  index?: number;
}

const PricingCard = ({
  title,
  price,
  description,
  features,
  buttonText,
  buttonLink,
  highlighted = false,
  index = 0
}: PricingCardProps) => {
  // Add a "View Sample" link for all paid plans
  const showSampleLink = price !== "Free";
  
  return (
    <div 
      className={cn(
        "rounded-2xl p-8 flex flex-col h-full animate-fade-in border",
        highlighted 
          ? "bg-primary text-primary-foreground border-primary relative z-10 shadow-xl" 
          : "bg-card text-card-foreground border-border",
      )}
      style={{ 
        animationDelay: `${index * 150}ms`, 
        animationFillMode: 'forwards',
        opacity: 0
      }}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
          MOST POPULAR
        </div>
      )}
      
      <div className="mb-6">
        <h3 className={cn(
          "text-xl font-semibold mb-2",
          highlighted ? "text-primary-foreground" : "text-foreground"
        )}>
          {title}
        </h3>
        <div className="flex items-baseline mb-2">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Free" && <span className="ml-1 text-sm opacity-80">USD</span>}
        </div>
        <p className={cn(
          "text-sm font-medium",
          highlighted ? "text-primary-foreground/80" : "text-black"
        )}>
          {description}
        </p>
        
        {showSampleLink && (
          <Link 
            to="/palm-reading-result" 
            className={cn(
              "text-xs mt-2 inline-block underline",
              highlighted ? "text-primary-foreground/90" : "text-primary"
            )}
          >
            View Sample Report
          </Link>
        )}
      </div>
      
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <div className={cn(
              "mr-2 mt-1 rounded-full p-1",
              highlighted 
                ? feature.included ? "bg-primary-foreground/20" : "bg-primary-foreground/10" 
                : feature.included ? "bg-primary/10" : "bg-muted"
            )}>
              <Check className={cn(
                "h-3 w-3",
                highlighted 
                  ? "text-primary-foreground" 
                  : feature.included ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <span className={cn(
              "text-sm font-medium",
              highlighted 
                ? feature.included ? "text-primary-foreground" : "text-primary-foreground/60" 
                : feature.included ? "text-black" : "text-black/60"
            )}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      
      <Link
        to={buttonLink}
        className={cn(
          "w-full py-2 px-4 rounded-full text-center font-medium transition-colors",
          highlighted 
            ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" 
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default PricingCard;
