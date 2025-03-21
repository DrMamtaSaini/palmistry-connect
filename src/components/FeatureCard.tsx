
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
        "bg-gray-300/90 p-8 rounded-2xl h-full transition-all duration-500",
        "animate-fade-in opacity-0",
        className
      )}
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
    >
      <div className="rounded-full p-3 inline-flex items-center justify-center bg-[#00FF7F] mb-4 w-16 h-16">
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-2xl font-semibold mb-3 text-white">{title}</h3>
      <p className="text-blue-200/80">{description}</p>
    </div>
  );
};

export default FeatureCard;
