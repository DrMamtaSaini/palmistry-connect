
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  index?: number;
}

const FeatureCard = ({ title, description, icon: Icon, className, index = 0 }: FeatureCardProps) => {
  return (
    <div 
      className={cn(
        "glass-panel p-8 rounded-2xl h-full hover:shadow-elegant transition-all duration-500",
        "animate-fade-in opacity-0",
        className
      )}
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
    >
      <div className="rounded-full p-3 inline-flex items-center justify-center bg-primary bg-opacity-10 mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
