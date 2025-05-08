import { toast } from "@/hooks/use-toast";

export const generatePDF = async ({ title, subtitle, content, fileName }) => {
  console.log('Generating PDF with content:', { title, subtitle });
  
  try {
    // Create an HTML string with nicely formatted content
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 40px;
      color: #000000;
      background-color: #ffffff;
    }
    h1 {
      color: #006400;
      text-align: center;
      margin-bottom: 30px;
      font-size: 24px;
    }
    h2 {
      color: #008000;
      margin-top: 20px;
      margin-bottom: 10px;
      font-size: 18px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    h3, h4 {
      color: #006400;
      margin-top: 15px;
      margin-bottom: 8px;
    }
    .section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .chapter {
      page-break-before: always;
    }
    .first-chapter {
      page-break-before: avoid;
    }
    .insight {
      padding: 12px;
      margin: 10px 0;
      background-color: #f9f9f9;
      border-left: 3px solid #00FF7F;
    }
    .insight-title {
      font-weight: bold;
      margin-bottom: 8px;
      color: #006400;
    }
    .insight-content {
      line-height: 1.5;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    p {
      text-align: justify;
      margin-bottom: 10px;
      color: #000000;
    }
    .compatibility-score {
      font-size: 18px;
      font-weight: bold;
      color: #006400;
      text-align: center;
      margin: 20px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }
    table, th, td {
      border: 1px solid #ddd;
    }
    th, td {
      padding: 8px;
      text-align: left;
      color: #000000;
    }
    th {
      background-color: #f2f2f2;
    }
    ul, ol {
      margin-left: 20px;
      margin-bottom: 15px;
      color: #000000;
    }
    li {
      margin-bottom: 5px;
      color: #000000;
    }
    blockquote {
      border-left: 4px solid #00FF7F;
      padding-left: 15px;
      margin: 15px 0;
      font-style: italic;
      color: #555;
    }
    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 20px 0;
    }
    strong {
      font-weight: bold;
    }
    em {
      font-style: italic;
    }
    .emoji {
      font-size: 16px;
    }
    .cover-page {
      text-align: center;
      padding: 50px 0;
    }
    .cover-title {
      font-size: 28px;
      color: #006400;
      margin-bottom: 10px;
    }
    .cover-subtitle {
      font-size: 18px;
      color: #008000;
      margin-bottom: 30px;
      font-style: italic;
    }
    .cover-meta {
      margin-top: 50px;
      font-size: 14px;
    }
    .page-header {
      font-weight: bold;
      color: #006400;
      border-bottom: 2px solid #006400;
      padding-bottom: 5px;
      margin-bottom: 15px;
    }
    .welcome-letter {
      padding: 20px;
      font-style: italic;
      line-height: 1.8;
    }
    .signature {
      text-align: right;
      font-style: italic;
      margin-top: 30px;
    }
    .dashboard {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>`;

  if (subtitle) {
    htmlContent += `<h2 style="text-align: center; color: #444; border-bottom: none;">${subtitle}</h2>`;
  }

  // Check if content contains page markers for the PalmCode™ report format
  const hasPageMarkers = content && (content.includes("**Page 1:") || content.includes("PAGE 1:"));

  // Add the content with proper Markdown-to-HTML conversion
  if (content) {
    // Process content for Markdown
    let processedContent = content;

    if (hasPageMarkers) {
      // Enhanced processing for structured PalmCode™ report
      processedContent = formatPalmCodeReport(content);
    } else {
      // Standard markdown processing
      processedContent = content
        // Handle headers
        .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
        .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
        .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
        .replace(/^#### (.*?)$/gm, '<h4>$1</h4>')
        // Handle bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Handle lists
        .replace(/^- (.*?)$/gm, '<li>$1</li>')
        .replace(/^• (.*?)$/gm, '<li>$1</li>')
        .replace(/^✅ (.*?)$/gm, '<li>✅ $1</li>')
        .replace(/^(\d+)\. (.*?)$/gm, '<li>$2</li>')
        // Handle blockquotes
        .replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>')
        // Handle horizontal rules
        .replace(/^---$/gm, '<hr>')
        // Handle emoji (keep them for now)
        .replace(/📅|👤|👩|❤️|🌟|🖐|💓|🧠|🔮|🔥|💍|📜|✅|🔥|⚠|💡|✨|🌟|💎|➡️|📌|🔹|❌|💖|⚖️|💋|🔗|💞/g, match => `<span class="emoji">${match}</span>`);
      
      // Handle tables with a better regex
      const tableRegex = /\|(.*?)\|\r?\n\|([\-:]+\|)+\r?\n((?:\|.*?\|\r?\n?)+)/g;
      processedContent = processedContent.replace(tableRegex, (match) => {
        const lines = match.split('\n').filter(line => line.trim());
        if (lines.length < 3) return match; // Not enough lines for a table
        
        const headerLine = lines[0];
        const headerCells = headerLine.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
        
        // Skip the separator line
        
        // Process data rows
        const dataRows = lines.slice(2);
        
        let tableHtml = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">';
        
        // Add header row
        tableHtml += '<tr>';
        headerCells.forEach(header => {
          tableHtml += `<th style="background-color: #f2f2f2;">${header}</th>`;
        });
        tableHtml += '</tr>';
        
        // Add data rows
        dataRows.forEach(row => {
          const cells = row.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
          tableHtml += '<tr>';
          cells.forEach(cell => {
            tableHtml += `<td>${cell}</td>`;
          });
          tableHtml += '</tr>';
        });
        
        tableHtml += '</table>';
        return tableHtml;
      });
      
      // Wrap adjacent list items in ul tags
      processedContent = processedContent.replace(/(<li>.*?<\/li>)+/g, '<ul style="margin-left: 20px; margin-bottom: 15px;">$&</ul>');
    }
    
    // Inject the processed content
    htmlContent += processedContent;
  }

  htmlContent += `
  <div class="footer">
    This report was generated by PalmReading.ai based on palm analysis and Vedic astrology principles.
    Copyright © ${new Date().getFullYear()} PalmReading.ai
  </div>
</body>
</html>`;
    
    // Use the printJS functionality to print HTML as PDF
    return printHTMLAsPDF(htmlContent, fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Function to format PalmCode™ report with proper page structure
const formatPalmCodeReport = (content) => {
  // Split content by page markers
  const pageRegex = /\*\*Page \d+:(.*?)\*\*|\*\*PAGE \d+:(.*?)\*\*|---\s*\n\s*\*\*Page \d+:(.*?)\*\*|---\s*\n\s*\*\*PAGE \d+:(.*?)\*\*/gs;
  
  // First, replace the separator between pages with a special marker
  const contentWithMarkers = content.replace(/---\s*\n\s*\*\*Page \d+:/g, '<<<PAGE_BREAK>>>\n**Page ');
  contentWithMarkers.replace(/---\s*\n\s*\*\*PAGE \d+:/g, '<<<PAGE_BREAK>>>\n**PAGE ');
  
  // Split by page breaks
  const pages = contentWithMarkers.split('<<<PAGE_BREAK>>>');
  
  let processedContent = '';
  
  pages.forEach((page, index) => {
    // Process each page
    let pageContent = page.trim();
    
    // Extract the page title
    const pageTitleMatch = pageContent.match(/^\*\*Page \d+:(.*?)\*\*|^\*\*PAGE \d+:(.*?)\*\*/);
    const pageTitle = pageTitleMatch ? (pageTitleMatch[1] || pageTitleMatch[2]).trim() : `Page ${index + 1}`;
    
    // Remove the page title from content for separate processing
    pageContent = pageContent.replace(/^\*\*Page \d+:(.*?)\*\*|^\*\*PAGE \d+:(.*?)\*\*/, '').trim();
    
    // Add page wrapper with page break between pages (except first page)
    processedContent += `
      <div class="${index === 0 ? 'first-chapter' : 'chapter'} section">
        <div class="page-header">Page ${index + 1}: ${pageTitle}</div>
    `;
    
    // Special formatting for specific pages
    if (index === 0) {
      // Cover page
      processedContent += `
        <div class="cover-page">
          <div class="cover-title">${pageTitle}</div>
          ${processMixedContent(pageContent)}
        </div>
      `;
    } else if (pageTitle.includes("Welcome") || pageTitle.includes("Letter")) {
      // Welcome letter
      processedContent += `
        <div class="welcome-letter">
          ${processMixedContent(pageContent)}
        </div>
      `;
    } else if (pageTitle.includes("Dashboard") || pageTitle.includes("Summary")) {
      // Dashboard/Summary
      processedContent += `
        <div class="dashboard">
          ${processMixedContent(pageContent)}
        </div>
      `;
    } else {
      // Standard page
      processedContent += processMixedContent(pageContent);
    }
    
    processedContent += `
      </div>
    `;
  });
  
  return processedContent;
};

// Process mixed content with Markdown formatting
const processMixedContent = (content) => {
  if (!content) return '';
  
  return content
    // Handle headers and formatting
    .replace(/^\*\*\*(.*?)\*\*\*/gm, '<h2>$1</h2>')
    .replace(/^\*\*(.*?)\*\*/gm, '<h3>$1</h3>')
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // Process lists with bullet points
    .replace(/^\* (.*?)$/gm, '<li>$1</li>')
    .replace(/^• (.*?)$/gm, '<li>$1</li>')
    .replace(/^- (.*?)$/gm, '<li>$1</li>')
    .replace(/(\n<li>.*?<\/li>\n)+/gs, '\n<ul>$&</ul>\n')
    
    // Handle blockquotes
    .replace(/^>(.*?)$/gm, '<blockquote>$1</blockquote>')
    
    // Process tables
    .replace(/\|(.*)\|\n\|-+\|\n([\s\S]*?)(?=\n\n|\n[^|]|$)/g, (match, header, body) => {
      const headers = header.split('|').filter(Boolean).map(h => h.trim());
      const rows = body.trim().split('\n').map(row => 
        row.split('|').filter(Boolean).map(cell => cell.trim())
      );
      
      let tableHtml = '<table>';
      tableHtml += '<tr>';
      headers.forEach(h => {
        tableHtml += `<th>${h}</th>`;
      });
      tableHtml += '</tr>';
      
      rows.forEach(row => {
        tableHtml += '<tr>';
        row.forEach(cell => {
          tableHtml += `<td>${cell}</td>`;
        });
        tableHtml += '</tr>';
      });
      
      tableHtml += '</table>';
      return tableHtml;
    })
    
    // Process horizontal rules
    .replace(/^---$/gm, '<hr>')
    
    // Convert newlines to paragraphs for text blocks
    .replace(/([^\n<>][^\n<>]*)\n\n/g, '<p>$1</p>\n\n')
    
    // Clean up excess paragraph tags
    .replace(/<\/p>\s*<p>/g, '</p><p>');
};

// Function to print HTML as PDF using browser's print functionality
export const printHTMLAsPDF = (htmlContent, filename) => {
  try {
    console.log('Creating and printing HTML as PDF...');
    
    // Create an iframe to host the content
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!iframeDocument) {
      throw new Error('Could not create iframe document');
    }
    
    // Write content to iframe
    iframeDocument.open();
    iframeDocument.write(htmlContent);
    iframeDocument.close();
    
    // Add CSS for print
    const style = iframeDocument.createElement('style');
    style.textContent = `
      @media print {
        @page {
          size: A4;
          margin: 0.5cm;
        }
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .chapter {
          page-break-before: always;
        }
      }
    `;
    iframeDocument.head.appendChild(style);
    
    // Change filename
    const originalDocTitle = document.title;
    document.title = filename;
    
    // Wait for resources to load
    setTimeout(() => {
      try {
        // Use the iframe's window to print
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(iframe);
          document.title = originalDocTitle;
          
          toast({
            title: "Success",
            description: `Your ${filename} is ready for download.`,
          });
          
          console.log('PDF generation complete');
        }, 1000);
      } catch (printError) {
        console.error('Error during printing:', printError);
        document.body.removeChild(iframe);
        document.title = originalDocTitle;
        throw printError;
      }
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Error creating PDF:', error);
    throw error;
  }
};

// Simplified backup method in case the main method fails
export const downloadTextAsPDF = async (text, filename) => {
  try {
    console.log('Attempting to download text as PDF using alternative method...');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    toast({
      title: "Success",
      description: `Your ${filename} is ready for download.`,
    });
    
    return true;
  } catch (error) {
    console.error('Error using alternative download method:', error);
    toast({
      title: "Error",
      description: "Failed to generate the PDF report. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

// Generate a demo compatibility report for testing
export const generateDemoReport = async () => {
  const demoContent = `
# **💑 Partner Compatibility Report**  
**Generated by AI-Powered Palm Reading & Guna Milan Analysis**  

📅 **Date of Analysis:** March 27, 2025  
👤 **Partner 1:** John Doe  
👩 **Partner 2:** Jane Doe  
❤️ **Overall Compatibility Score:** **82% – Strong Compatibility**  

> **Analysis Summary:**  
> John and Jane share a deep connection based on passion, intellectual stimulation, and emotional balance. Palmistry reveals a **harmonious blend of structured and creative energies**, while Guna Matching indicates a **strong marital bond with 28 out of 36 Gunas matched**, making them highly compatible.  

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
**John's Hand Shape:** Fire (Square palm, long fingers) 🔥  
**Jane's Hand Shape:** Air (Long palm, short fingers) 🌬️  

💡 **Elemental Compatibility:** Fire + Air = **High Compatibility (90%)**  

🔥 Fire hands represent passion, confidence, and a high-energy approach to life.  
🌬️ Air hands symbolize intellect, adaptability, and strong communication skills.  

➡️ **Why this works:** Fire needs air to burn, and Air brings ideas, excitement, and intellectual connection to Fire's energy.  

⚠️ **Potential Challenges:** Fire (John) may be **impulsive**, while Air (Jane) is **logical and detached** at times.  

💖 **Advice:** Maintain balance by ensuring both partners **validate each other's emotional and intellectual needs**.  

---

## **💓 Heart Line Analysis (Love & Emotional Connection)**  
- **John's Heart Line:** Deeply curved → Passionate, expressive, and emotionally intense.  
- **Jane's Heart Line:** Slightly curved → Balanced, practical, but reserved in emotions.  

💬 **Emotional Compatibility Score: 80%**  

📌 **Challenges:**  
- John is **highly affectionate**, while Jane prefers **practical and steady love**.  
- John may sometimes feel Jane is distant, while Jane may feel John is too emotional.  

💡 **Advice:** Open communication about emotional needs will strengthen intimacy.  

---

## **🧠 Head Line Analysis (Thinking & Communication)**  
- **John's Head Line:** Long and straight → Logical, strategic, and structured.  
- **Jane's Head Line:** Wavy and medium-length → Creative, spontaneous, and intuitive.  

💬 **Communication Compatibility Score: 85%**  

📌 **Strengths:**  
✔ John brings **clarity and structured thinking**.  
✔ Jane adds **creativity and fresh perspectives**.  

⚠️ **Challenges:**  
- John may find Jane **too unpredictable**, while Jane may feel John **too rigid**.  

💡 **Advice:** Find a balance—**John should embrace spontaneity**, and **Jane should plan ahead more often**.  

---

## **🔮 Fate Line Analysis (Life Goals & Stability)**  
- **John's Fate Line:** Deep and straight → Highly ambitious, career-driven.  
- **Jane's Fate Line:** Faint and slightly broken → Adaptable, prefers freedom over rigid plans.  

⚖️ **Life Path Compatibility Score: 75%**  

📌 **Challenges:**  
- John seeks **financial and career stability**, while Jane **values exploration and flexibility**.  
- John may feel Jane lacks **direction**, while Jane may feel John is **too focused on work**.  

💡 **Advice:**  
- **John should encourage Jane's creative pursuits.**  
- **Jane should support John's structured ambitions.**  

---

## **🔥 Venus Mount Analysis (Romantic & Physical Attraction)**  
- **John's Venus Mount:** High → Passionate, sensual, romantic.  
- **Jane's Venus Mount:** Moderate → Romantic but prefers emotional over physical intimacy.  

💋 **Physical Chemistry Score: 88%**  

📌 **Strengths:**  
✔ John's **intense romantic nature** keeps the spark alive.  
✔ Jane's **emotional stability** ensures deep connection.  

⚠️ **Challenges:**  
- John may desire **more physical affection** than Jane naturally expresses.  
- Jane may **require deeper emotional engagement** before physical intimacy.  

💡 **Advice:** Balance physical affection and emotional bonding to maintain intimacy.  

---

## **💍 Marriage Line Analysis (Commitment & Long-Term Stability)**  
- **John's Marriage Line:** Deep and clear → Strong commitment, loyal.  
- **Jane's Marriage Line:** Slightly forked → Committed but needs reassurance.  

🔗 **Commitment Compatibility Score: 80%**  

📌 **Challenges:**  
- Jane may sometimes have **doubts about long-term plans**.  
- John needs **to be patient and provide emotional reassurance**.  

💡 **Advice:** Discuss long-term goals openly to **align expectations**.  

---

# **📜 Final Compatibility Summary**  

### ✅ **Overall Compatibility:** **82% – Strong Relationship Potential**  
💖 **Guna Milan Score:** 28/36 → **Highly Compatible**  
🖐 **Palm Analysis:** Strong emotional, intellectual, and physical connection  

### 🔥 **Strengths:**  
✔ Passionate emotional and physical connection.  
✔ Complementary personalities—John's structure balances Jane's flexibility.  
✔ High levels of intellectual stimulation and deep conversations.  

### ⚠ **Challenges:**  
❌ John may feel Jane is emotionally distant at times.  
❌ Jane may find John too structured or goal-driven.  
❌ Differences in long-term life approach may require balance.  

### 💡 **Relationship Advice:**  
💖 Keep communication open—understand each other's emotional needs.  
📅 Plan for the future together, but allow space for flexibility.  
🕯️ Keep the romance alive by balancing **physical affection & emotional intimacy**.  

---

## **✨ Personalized Recommendations**  
🌟 **Best Activities as a Couple:**  
✅ Travel together (John plans, Jane brings spontaneity!)  
✅ Engage in deep conversations and debates.  
✅ Balance structure with fun—schedule "random adventure" days.  

💎 **Final Thought:**  
This is a relationship filled with **passion, excitement, and growth potential**. If nurtured well, this love can stand the test of time. 💞  

---

**End of Report**  
🔍 **Generated by AI Palm Analysis & Guna Milan Calculation**  
`;

  // Store the demo report in sessionStorage for display
  sessionStorage.setItem('compatibilityResult', demoContent);
  
  try {
    await generatePDF({
      title: "Palm & Vedic Compatibility Analysis",
      subtitle: "John & Jane - Relationship Compatibility Report",
      content: demoContent,
      fileName: "Demo_Compatibility_Report.pdf"
    });
    
    return true;
  } catch (error) {
    console.error("Error generating demo report:", error);
    // Try fallback
    return downloadTextAsPDF(demoContent, "Demo_Compatibility_Report.txt");
  }
};

// Generate a demo comprehensive palm reading report
export const generatePalmCodeSampleReport = async () => {
  const userName = sessionStorage.getItem('userName') || "Aanya Sharma";
  
  const demoContent = `
**PalmCode™ Life Blueprint Report**
*Your Destiny in Your Hands*
**Generated For:** ${userName}
**Date Generated:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

---

**Page 1: Cover Page**
*PalmCode™ Life Blueprint: Your Destiny in Your Hands*
**${userName}**
*AI-Powered Palmistry Report*
Date of Report: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

---

**Page 2: Welcome Letter**
Dear ${userName},

Welcome to your personalized PalmCode™ Life Blueprint. Your palms are not just skin and lines—they are nature's blueprint of your personality, purpose, potential, and path. This 20-page report is generated using modern palmistry, psychological insights, and AI interpretation to give you a crystal-clear view of yourself and your journey ahead.

In the following pages, you'll discover your emotional patterns, ideal career paths, love compatibility, timing of success, health tendencies, and much more. We have also added a Past-Present-Future analysis based on key features of your palm lines and mounts.

With clarity and purpose,
*PalmCode™ Team*

---

**Page 3: Palm Basics – Your Blueprint Map**

* **Hand Type:** Air Hand (Long fingers, square palm)

  * Traits: Intelligent, curious, analytical, needs mental stimulation
* **Mounts:** Strong Mercury and Venus mounts
* **Major Lines:**

  * **Heart Line:** Deep and curved → Emotionally open, romantic
  * **Head Line:** Long and slightly curved → Balanced thinker
  * **Life Line:** Deep and long → Strong vitality
  * **Fate Line:** Present with fork → Career changes likely

---

**Page 4: Personality Profile**
You are a communicator and thinker. Your palm suggests a lively mind, keen observation, and a great sense of humor. You're drawn to new ideas, creative pursuits, and people who challenge your intellect.

**Core Traits:**

* Curious
* Honest
* Loyal
* Sensitive
* Slightly impatient

**Potential Growth Area:** Learn to trust your instincts without overthinking.

---

**Page 5: Emotional Intelligence & Love Life**
**Heart Line Insights:** Deep and rising under index finger → True romantic with high emotional standards.

You value emotional depth, honesty, and support in a partner. You're loving, loyal, and expressive—but can retreat if hurt.

**Ideal Match Traits:**

* Emotionally mature
* Communicative
* Creative or spiritually inclined

**Love Challenges:** Avoid people who are emotionally unavailable.

---

**Page 6: Career Potential & Purpose**
**Fate & Head Line Analysis:**
You have leadership qualities, a sharp mind, and strong intuition. You may experience a shift in your career around age 28–29.

**Best Career Paths:**

* Creative Fields (Design, Writing)
* Psychology or Counseling
* Public Relations or Media
* Education or Life Coaching

You thrive in roles where communication and empathy matter.

---

**Page 7: Success Timing & Life Events**

* **Age 21:** First major decision phase
* **Age 28–29:** Career shift or breakthrough
* **Age 35:** Personal reinvention

Periods of transformation are mapped near breaks or forks in your fate line. These years will offer both challenge and reward.

**Advice:** Embrace these phases; they're aligned with your life purpose.

---

**Page 8: Mental Strengths & Challenges**
You have strong concentration abilities, but mental fatigue can hit when overwhelmed.

**Tips:**

* Use journaling to offload thoughts
* Avoid multitasking excessively
* Prioritize rest and reflection

Your emotional intelligence gives you an edge in relationships and problem-solving.

---

**Page 9: Physical Health & Vitality**
Your life line shows strong vitality and resilience.

**Tendencies:**

* Good stamina
* Likely to burn out if boundaries are not maintained

**Health Focus:**

* Balance activity with mindfulness
* Maintain a regular sleep routine

---

**Page 10: Relationship Compatibility Matrix**
**Best Match Hands:**

* Water Hands: Deep, emotional connections
* Air Hands: Intellectual alignment

**Compatibility Scores:**

* Emotional: 90%
* Physical: 80%
* Mental: 85%

Avoid overly controlling personalities or emotionally closed-off types.

---

**Page 11: Intuition & Spiritual Growth**
A triangle near your Mercury mount shows a natural psychic ability. You are intuitive and pick up on others' energies easily.

**Best Practices:**

* Daily meditation
* Tarot or journaling
* Spending time in nature

---

**Page 12: Creativity & Self-Expression**
Your sun line shows a powerful artistic streak.

**Creative Strengths:**

* Visual arts
* Writing
* Performing arts

You express yourself best through storytelling, music, and mentoring.

---

**Page 13: Social Life & Friendships**
You are an initiator in friendships and highly loyal.

**Friendship Style:**

* Encouraging
* Communicative
* Supportive

You may outgrow friends who lack vision or depth.

---

**Page 14: Financial Habits & Money Mindset**

* Balanced money mount
* Strong thumb = Willpower

**Traits:**

* Moderate spender
* Values experiences over materialism

**Tip:** Invest in learning and personal development—it pays off.

---

**Page 15: Life Lessons & Karmic Insights**
You are here to learn about balance in giving and receiving. You often over-give in love or work.

**Karmic Theme:** Worthiness
**Growth Direction:** Setting boundaries, embracing your value

---

**Page 16: Life Purpose Summary**
**Your Mission:** To uplift others through words, empathy, and wisdom.

You are destined to create a meaningful impact in others' lives using your voice and heart.

**Keywords:** Inspire. Teach. Transform.

---

**Page 17: Past - What Your Palms Reveal**
Your palm indicates a vibrant but emotionally complex past. Early in life, especially around the ages of 7–12, you developed a strong sense of observation and independence. A break in your heart line near the age of 16 reflects a major emotional lesson—perhaps related to trust or relationships.

In your teenage years, your curiosity and creativity blossomed. Strong head and sun lines suggest a supportive environment that encouraged your expression.

**Key Past Lessons:**

* Learned resilience through emotional growth
* Early sense of identity and self-driven learning

---

**Page 18: Present - Your Current Phase**
As of now, your palms show a period of alignment and self-discovery. You're likely in a phase of exploring purpose, considering career or relationship commitments, and refining your personal identity.

* Heart line is clear → Emotional clarity improving
* Head line strong → Decision-making is becoming more confident
* Fate line is split → Indicates reevaluation of direction

You are presently transitioning into a more empowered, self-aware version of yourself.

**Focus Now:**

* Cultivate confidence
* Make values-aligned choices
* Strengthen emotional boundaries

---

**Page 19: Future - What Lies Ahead**
The fork in your fate line near age 28 suggests an important life decision or redirection. This could relate to a career shift, entrepreneurial venture, or a meaningful relationship.

Your future is marked by a rising sun line, which indicates recognition and success in a creative or expressive field. The long Mercury line suggests long-term communication or coaching success.

**From Age 30-40:**

* Career success
* International travel or public visibility
* Deep emotional maturity and stable relationships

**From Age 40+:**

* Leadership role, mentoring others
* Spiritual growth and community involvement

---

**Page 20: Summary Dashboard & Final Words**

| Life Area   | Score | Alignment |
| ----------- | ----- | --------- |
| Personality | 92%   | High      |
| Love        | 87%   | Balanced  |
| Career      | 90%   | High      |
| Health      | 85%   | Stable    |
| Wealth      | 78%   | Improving |
| Social Life | 89%   | Strong    |
| Creativity  | 95%   | Excellent |
| Intuition   | 91%   | High      |

---

Dear ${userName},

Your palms tell a story that only you can fulfill. Let this guide serve as a compass and companion. Embrace your gifts, rise from challenges, and move forward with clarity.

You are not lost. You are unfolding.

With love and light,
*The PalmCode™ Team*
`;

  // Store the demo report in sessionStorage for display
  sessionStorage.setItem('comprehensivePalmReadingResult', demoContent);
  
  try {
    await generatePDF({
      title: "PalmCode™ Life Blueprint Report",
      subtitle: `Personalized Palm Analysis for ${userName}`,
      content: demoContent,
      fileName: "PalmCode_Life_Blueprint_Report.pdf"
    });
    
    return true;
  } catch (error) {
    console.error("Error generating PalmCode sample report:", error);
    // Try fallback
    return downloadTextAsPDF(demoContent, "PalmCode_Life_Blueprint_Report.txt");
  }
};
