
import { useState } from 'react';
import { Search, FileText, ChevronRight, Copy, Check, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from '@/lib/utils';

const Documentation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const mainSections = [
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'palm-reading', title: 'Palm Reading Guide' },
    { id: 'compatibility', title: 'Compatibility Analysis' },
    { id: 'account', title: 'Managing Your Account' },
    { id: 'api', title: 'PalmistryAI API' },
    { id: 'troubleshooting', title: 'Troubleshooting' }
  ];
  
  const subSections = {
    'getting-started': [
      { id: 'introduction', title: 'Introduction to PalmistryAI' },
      { id: 'creating-account', title: 'Creating an Account' },
      { id: 'dashboard-overview', title: 'Dashboard Overview' },
      { id: 'first-palm-reading', title: 'Your First Palm Reading' }
    ],
    'palm-reading': [
      { id: 'capturing-images', title: 'Capturing Quality Palm Images' },
      { id: 'uploading-images', title: 'Uploading Palm Images' },
      { id: 'report-types', title: 'Understanding Report Types' },
      { id: 'interpreting-results', title: 'Interpreting Your Results' }
    ],
    'compatibility': [
      { id: 'partner-analysis', title: 'Partner Analysis' },
      { id: 'matching-process', title: 'The Matching Process' },
      { id: 'compatibility-scores', title: 'Compatibility Scores Explained' },
      { id: 'relationship-insights', title: 'Using Relationship Insights' }
    ],
    'account': [
      { id: 'profile-settings', title: 'Profile Settings' },
      { id: 'subscription-management', title: 'Subscription Management' },
      { id: 'payment-methods', title: 'Payment Methods' },
      { id: 'data-privacy', title: 'Data Privacy & Security' }
    ],
    'api': [
      { id: 'api-overview', title: 'API Overview' },
      { id: 'authentication', title: 'Authentication' },
      { id: 'endpoints', title: 'Available Endpoints' },
      { id: 'rate-limits', title: 'Rate Limits & Usage' }
    ],
    'troubleshooting': [
      { id: 'common-issues', title: 'Common Issues' },
      { id: 'image-quality', title: 'Image Quality Problems' },
      { id: 'payment-issues', title: 'Payment Issues' },
      { id: 'contact-support', title: 'Contacting Support' }
    ]
  };
  
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };
  
  // Mock code samples for API section
  const codeSamples = {
    'authentication': `// Example: Authenticating with the PalmistryAI API
const apiKey = "your_api_key_here";

fetch("https://api.palmistryai.com/v1/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": \`Bearer \${apiKey}\`
  },
  body: JSON.stringify({
    // request data
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error("Error:", error));`,
    
    'endpoints': `// Example: Uploading palm image for analysis
const formData = new FormData();
formData.append("palm_image", palmImageFile);
formData.append("analysis_type", "full");

fetch("https://api.palmistryai.com/v1/palm/analyze", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${apiKey}\`
  },
  body: formData
})
.then(response => response.json())
.then(data => {
  // Handle the palm reading results
  console.log(data);
})
.catch(error => console.error("Error:", error));`
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="content-container">
          <div className="text-center mb-12">
            <h1 className="heading-lg mb-4">Documentation</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive guides and references to help you get the most out of PalmistryAI.
            </p>
            <div className="max-w-md mx-auto mt-6 relative">
              <Input
                type="text"
                placeholder="Search documentation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <div className="sticky top-24">
                <ScrollArea className="h-[calc(100vh-150px)] pr-4">
                  <nav className="space-y-1">
                    {mainSections.map((section) => (
                      <div key={section.id} className="mb-4">
                        <button
                          onClick={() => setActiveSection(section.id)}
                          className={cn(
                            "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            activeSection === section.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                        >
                          {section.title}
                          <ChevronRight className={cn(
                            "ml-auto h-4 w-4 transition-transform",
                            activeSection === section.id ? "rotate-90" : ""
                          )} />
                        </button>
                        
                        {activeSection === section.id && (
                          <div className="mt-1 ml-4 pl-2 border-l border-border">
                            {subSections[section.id as keyof typeof subSections].map((subSection) => (
                              <a
                                key={subSection.id}
                                href={`#${subSection.id}`}
                                className="flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                              >
                                {subSection.title}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                </ScrollArea>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              {/* Getting Started Section */}
              {activeSection === 'getting-started' && (
                <section>
                  <h2 className="heading-md mb-6" id="introduction">Introduction to PalmistryAI</h2>
                  <div className="prose prose-lg max-w-none mb-12">
                    <p>
                      Welcome to PalmistryAI, the leading platform for AI-powered palm reading and compatibility matching. 
                      This documentation will guide you through using our platform effectively, from creating your account 
                      to interpreting your detailed palm analysis reports.
                    </p>
                    <p>
                      PalmistryAI combines ancient palmistry knowledge with cutting-edge artificial intelligence to provide 
                      accurate and personalized insights about your personality, relationships, career, and more. Our technology 
                      analyzes the lines, mounts, and patterns in your palm to generate comprehensive reports that can help you 
                      better understand yourself and your compatibility with others.
                    </p>
                    <h3 id="creating-account">Creating an Account</h3>
                    <p>
                      To get started with PalmistryAI, you'll need to create an account:
                    </p>
                    <ol>
                      <li>Visit the <a href="/" className="text-primary hover:underline">PalmistryAI homepage</a></li>
                      <li>Click on "Sign In" in the top navigation bar</li>
                      <li>Select "Create an account" below the login form</li>
                      <li>Enter your email address and create a password</li>
                      <li>Verify your email address by clicking the link sent to your inbox</li>
                      <li>Complete your profile information</li>
                    </ol>
                    <div className="my-6 rounded-lg border border-border p-4 bg-muted/50">
                      <h4 className="text-base font-medium mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-2" /> Important Note
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Your email address will be used for account recovery and important notifications. 
                        Make sure to use an email address you have regular access to.
                      </p>
                    </div>
                    
                    <h3 id="dashboard-overview">Dashboard Overview</h3>
                    <p>
                      After logging in, you'll be taken to your personal dashboard. Here you can:
                    </p>
                    <ul>
                      <li>Access your previous palm reading reports</li>
                      <li>View your compatibility analyses</li>
                      <li>Manage your subscription and payment methods</li>
                      <li>Update your profile and preferences</li>
                      <li>Start new palm readings or compatibility matches</li>
                    </ul>
                    
                    <h3 id="first-palm-reading">Your First Palm Reading</h3>
                    <p>
                      To get your first palm reading:
                    </p>
                    <ol>
                      <li>From your dashboard, click on "New Palm Reading"</li>
                      <li>Select the type of reading you want (Basic, Part 1, Part 2, or Full Report)</li>
                      <li>Upload clear images of your palm following the guidelines</li>
                      <li>Complete the payment process if you selected a premium report</li>
                      <li>Wait for the AI to analyze your palm (this usually takes less than a minute)</li>
                      <li>View and download your personalized report</li>
                    </ol>
                  </div>
                </section>
              )}
              
              {/* API Section with Code Samples */}
              {activeSection === 'api' && (
                <section>
                  <h2 className="heading-md mb-6" id="api-overview">API Overview</h2>
                  <div className="prose prose-lg max-w-none mb-12">
                    <p>
                      PalmistryAI offers a robust API that allows developers to integrate our palm reading and 
                      compatibility matching capabilities into their own applications. This section provides 
                      documentation on how to use the API effectively.
                    </p>
                    
                    <h3 id="authentication">Authentication</h3>
                    <p>
                      All API requests require authentication using API keys. You can generate API keys from your 
                      developer dashboard after signing up for an API plan.
                    </p>
                    
                    <div className="my-6 rounded-lg border border-border overflow-hidden">
                      <div className="bg-muted px-4 py-2 flex justify-between items-center">
                        <span className="text-sm font-medium">API Authentication Example</span>
                        <button
                          onClick={() => handleCopyCode(codeSamples.authentication)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {copiedCode === codeSamples.authentication ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <pre className="p-4 text-sm overflow-x-auto bg-black text-white">
                        <code>{codeSamples.authentication}</code>
                      </pre>
                    </div>
                    
                    <h3 id="endpoints">Available Endpoints</h3>
                    <p>
                      The PalmistryAI API provides the following primary endpoints:
                    </p>
                    <ul>
                      <li><code>/v1/palm/analyze</code> - Submit palm images for analysis</li>
                      <li><code>/v1/compatibility/analyze</code> - Submit two palm images for compatibility analysis</li>
                      <li><code>/v1/reports/{'{report_id}'}</code> - Retrieve a specific report by ID</li>
                      <li><code>/v1/user/reports</code> - List all reports for the authenticated user</li>
                    </ul>
                    
                    <div className="my-6 rounded-lg border border-border overflow-hidden">
                      <div className="bg-muted px-4 py-2 flex justify-between items-center">
                        <span className="text-sm font-medium">Palm Analysis Example</span>
                        <button
                          onClick={() => handleCopyCode(codeSamples.endpoints)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {copiedCode === codeSamples.endpoints ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <pre className="p-4 text-sm overflow-x-auto bg-black text-white">
                        <code>{codeSamples.endpoints}</code>
                      </pre>
                    </div>
                    
                    <h3 id="rate-limits">Rate Limits & Usage</h3>
                    <p>
                      API usage is subject to rate limits based on your subscription plan:
                    </p>
                    <ul>
                      <li>Free tier: 10 requests per day</li>
                      <li>Basic tier: 100 requests per day</li>
                      <li>Professional tier: 1,000 requests per day</li>
                      <li>Enterprise tier: Custom limits</li>
                    </ul>
                    <p>
                      Rate limit headers are included in all API responses to help you track your usage.
                    </p>
                  </div>
                </section>
              )}
              
              {/* Documentation Footer */}
              <Separator className="my-8" />
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
                  Documentation version: v2.0.3 | Last updated: May 15, 2023
                </div>
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/support">
                      Need Help?
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <a href="/contact">
                      Contact Support <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Documentation;
