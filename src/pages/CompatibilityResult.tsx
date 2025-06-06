import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { revealAnimation } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Heart, Loader2, Star, Calendar, Diamond, MapPin, Brain, Handshake, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { generatePDF, downloadTextAsPDF } from '@/lib/pdfUtils';
import { useToast } from '@/hooks/use-toast';

const CompatibilityResult = () => {
  const [result, setResult] = useState<string | null>(null);
  const [sections, setSections] = useState<{[key: string]: string}>({});
  const [overallScore, setOverallScore] = useState<number | null>(null);
  const [gunaMilanScore, setGunaMilanScore] = useState<number | null>(null);
  const [yourName, setYourName] = useState<string>('');
  const [partnerName, setPartnerName] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const cleanup = revealAnimation();
    return cleanup;
  }, []);
  
  useEffect(() => {
    // Get compatibility result from sessionStorage
    const storedResult = sessionStorage.getItem('compatibilityResult');
    const storedYourName = sessionStorage.getItem('yourName') || '';
    const storedPartnerName = sessionStorage.getItem('partnerName') || '';
    
    setYourName(storedYourName);
    setPartnerName(storedPartnerName);
    
    if (storedResult) {
      setResult(storedResult);
      parseResultSections(storedResult);
    } else {
      // Use the sample report
      const sampleReport = `
# **💑 Partner Compatibility Report**  
**Generated by AI-Powered Palm Reading & Guna Milan Analysis**  

📅 **Date of Analysis:** March 27, 2025  
👤 **Partner 1:** ${storedYourName || 'John Doe'}  
👩 **Partner 2:** ${storedPartnerName || 'Jane Doe'}  
❤️ **Overall Compatibility Score:** **82% – Strong Compatibility**  

> **Analysis Summary:**  
> ${storedYourName || 'John'} and ${storedPartnerName || 'Jane'} share a deep connection based on passion, intellectual stimulation, and emotional balance. Palmistry reveals a **harmonious blend of structured and creative energies**, while Guna Matching indicates a **strong marital bond with 28 out of 36 Gunas matched**, making them highly compatible.  

---

## **🌟 Guna Milan (Vedic Compatibility Score)**  
According to traditional Hindu matchmaking, there are **8 key factors (Ashta Koot) with a total of 36 Gunas (points)**. A score of **18+ is considered acceptable**, while **24+ is excellent compatibility**.  

| **Guna Category** | **Matched Points (Out of Max)** | **Remarks** |
|------------------|-----------------------------|------------|
| **Varna (Spiritual Compatibility)** | 1/1 | Balanced |
| **Vashya (Dominance & Mutual Influence)** | 2/2 | Great understanding |
| **Tara (Health & Well-being in Marriage)** | 2/3 | Strong but needs attention to health |
| **Yoni (Physical & Sexual Compatibility)** | 3/4 | Strong intimacy and attraction |
| **Maitri (Mental Compatibility & Bonding)** | 5/5 | Excellent mental connection |
| **Gana (Temperament Compatibility)** | 5/6 | Mostly aligned but minor emotional differences |
| **Bhakoot (Wealth & Career Growth Together)** | 6/7 | Financial and career support is strong |
| **Nadi (Health & Genetic Compatibility)** | 4/8 | Slight concerns; mindful health planning needed |

**✅ Total Guna Score: 28/36 → Highly Compatible**  

💡 **Final Verdict:**  
🔹 **Excellent compatibility** for marriage and long-term commitment.  
🔹 **Strong mental, emotional, and financial support for each other.**  
🔹 **Only minor adjustments needed in emotional and health aspects.**  

---

## **🖐 Hand Shape & Element Compatibility**  
**${storedYourName || 'John'}'s Hand Shape:** Fire (Square palm, long fingers) 🔥  
**${storedPartnerName || 'Jane'}'s Hand Shape:** Air (Long palm, short fingers) 🌬️  

💡 **Elemental Compatibility:** Fire + Air = **High Compatibility (90%)**  

🔥 Fire hands represent passion, confidence, and a high-energy approach to life.  
🌬️ Air hands symbolize intellect, adaptability, and strong communication skills.  

➡️ **Why this works:** Fire needs air to burn, and Air brings ideas, excitement, and intellectual connection to Fire's energy.  

⚠️ **Potential Challenges:** Fire (${storedYourName || 'John'}) may be **impulsive**, while Air (${storedPartnerName || 'Jane'}) is **logical and detached** at times.  

💖 **Advice:** Maintain balance by ensuring both partners **validate each other's emotional and intellectual needs**.  

---

## **💓 Heart Line Analysis (Love & Emotional Connection)**  
- **${storedYourName || 'John'}'s Heart Line:** Deeply curved → Passionate, expressive, and emotionally intense.  
- **${storedPartnerName || 'Jane'}'s Heart Line:** Slightly curved → Balanced, practical, but reserved in emotions.  

💬 **Emotional Compatibility Score: 80%**  

📌 **Challenges:**  
- ${storedYourName || 'John'} is **highly affectionate**, while ${storedPartnerName || 'Jane'} prefers **practical and steady love**.  
- ${storedYourName || 'John'} may sometimes feel ${storedPartnerName || 'Jane'} is distant, while ${storedPartnerName || 'Jane'} may feel ${storedYourName || 'John'} is too emotional.  

💡 **Advice:** Open communication about emotional needs will strengthen intimacy.  

---

## **🧠 Head Line Analysis (Thinking & Communication)**  
- **${storedYourName || 'John'}'s Head Line:** Long and straight → Logical, strategic, and structured.  
- **${storedPartnerName || 'Jane'}'s Head Line:** Wavy and medium-length → Creative, spontaneous, and intuitive.  

💬 **Communication Compatibility Score: 85%**  

📌 **Strengths:**  
✔ ${storedYourName || 'John'} brings **clarity and structured thinking**.  
✔ ${storedPartnerName || 'Jane'} adds **creativity and fresh perspectives**.  

⚠️ **Challenges:**  
- ${storedYourName || 'John'} may find ${storedPartnerName || 'Jane'} **too unpredictable**, while ${storedPartnerName || 'Jane'} may feel ${storedYourName || 'John'} **too rigid**.  

💡 **Advice:** Find a balance—**${storedYourName || 'John'} should embrace spontaneity**, and **${storedPartnerName || 'Jane'} should plan ahead more often**.  

---

## **🔮 Fate Line Analysis (Life Goals & Stability)**  
- **${storedYourName || 'John'}'s Fate Line:** Deep and straight → Highly ambitious, career-driven.  
- **${storedPartnerName || 'Jane'}'s Fate Line:** Faint and slightly broken → Adaptable, prefers freedom over rigid plans.  

⚖️ **Life Path Compatibility Score: 75%**  

📌 **Challenges:**  
- ${storedYourName || 'John'} seeks **financial and career stability**, while ${storedPartnerName || 'Jane'} **values exploration and flexibility**.  
- ${storedYourName || 'John'} may feel ${storedPartnerName || 'Jane'} lacks **direction**, while ${storedPartnerName || 'Jane'} may feel ${storedYourName || 'John'} is **too focused on work**.  

💡 **Advice:**  
- **${storedYourName || 'John'} should encourage ${storedPartnerName || 'Jane'}'s creative pursuits.**  
- **${storedPartnerName || 'Jane'} should support ${storedYourName || 'John'}'s structured ambitions.**  

---

## **🔥 Venus Mount Analysis (Romantic & Physical Attraction)**  
- **${storedYourName || 'John'}'s Venus Mount:** High → Passionate, sensual, romantic.  
- **${storedPartnerName || 'Jane'}'s Venus Mount:** Moderate → Romantic but prefers emotional over physical intimacy.  

💋 **Physical Chemistry Score: 88%**  

📌 **Strengths:**  
✔ ${storedYourName || 'John'}'s **intense romantic nature** keeps the spark alive.  
✔ ${storedPartnerName || 'Jane'}'s **emotional stability** ensures deep connection.  

⚠️ **Challenges:**  
- ${storedYourName || 'John'} may desire **more physical affection** than ${storedPartnerName || 'Jane'} naturally expresses.  
- ${storedPartnerName || 'Jane'} may **require deeper emotional engagement** before physical intimacy.  

💡 **Advice:** Balance physical affection and emotional bonding to maintain intimacy.  

---

## **💍 Marriage Line Analysis (Commitment & Long-Term Stability)**  
- **${storedYourName || 'John'}'s Marriage Line:** Deep and clear → Strong commitment, loyal.  
- **${storedPartnerName || 'Jane'}'s Marriage Line:** Slightly forked → Committed but needs reassurance.  

🔗 **Commitment Compatibility Score: 80%**  

📌 **Challenges:**  
- ${storedPartnerName || 'Jane'} may sometimes have **doubts about long-term plans**.  
- ${storedYourName || 'John'} needs **to be patient and provide emotional reassurance**.  

💡 **Advice:** Discuss long-term goals openly to **align expectations**.  

---

# **📜 Final Compatibility Summary**  

### ✅ **Overall Compatibility:** **82% – Strong Relationship Potential**  
💖 **Guna Milan Score:** 28/36 → **Highly Compatible**  
🖐 **Palm Analysis:** Strong emotional, intellectual, and physical connection  

### 🔥 **Strengths:**  
✔ Passionate emotional and physical connection.  
✔ Complementary personalities—${storedYourName || 'John'}'s structure balances ${storedPartnerName || 'Jane'}'s flexibility.  
✔ High levels of intellectual stimulation and deep conversations.  

### ⚠ **Challenges:**  
❌ ${storedYourName || 'John'} may feel ${storedPartnerName || 'Jane'} is emotionally distant at times.  
❌ ${storedPartnerName || 'Jane'} may find ${storedYourName || 'John'} too structured or goal-driven.  
❌ Differences in long-term life approach may require balance.  

### 💡 **Relationship Advice:**  
💖 Keep communication open—understand each other's emotional needs.  
📅 Plan for the future together, but allow space for flexibility.  
🕯️ Keep the romance alive by balancing **physical affection & emotional intimacy**.  

---

## **✨ Personalized Recommendations**  
🌟 **Best Activities as a Couple:**  
✅ Travel together (${storedYourName || 'John'} plans, ${storedPartnerName || 'Jane'} brings spontaneity!)  
✅ Engage in deep conversations and debates.  
✅ Balance structure with fun—schedule "random adventure" days.  

💎 **Final Thought:**  
This is a relationship filled with **passion, excitement, and growth potential**. If nurtured well, this love can stand the test of time. 💞  

---

**End of Report**  
🔍 **Generated by AI Palm Analysis & Guna Milan Calculation**  
      `;
      setResult(sampleReport);
      parseResultSections(sampleReport);
      
      // For demo purposes, save this to sessionStorage
      sessionStorage.setItem('compatibilityResult', sampleReport);
    }
  }, [navigate]);
  
  const parseResultSections = (resultText: string) => {
    const sectionMap: {[key: string]: string} = {};
    let currentSection = '';
    let sectionContent: string[] = [];
    const lines = resultText.split('\n');
    
    // Extract overall percentage if available
    const percentageMatch = resultText.match(/Overall\s+Compatibility.*?(\d{1,3})%/i);
    if (percentageMatch) {
      setOverallScore(parseInt(percentageMatch[1]));
    }

    // Extract Guna Milan score if available
    const gunaMilanMatch = resultText.match(/Guna\s+Score.*?(\d{1,2})\/36/i);
    if (gunaMilanMatch) {
      setGunaMilanScore(parseInt(gunaMilanMatch[1]));
    }
    
    // Parse sections
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if line is a section header
      if (line.match(/^#+\s/) || (line.match(/\*\*.*?\*\*/) && !line.includes(':'))) {
        // Save previous section
        if (currentSection && sectionContent.length > 0) {
          sectionMap[currentSection] = sectionContent.join('\n');
        }
        
        // Start new section
        currentSection = line.replace(/^#+\s/, '').replace(/\*/g, '').trim();
        sectionContent = [];
      } else if (currentSection) {
        // Add line to current section
        sectionContent.push(line);
      }
    }
    
    // Add the last section
    if (currentSection && sectionContent.length > 0) {
      sectionMap[currentSection] = sectionContent.join('\n');
    }
    
    // Map sections to more standardized names
    const mappedSections: {[key: string]: string} = {};
    
    // Map specific section titles to our expected section names
    Object.entries(sectionMap).forEach(([key, value]) => {
      if (key.includes('Partner Compatibility Report')) {
        mappedSections['Overview'] = value;
      } else if (key.includes('Guna Milan')) {
        mappedSections['Guna Milan Analysis'] = value;
      } else if (key.includes('Hand Shape')) {
        mappedSections['Hand Shape & Element Matching'] = value;
      } else if (key.includes('Heart Line')) {
        mappedSections['Heart Line Analysis'] = value;
      } else if (key.includes('Head Line')) {
        mappedSections['Head Line Analysis'] = value;
      } else if (key.includes('Fate Line')) {
        mappedSections['Fate Line Comparison'] = value;
      } else if (key.includes('Venus Mount')) {
        mappedSections['Venus Mount Analysis'] = value;
      } else if (key.includes('Marriage Line')) {
        mappedSections['Marriage Line Assessment'] = value;
      } else if (key.includes('Final Compatibility Summary')) {
        mappedSections['Overall Compatibility'] = value;
      } else if (key.includes('Strengths') || key.includes('Challenges')) {
        mappedSections['Relationship Strengths'] = value;
      } else if (key.includes('Personalized')) {
        mappedSections['Personalized Advice'] = value;
      } else {
        // Keep other sections as is
        mappedSections[key] = value;
      }
    });
    
    setSections(mappedSections);
  };
  
  const handleBackClick = () => {
    navigate('/compatibility');
  };
  
  const handleDownloadReport = async () => {
    if (!result) return;
    
    setIsDownloading(true);
    try {
      const fileName = `Palm_Compatibility_${yourName ? yourName + '_' : ''}${partnerName ? partnerName : 'Report'}.pdf`;
      
      await generatePDF({
        title: 'Palm & Vedic Compatibility Analysis',
        subtitle: yourName && partnerName ? `${yourName} & ${partnerName}` : 'Relationship Compatibility Report',
        content: result,
        fileName
      });
      
      toast({
        title: "Report Downloaded",
        description: "Your compatibility report has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Try fallback method
      try {
        const fileName = `Palm_Compatibility_${yourName ? yourName + '_' : ''}${partnerName ? partnerName : 'Report'}.txt`;
        await downloadTextAsPDF(result, fileName);
      } catch (fallbackError) {
        console.error('Fallback method failed:', fallbackError);
        toast({
          title: "Download Failed",
          description: "There was a problem downloading your report. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Function to get score color based on value
  const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-300";
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-emerald-400";
    if (score >= 40) return "bg-yellow-500";
    if (score >= 20) return "bg-orange-500";
    return "bg-red-500";
  };

  // Function to get Guna Milan score color
  const getGunaMilanColor = (score: number | null) => {
    if (score === null) return "bg-gray-300";
    if (score >= 28) return "bg-green-500"; // 28-36 Excellent match
    if (score >= 20) return "bg-emerald-400"; // 20-27 Good match
    if (score >= 14) return "bg-yellow-500"; // 14-19 Average match
    if (score >= 8) return "bg-orange-500"; // 8-13 Poor match
    return "bg-red-500"; // 0-7 Very poor match
  };
  
  // Function to convert markdown to HTML (enhanced version)
  const markdownToHtml = (markdown: string) => {
    if (!markdown) return '';
    
    let html = markdown
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Headers
      .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2 text-black">$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-black">$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4 text-black">$1</h1>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="my-6 border-t border-gray-300" />')
      // Lists
      .replace(/^- (.*?)$/gm, '<li class="ml-6 list-disc text-black">$1</li>')
      .replace(/^✅ (.*?)$/gm, '<li class="ml-6 flex items-start"><span class="mr-2 text-green-500">✅</span><span class="text-black">$1</span></li>')
      // Replace emoji
      .replace(/➡️/g, '→')
      .replace(/⚠️/g, '⚠')
      .replace(/📌/g, '📍')
      .replace(/💡/g, '💡')
      .replace(/🔹/g, '<span class="ml-4 inline-block">•</span>')
      .replace(/❌/g, '<span class="text-red-500">✖</span>')
      // Blockquotes
      .replace(/^> (.*?)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4 text-black">$1</blockquote>')
      // Find list items and wrap them
      .replace(/(<li.*?>.*?<\/li>)(\n<li.*?>.*?<\/li>)+/gs, '<ul class="my-3">$&</ul>');
    
    // Process tables (improved logic)
    const tablePattern = /\|(.*?)\|\n\|([-:\|\s]+)\|\n(\|.*\|\n?)+/g;
    html = html.replace(tablePattern, (tableMatch) => {
      const tableLines = tableMatch.split('\n').filter(line => line.trim() !== '');
      
      if (tableLines.length < 2) return tableMatch; // Not enough lines for a table
      
      // Extract header
      const headerLine = tableLines[0];
      const headerCells = headerLine.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
      
      // Skip separator line
      
      // Process rows
      const rows = tableLines.slice(2);
      
      let tableHtml = '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-gray-300 bg-white">';
      
      // Add header
      tableHtml += '<thead><tr>';
      headerCells.forEach(header => {
        tableHtml += `<th class="border border-gray-300 px-4 py-2 bg-gray-100 text-black">${header}</th>`;
      });
      tableHtml += '</tr></thead>';
      
      // Add rows
      if (rows.length > 0) {
        tableHtml += '<tbody>';
        rows.forEach(row => {
          const cells = row.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
          tableHtml += '<tr>';
          cells.forEach(cell => {
            tableHtml += `<td class="border border-gray-300 px-4 py-2 text-black">${cell}</td>`;
          });
          tableHtml += '</tr>';
        });
        tableHtml += '</tbody>';
      }
      
      tableHtml += '</table></div>';
      return tableHtml;
    });
    
    // Convert newlines to <br> tags, but not inside HTML elements
    html = html.replace(/\n(?!<)/g, '<br>');
    
    // Set all remaining text to black explicitly
    html = `<div class="text-black">${html}</div>`;
    
    return html;
  };
  
  // Render the full report as HTML
  const renderFullReport = () => {
    if (!result) return null;
    
    return (
      <div className="prose prose-lg max-w-none mx-auto">
        <div dangerouslySetInnerHTML={{ __html: markdownToHtml(result) }} />
      </div>
    );
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-32 pb-24 bg-white">
        <div className="content-container">
          <div className="max-w-4xl mx-auto text-center mb-12 reveal">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Heart className="h-4 w-4 mr-2" />
              Comprehensive Compatibility Analysis
            </div>
            <h1 className="heading-lg mb-6 text-black">
              {yourName && partnerName 
                ? `${yourName} & ${partnerName}'s Compatibility`
                : 'Your Relationship Compatibility Results'}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-black">
              Based on palmistry principles and Vedic astrology's Guna Milan system, our AI has analyzed your relationship compatibility.
              The following insights reveal your relationship dynamics, strengths, and potential.
            </p>
            
            <div className="mt-8 mb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {overallScore !== null && (
                <div>
                  <div className="text-xl font-bold mb-2 flex items-center justify-center gap-2 text-black">
                    <Star className="h-5 w-5 text-yellow-500" /> 
                    Overall Compatibility Score
                  </div>
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-black">Low</span>
                      <span className="text-lg font-bold text-black">{overallScore}%</span>
                      <span className="text-sm text-black">High</span>
                    </div>
                    <Progress value={overallScore} className="h-3" style={{ backgroundColor: "var(--muted)" }}>
                      <div 
                        className={`h-full transition-all duration-1000 ${getScoreColor(overallScore)}`} 
                        style={{ width: `${overallScore}%` }}
                      ></div>
                    </Progress>
                  </div>
                </div>
              )}
              
              {gunaMilanScore !== null && (
                <div>
                  <div className="text-xl font-bold mb-2 flex items-center justify-center gap-2 text-black">
                    <Calendar className="h-5 w-5 text-blue-500" /> 
                    Guna Milan Score
                  </div>
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-black">0</span>
                      <span className="text-lg font-bold text-black">{gunaMilanScore}/36</span>
                      <span className="text-sm text-black">36</span>
                    </div>
                    <Progress 
                      value={(gunaMilanScore / 36) * 100} 
                      className="h-3" 
                      style={{ backgroundColor: "var(--muted)" }}
                    >
                      <div 
                        className={`h-full transition-all duration-1000 ${getGunaMilanColor(gunaMilanScore)}`}
                        style={{ width: `${(gunaMilanScore / 36) * 100}%` }}
                      ></div>
                    </Progress>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto glass-panel rounded-2xl p-8 mb-12 reveal bg-white">
            <Tabs defaultValue="full-report" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-1 mb-6">
                <TabsTrigger value="full-report" className="cursor-pointer">
                  <Star className="h-4 w-4 mr-1" /> Full Report
                </TabsTrigger>
                <TabsTrigger value="sections" className="cursor-pointer">
                  <Calendar className="h-4 w-4 mr-1" /> By Sections
                </TabsTrigger>
                <TabsTrigger value="summary" className="cursor-pointer">
                  <Heart className="h-4 w-4 mr-1" /> Summary
                </TabsTrigger>
                <TabsTrigger value="advice" className="cursor-pointer">
                  <Sparkles className="h-4 w-4 mr-1" /> Advice
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="full-report" className="space-y-6 text-black">
                {result ? (
                  <div className="prose prose-lg max-w-none text-black">
                    <div dangerouslySetInnerHTML={{ __html: markdownToHtml(result) }} />
                  </div>
                ) : (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="sections" className="space-y-6 text-black">
                <div className="prose prose-lg max-w-none">
                  {Object.keys(sections).length > 0 ? (
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 mb-6">
                        <TabsTrigger value="overview">
                          <Star className="h-4 w-4 mr-1" /> Overview
                        </TabsTrigger>
                        <TabsTrigger value="gunamilan">
                          <Calendar className="h-4 w-4 mr-1" /> Guna Milan
                        </TabsTrigger>
                        <TabsTrigger value="emotional">
                          <Heart className="h-4 w-4 mr-1" /> Emotional
                        </TabsTrigger>
                        <TabsTrigger value="intellectual">
                          <Brain className="h-4 w-4 mr-1" /> Intellectual
                        </TabsTrigger>
                        <TabsTrigger value="life-path">
                          <MapPin className="h-4 w-4 mr-1" /> Life Path
                        </TabsTrigger>
                        <TabsTrigger value="advice">
                          <Sparkles className="h-4 w-4 mr-1" /> Advice
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="overview" className="space-y-6">
                        <div className="prose prose-lg max-w-none">
                          {(sections['Overview'] || sections['Partner Compatibility Report']) && (
                            <div className="mb-6">
                              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Star className="h-5 w-5 text-yellow-500" />
                                Overall Compatibility
                              </h3>
                              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(sections['Overview'] || sections['Partner Compatibility Report']) }} />
                            </div>
                          )}
                          
                          {sections['Hand Shape & Element Matching'] && (
                            <div className="mb-6">
                              <h3 className="text-xl font-semibold mb-2">Hand Shape & Element Matching</h3>
                              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(sections['Hand Shape & Element Matching']) }} />
                            </div>
                          )}
                          
                          {sections['Relationship Strengths'] && (
                            <div className="mb-6">
                              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Handshake className="h-5 w-5 text-green-500" />
                                Relationship Strengths
                              </h3>
                              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(sections['Relationship Strengths']) }} />
                            </div>
                          )}
                          
                          {sections['Relationship Challenges'] && (
                            <div>
                              <h3 className="text-xl font-semibold mb-2">Relationship Challenges</h3>
                              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(sections['Relationship Challenges']) }} />
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      {/* Other tabs content */}
                      <TabsContent value="gunamilan" className="space-y-6">
                        <div className="prose prose-lg max-w-none">
                          {sections['Guna Milan Analysis'] ? (
                            <div>
                              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-500" />
                                Guna Milan Analysis
                              </h3>
                              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(sections['Guna Milan Analysis']) }} />
                            </div>
                          ) : (
                            <p className="text-center text-muted-foreground">No Guna Milan analysis available in this report.</p>
                          )}
                        </div>
                      </TabsContent>
                      
                      {/* Other tab contents */}
                      <TabsContent value="emotional" className="space-y-6">
                        <div className="prose prose-lg max-w-none">
                          {sections['Heart Line Analysis'] && (
                            <div className="mb-6">
                              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Heart className="h-5 w-5 text-red-500" />
                                Heart Line Analysis
                              </h3>
                              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(sections['Heart Line Analysis']) }} />
                            </div>
                          )}
                          
                          {sections['Venus Mount Analysis'] && (
                            <div>
                              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Diamond className="h-5 w-5 text-pink-500" />
                                Venus Mount Analysis
                              </h3>
                              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(sections['Venus Mount Analysis']) }} />
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="intellectual" className="space-y-6">
                        <div className="prose prose-lg max-w-none">
                          {sections['Head Line Analysis'] && (
                            <div>
                              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Brain className="h-5 w-5 text-purple-500" />
                                Head Line Analysis
                              </h3>
                              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(sections['Head Line Analysis']) }} />
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="life-path" className="space-y-6">
                        <div className="prose prose-lg max-w-none">
                          {(sections['Fate Line Comparison'] || sections['Fate Line Analysis']) && (
                            <div className="mb-6">
                              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-blue-500" />
                                Fate Line Analysis
                              </h3>
                              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(sections['Fate Line Comparison'] || sections['Fate Line Analysis']) }} />
                            </div>
                          )}
                          
                          {(sections['Marriage Line Assessment'] || sections['Marriage Line Analysis']) && (
                            <div>
                              <h3 className="text-xl font-semibold mb-2">Marriage Line Assessment</h3>
                              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(sections['Marriage Line Assessment'] || sections['Marriage Line Analysis']) }} />
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="advice" className="space-y-6">
                        <div className="prose prose-lg max-w-none">
                          {sections['Personalized Advice'] || sections['Personalized Recommendations'] ? (
                            <div>
                              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-amber-500" />
                                Personalized Advice
                              </h3>
                              <div dangerouslySetInnerHTML={{ 
                                __html: markdownToHtml(sections['Personalized Advice'] || 
                                sections['Personalized Recommendations'] || 
                                sections['Personalized Advice for Improving Compatibility']) 
                              }} />
                            </div>
                          ) : (
                            <p className="text-center text-muted-foreground">No personalized advice available in this report.</p>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No section data available.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="summary" className="space-y-6 text-black">
                <div className="prose prose-lg max-w-none">
                  {sections['Overall Compatibility'] ? (
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        Compatibility Summary
                      </h3>
                      <div dangerouslySetInnerHTML={{ __html: markdownToHtml(sections['Overall Compatibility']) }} />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Summary not available in this report format.</p>
                      <p className="mt-2">Please view the full report for complete details.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="advice" className="space-y-6 text-black">
                <div className="prose prose-lg max-w-none">
                  {sections['Personalized Advice'] || sections['Personalized Recommendations'] ? (
                    <div>
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        Personalized Recommendations
                      </h3>
                      <div dangerouslySetInnerHTML={{ 
                        __html: markdownToHtml(sections['Personalized Advice'] || 
                        sections['Personalized Recommendations'] || 
                        sections['Personalized Advice for Improving Compatibility']) 
                      }} />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Personalized advice not available.</p>
                      <p className="mt-2">Please view the full report for all recommendations.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex justify-center gap-4 flex-wrap reveal">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Compatibility
            </Button>
            
            <Button 
              className="flex items-center gap-2 cursor-pointer"
              disabled={!result || isDownloading}
              onClick={handleDownloadReport}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Report
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CompatibilityResult;
