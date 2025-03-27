
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PalmReading from "./pages/PalmReading";
import PalmReadingResult from "./pages/PalmReadingResult";
import Compatibility from "./pages/Compatibility";
import CompatibilityResult from "./pages/CompatibilityResult";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Cancellation from "./pages/Cancellation";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Support from "./pages/Support";
import Documentation from "./pages/Documentation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import { GeminiProvider } from "./contexts/GeminiContext";

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GeminiProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/palm-reading" element={<PalmReading />} />
              <Route path="/palm-reading-result" element={<PalmReadingResult />} />
              <Route path="/compatibility" element={<Compatibility />} />
              <Route path="/compatibility-result" element={<CompatibilityResult />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cancellation" element={<Cancellation />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/support" element={<Support />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GeminiProvider>
    </QueryClientProvider>
  );
};

export default App;
