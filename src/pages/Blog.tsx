
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, BookOpen, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Palmistry', 'Relationships', 'Spirituality', 'Self-Discovery', 'Technology'];
  
  const blogPosts = [
    {
      id: 1,
      title: "Understanding the Major Lines in Palm Reading",
      excerpt: "Discover the significance of the heart line, head line, life line, and fate line in traditional palmistry and how our AI interprets them.",
      image: "placeholder.svg",
      author: "Dr. Rajiv Sharma",
      date: "June 15, 2023",
      readTime: "8 min read",
      category: "Palmistry",
      featured: true
    },
    {
      id: 2,
      title: "How Palm Reading Can Reveal Compatibility Patterns",
      excerpt: "Learn how specific palm features can indicate relationship patterns and compatibility between partners according to ancient wisdom.",
      image: "placeholder.svg",
      author: "Miguel Costa",
      date: "May 22, 2023",
      readTime: "6 min read",
      category: "Relationships"
    },
    {
      id: 3,
      title: "The Science Behind AI Palm Analysis",
      excerpt: "Explore how machine learning algorithms can identify and interpret palm lines with accuracy that rivals traditional palm readers.",
      image: "placeholder.svg",
      author: "Emily Lee",
      date: "April 30, 2023",
      readTime: "10 min read",
      category: "Technology"
    },
    {
      id: 4,
      title: "Improving Your Relationship Through Palm Insights",
      excerpt: "Practical advice on how to use the knowledge from your palm reading to enhance communication and understanding with your partner.",
      image: "placeholder.svg",
      author: "Sarah Johnson",
      date: "April 12, 2023",
      readTime: "7 min read",
      category: "Relationships"
    },
    {
      id: 5,
      title: "Ancient Palmistry Traditions Around the World",
      excerpt: "From India to China to Europe, explore how different cultures developed their own systems of palm reading throughout history.",
      image: "placeholder.svg",
      author: "Dr. Rajiv Sharma",
      date: "March 28, 2023",
      readTime: "9 min read",
      category: "Palmistry"
    },
    {
      id: 6,
      title: "Using Palm Reading for Personal Growth",
      excerpt: "How to use the insights from your palm analysis as a tool for self-reflection, personal development, and life navigation.",
      image: "placeholder.svg",
      author: "Lisa Wong",
      date: "March 15, 2023",
      readTime: "5 min read",
      category: "Self-Discovery"
    }
  ];
  
  const filteredPosts = blogPosts
    .filter(post => post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                   post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(post => selectedCategory === 'All' || post.category === selectedCategory);
  
  const featuredPost = blogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="content-container">
          <div className="text-center mb-12">
            <h1 className="heading-lg mb-4">The PalmistryAI Blog</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore insights into palmistry, relationships, compatibility, and personal growth.
            </p>
          </div>
          
          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-16">
              <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-video bg-muted rounded-tl-2xl rounded-bl-2xl overflow-hidden">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <Badge className="w-fit mb-4">{featuredPost.category}</Badge>
                    <h2 className="heading-md mb-4">{featuredPost.title}</h2>
                    <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-1" /> {featuredPost.author}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" /> {featuredPost.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" /> {featuredPost.readTime}
                      </div>
                    </div>
                    <Button className="w-fit">
                      Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-64">
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    className={`cursor-pointer ${selectedCategory === category ? 'bg-primary' : 'bg-secondary hover:bg-secondary/80'}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          {/* Blog Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map(post => (
                <div key={post.id} className="glass-panel rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-elegant">
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <Badge className="mb-3">{post.category}</Badge>
                    <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-1" /> {post.author}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" /> {post.date}
                      </div>
                    </div>
                    <Button variant="ghost" className="w-full mt-4 flex items-center justify-center">
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any articles matching your search criteria.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
              >
                View All Articles
              </Button>
            </div>
          )}
          
          {/* Newsletter Signup */}
          <div className="mt-16 p-8 glass-panel rounded-2xl max-w-2xl mx-auto text-center">
            <h2 className="heading-md mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter to receive the latest articles, tips, and exclusive content directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-grow"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
