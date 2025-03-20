
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const faqItems = [
    {
      category: "Palm Reading",
      questions: [
        {
          q: "How accurate is AI palm reading compared to traditional methods?",
          a: "Our AI palm reading technology combines ancient palmistry knowledge with modern machine learning, achieving an accuracy rate that rivals experienced human palm readers. In blind tests, our AI system has consistently shown 85-90% accuracy in identifying personality traits and life patterns."
        },
        {
          q: "Do I need a high-quality camera to get an accurate palm reading?",
          a: "While a high-quality image helps, our AI is designed to work with standard smartphone cameras. We recommend good lighting, a neutral background, and a clear, straight-on view of your palm for best results."
        },
        {
          q: "Can the AI read both left and right palms?",
          a: "Yes! Our system analyzes both hands. In traditional palmistry, the non-dominant hand reflects inherited traits and potential, while the dominant hand shows how you've developed those traits in life. For a complete reading, we recommend uploading images of both palms."
        },
        {
          q: "Will my palm images be stored or shared?",
          a: "We temporarily store your palm images securely for processing but never share them with third parties. Images are encrypted and can be permanently deleted from our servers upon request after your reading is complete."
        }
      ]
    },
    {
      category: "Compatibility Matching",
      questions: [
        {
          q: "How does compatibility matching work?",
          a: "Our AI analyzes the palm features of both individuals, identifying complementary traits, potential areas of conflict, and overall relationship dynamics. The system evaluates over 100 different compatibility factors based on established palmistry principles and relationship psychology."
        },
        {
          q: "Can I get a compatibility reading with someone who hasn't uploaded their palm?",
          a: "For accurate compatibility matching, we need palm images from both individuals. However, we offer a 'single-sided' preliminary analysis based on your palm alone, which can provide insights into your relationship patterns and partner preferences."
        },
        {
          q: "Is the compatibility score a predictor of relationship success?",
          a: "The compatibility score indicates natural alignment between two individuals but is not a definitive predictor of relationship success. Many successful relationships require work and understanding, regardless of initial compatibility. Our reports focus on providing insights to help you navigate your relationship more effectively."
        }
      ]
    },
    {
      category: "Reports and Pricing",
      questions: [
        {
          q: "What's included in the free basic report?",
          a: "The free basic report includes a one-page summary of your major palm lines (heart, head, life, and fate), primary personality traits, and general life tendency indicators. It's a great introduction to palmistry insights but doesn't include the detailed analysis found in our premium reports."
        },
        {
          q: "How detailed are the premium reports?",
          a: "Premium reports range from 50-100 pages depending on the package selected. They include in-depth analysis of all major and minor palm lines, mounts, finger shapes, and patterns, with specific sections devoted to personality, career, finances, health, relationships, and more."
        },
        {
          q: "Can I upgrade from a basic report to a premium report later?",
          a: "Absolutely! If you purchase a premium report after receiving a basic one, we'll apply a discount to your premium purchase. Your palm data is already in our system, so upgrading is seamless."
        },
        {
          q: "Do you offer refunds if I'm not satisfied with my reading?",
          a: "Yes, we offer a satisfaction guarantee. If you're not satisfied with your reading, contact our support team within 7 days of your purchase with details about your concerns, and we'll process a refund or work with you to provide a more satisfactory analysis."
        }
      ]
    },
    {
      category: "Technical Questions",
      questions: [
        {
          q: "In which languages are reports available?",
          a: "Currently, we offer reports in English, Spanish, Hindi, French, German, Japanese, and Chinese. We're continually adding more languages to our platform."
        },
        {
          q: "How can I access my reports after purchase?",
          a: "All your reports are stored securely in your user dashboard. You can log in anytime to view, download, or print your reports. Reports are available in PDF format and are accessible on all devices."
        },
        {
          q: "What payment methods do you accept?",
          a: "We accept all major credit cards, PayPal, and Razorpay for international payments. All transactions are processed securely through encrypted connections."
        },
        {
          q: "Is my personal information secure?",
          a: "Absolutely. We implement bank-level security measures to protect your personal data. We never share your information with third parties, and all data is encrypted both in transit and storage."
        }
      ]
    }
  ];
  
  const filteredFAQs = searchTerm ? 
    faqItems.map(category => ({
      ...category,
      questions: category.questions.filter(item => 
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.questions.length > 0) : 
    faqItems;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="content-container">
          <div className="text-center mb-12">
            <h1 className="heading-lg mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Find answers to common questions about our AI-powered palm reading and compatibility matching services.
            </p>
            
            <div className="max-w-md mx-auto relative">
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 px-2"
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
          
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg font-medium">No questions match your search.</p>
              <p className="text-muted-foreground mt-2">Try using different keywords or browse all categories below.</p>
              <Button 
                className="mt-4" 
                variant="outline" 
                onClick={() => setSearchTerm('')}
              >
                View All Questions
              </Button>
            </div>
          ) : (
            filteredFAQs.map((category, index) => (
              <div key={index} className="mb-10">
                <h2 className="text-xl font-semibold mb-4">{category.category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((item, qIndex) => (
                    <AccordionItem key={qIndex} value={`${index}-${qIndex}`}>
                      <AccordionTrigger className="text-left font-medium">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))
          )}
          
          <div className="text-center mt-16 p-8 glass-panel rounded-2xl max-w-2xl mx-auto">
            <h2 className="heading-md mb-4">Still Have Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Our support team is ready to help you with any other questions you might have.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" asChild>
                <a href="/contact">Contact Support</a>
              </Button>
              <Button asChild>
                <a href="/support">Live Chat Support</a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
