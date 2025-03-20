
import { Users, Award, Lightbulb, Heart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="content-container">
          <div className="text-center mb-16">
            <h1 className="heading-lg mb-4">About PalmistryAI</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discovering the stories etched in your palms through the power of artificial intelligence.
            </p>
          </div>
          
          {/* Our Story */}
          <div className="mb-20">
            <div className="max-w-3xl mx-auto">
              <h2 className="heading-md mb-6 text-center">Our Story</h2>
              <div className="prose prose-lg mx-auto">
                <p>
                  PalmistryAI was founded in 2023 by a team of AI researchers, palmistry experts, and spiritual healers 
                  who shared a vision of making ancient palmistry knowledge accessible to everyone through modern technology.
                </p>
                <p>
                  We recognized that traditional palmistry, an ancient practice dating back thousands of years, 
                  contained profound wisdom about human personalities, relationships, and life paths. However, 
                  accessing this knowledge typically required consulting with experienced palm readers, who were 
                  not always easily accessible.
                </p>
                <p>
                  Our breakthrough came when we developed advanced computer vision and machine learning models capable 
                  of analyzing palm lines with extraordinary precision. This technology allowed us to democratize 
                  palmistry knowledge and make it available to people worldwide.
                </p>
                <p>
                  Today, PalmistryAI stands at the intersection of ancient wisdom and cutting-edge technology, 
                  offering insights that help thousands of users understand themselves and their relationships better.
                </p>
              </div>
            </div>
          </div>
          
          {/* Our Mission & Values */}
          <div className="mb-20">
            <h2 className="heading-md mb-10 text-center">Our Mission & Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-panel p-8 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To empower individuals with self-knowledge and relationship insights through an accessible, 
                  accurate, and ethical application of ancient palmistry wisdom enhanced by modern AI technology.
                </p>
              </div>
              
              <div className="glass-panel p-8 rounded-2xl">
                <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  A world where everyone can access personalized insights about their character, potential, 
                  and relationships, helping them make more informed life decisions and build deeper connections.
                </p>
              </div>
            </div>
          </div>
          
          {/* Core Values */}
          <div className="mb-20">
            <h2 className="heading-md mb-10 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Integrity</h3>
                <p className="text-muted-foreground">
                  We provide honest, ethical interpretations without making extreme claims or predictions.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously improve our AI models to provide more accurate and personalized insights.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Empathy</h3>
                <p className="text-muted-foreground">
                  We approach each reading with respect for the individual's unique journey and challenges.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Accessibility</h3>
                <p className="text-muted-foreground">
                  We make palmistry insights available to everyone regardless of location or background.
                </p>
              </div>
            </div>
          </div>
          
          {/* Our Team */}
          <div>
            <h2 className="heading-md mb-10 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-panel p-6 rounded-2xl">
                <div className="aspect-square bg-muted rounded-xl mb-4 overflow-hidden">
                  <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                    <span className="text-6xl text-primary/20">DR</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Dr. Rajiv Sharma</h3>
                <p className="text-sm text-primary mb-2">Founder & Lead Palmistry Expert</p>
                <p className="text-muted-foreground text-sm">
                  With over 25 years of experience in palmistry and a Ph.D. in Cognitive Sciences, 
                  Dr. Sharma bridges the gap between ancient wisdom and modern science.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-2xl">
                <div className="aspect-square bg-muted rounded-xl mb-4 overflow-hidden">
                  <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                    <span className="text-6xl text-primary/20">EL</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Emily Lee</h3>
                <p className="text-sm text-primary mb-2">Chief AI Engineer</p>
                <p className="text-muted-foreground text-sm">
                  A Stanford AI graduate, Emily leads our machine learning team, developing cutting-edge 
                  computer vision algorithms that analyze palm features with unprecedented accuracy.
                </p>
              </div>
              
              <div className="glass-panel p-6 rounded-2xl">
                <div className="aspect-square bg-muted rounded-xl mb-4 overflow-hidden">
                  <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                    <span className="text-6xl text-primary/20">MC</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">Miguel Costa</h3>
                <p className="text-sm text-primary mb-2">Relationship Psychology Advisor</p>
                <p className="text-muted-foreground text-sm">
                  With expertise in relationship counseling and compatibility assessment, Miguel helps 
                  translate palmistry insights into practical relationship advice.
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

export default About;
