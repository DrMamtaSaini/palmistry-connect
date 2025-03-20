
import { useState } from 'react';
import { MessageCircle, ArrowRight, Info, HelpCircle, LifeBuoy, MessageSquare } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const Support = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! Welcome to PalmistryAI support. How can I help you today?", sender: "agent", time: "10:00 AM" },
  ]);
  
  const sendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = { 
      id: chatMessages.length + 1, 
      text: message, 
      sender: "user", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Simulate agent response after a short delay
    setTimeout(() => {
      const agentMessage = { 
        id: chatMessages.length + 2, 
        text: "Thanks for your message. Our support team will get back to you shortly. In the meantime, you might find helpful information in our FAQ section.", 
        sender: "agent", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setChatMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="content-container">
          <div className="text-center mb-12">
            <h1 className="heading-lg mb-4">Customer Support</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get help with your palmistry readings, account issues, or technical support.
            </p>
          </div>
          
          <Tabs defaultValue="live-chat" className="mb-16">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="live-chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" /> Live Chat
              </TabsTrigger>
              <TabsTrigger value="support-ticket" className="flex items-center gap-2">
                <LifeBuoy className="h-4 w-4" /> Support Ticket
              </TabsTrigger>
              <TabsTrigger value="help-center" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" /> Help Center
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="live-chat" className="max-w-4xl mx-auto">
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" alt="Support Agent" />
                      <AvatarFallback>SA</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>Live Support</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                          Online
                        </Badge>
                        Typically replies within minutes
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-4 py-4">
                      {chatMessages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={cn(
                            "flex",
                            msg.sender === "user" ? "justify-end" : "justify-start"
                          )}
                        >
                          <div 
                            className={cn(
                              "max-w-[80%] rounded-lg p-4",
                              msg.sender === "user" 
                                ? "bg-primary text-primary-foreground" 
                                : "bg-muted"
                            )}
                          >
                            <p>{msg.text}</p>
                            <p 
                              className={cn(
                                "text-xs mt-1",
                                msg.sender === "user" 
                                  ? "text-primary-foreground/70" 
                                  : "text-muted-foreground"
                              )}
                            >
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="border-t p-3">
                  <div className="flex gap-2 w-full">
                    <Textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message here..."
                      className="min-h-[60px] flex-grow resize-none"
                    />
                    <Button onClick={sendMessage} size="icon" className="h-[60px] w-[60px]">
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="support-ticket" className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Support Ticket</CardTitle>
                  <CardDescription>
                    Fill out the form below to create a support ticket. Our team will respond within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Your Name
                        </label>
                        <Input id="name" placeholder="John Doe" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <Input id="email" type="email" placeholder="john@example.com" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Input id="subject" placeholder="Brief description of your issue" />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="category" className="text-sm font-medium">
                        Category
                      </label>
                      <select 
                        id="category" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select a category</option>
                        <option value="account">Account Issues</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="report">Palm Reading Report</option>
                        <option value="compatibility">Compatibility Matching</option>
                        <option value="technical">Technical Issues</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your issue in detail. Include any relevant order numbers or account information."
                        rows={6}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="file" className="text-sm font-medium">
                        Attachments (Optional)
                      </label>
                      <Input id="file" type="file" />
                      <p className="text-xs text-muted-foreground">
                        Accepted file types: JPG, PNG, PDF. Maximum file size: 10MB.
                      </p>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Reset Form</Button>
                  <Button>Submit Ticket</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="help-center" className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Info className="h-5 w-5 text-primary" /> Getting Started
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>
                        <a href="/faq#palm-reading" className="text-primary hover:underline flex items-center">
                          How to upload your palm images <ArrowRight className="ml-1 h-3 w-3" />
                        </a>
                      </li>
                      <li>
                        <a href="/faq#compatibility" className="text-primary hover:underline flex items-center">
                          Understanding compatibility reports <ArrowRight className="ml-1 h-3 w-3" />
                        </a>
                      </li>
                      <li>
                        <a href="/faq#reports" className="text-primary hover:underline flex items-center">
                          Reading your palm analysis <ArrowRight className="ml-1 h-3 w-3" />
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" /> Common Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>
                        <a href="/faq#technical" className="text-primary hover:underline flex items-center">
                          Troubleshooting image uploads <ArrowRight className="ml-1 h-3 w-3" />
                        </a>
                      </li>
                      <li>
                        <a href="/faq#billing" className="text-primary hover:underline flex items-center">
                          Payment and billing questions <ArrowRight className="ml-1 h-3 w-3" />
                        </a>
                      </li>
                      <li>
                        <a href="/cancellation" className="text-primary hover:underline flex items-center">
                          Refund and cancellation policy <ArrowRight className="ml-1 h-3 w-3" />
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-primary" /> Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>
                        <a href="/documentation" className="text-primary hover:underline flex items-center">
                          User guides and tutorials <ArrowRight className="ml-1 h-3 w-3" />
                        </a>
                      </li>
                      <li>
                        <a href="/blog" className="text-primary hover:underline flex items-center">
                          Blog articles and resources <ArrowRight className="ml-1 h-3 w-3" />
                        </a>
                      </li>
                      <li>
                        <a href="/privacy" className="text-primary hover:underline flex items-center">
                          Privacy and terms <ArrowRight className="ml-1 h-3 w-3" />
                        </a>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Contact Information */}
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="heading-md mb-6 text-center">Alternative Ways to Reach Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-muted-foreground mb-4">For general inquiries</p>
                <a href="mailto:support@palmistryai.com" className="text-primary hover:underline">
                  support@palmistryai.com
                </a>
              </div>
              
              <div className="glass-panel p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-muted-foreground mb-4">Customer support line</p>
                <a href="tel:+1234567890" className="text-primary hover:underline">
                  +1 (234) 567-890
                </a>
              </div>
              
              <div className="glass-panel p-6 rounded-2xl text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Social Media</h3>
                <p className="text-muted-foreground mb-4">Message us on social</p>
                <div className="flex justify-center space-x-4">
                  <a href="#" className="text-primary hover:underline">Twitter</a>
                  <a href="#" className="text-primary hover:underline">Facebook</a>
                  <a href="#" className="text-primary hover:underline">Instagram</a>
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

export default Support;
