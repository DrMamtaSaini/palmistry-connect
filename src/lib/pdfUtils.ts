
import { toast } from "@/hooks/use-toast";
import { ensureTextContrast } from "@/lib/utils";

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
    .astro-timeline {
      border-left: 3px solid #006400;
      padding-left: 20px;
      margin: 20px 0;
    }
    .past-astro {
      background-color: #f0f8ff;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 15px;
    }
    .present-astro {
      background-color: #f0fff0;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 15px;
    }
    .future-astro {
      background-color: #fff0f0;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 15px;
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
    } else if (pageTitle.includes("Past") || pageTitle.includes("Present") || pageTitle.includes("Future")) {
      // Past, Present, Future section with special styling
      const timeframeClass = pageTitle.includes("Past") ? "past-astro" : 
                            pageTitle.includes("Present") ? "present-astro" : 
                            "future-astro";
      
      processedContent += `
        <div class="astro-timeline">
          <div class="${timeframeClass}">
            <h3>${pageTitle}</h3>
            ${processMixedContent(pageContent)}
          </div>
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

In the following pages, you'll discover your emotional patterns, ideal career paths, love compatibility, timing of success, health tendencies, and much more. We have also added separate sections for Past-Present-Future analysis based on key features of your palm lines, mounts, and their correlation with Vedic astrology principles.

Your PalmCode™ report reveals not just what your palm says, but integrates this with astronomical influences that shape your destiny. The lines on your palm are a reflection of cosmic forces that have been acting upon you since birth and continue to guide your journey.

With clarity and purpose,
*PalmCode™ Team*

---

**Page 3: Palm Basics – Your Blueprint Map**

* **Hand Type:** Air Hand (Long fingers, square palm)

  * Traits: Intelligent, curious, analytical, needs mental stimulation
* **Dominant Hand:**
  * Reveals your current and future path
  * Non-dominant hand shows inherited traits and potential

* **Key Mounts:**
  * **Venus Mount (Base of Thumb):** Moderately developed - Balanced emotional nature
  * **Jupiter Mount (Below Index Finger):** Prominent - Strong leadership qualities
  * **Saturn Mount (Below Middle Finger):** Well-defined - Responsible and practical
  * **Apollo Mount (Below Ring Finger):** Active - Creative and expressive
  * **Mercury Mount (Below Little Finger):** Pronounced - Excellent communication skills
  * **Luna Mount (Opposite to Thumb):** Subtle - Grounded imagination

* **Major Lines:**

  * **Heart Line:** Deep and curved → Emotionally open, romantic, passionate
  * **Head Line:** Long and slightly curved → Balanced logical and creative thinking
  * **Life Line:** Deep and sweeping → Strong vitality and enthusiasm for life
  * **Fate Line:** Present with fork near middle → Career changes at key points
  * **Sun Line:** Clear and straight → Recognition and success in chosen field
  * **Marriage Line:** Multiple, with one dominant → Several relationships, one significant
  * **Health Line:** Visible without breaks → General good health with attention needed

---

**Page 4: Personality Profile – Core Character Traits**
Your palm reveals a multifaceted personality with distinct strengths. You are primarily a communicator and thinker with a gift for connecting with others. Your Air hand type shows an active, analytical mind that constantly processes information and generates new ideas.

**Key Personality Indicators:**
* **Thumb Flexibility:** High - Adaptable and open-minded approach to life
* **Finger Length:** Long fingers - Detail-oriented and thoughtful
* **Apollo Finger (Ring):** Slightly longer than average - Enhanced creativity and artistic eye
* **Mercury Finger (Little):** Well-developed - Strong communication and persuasive abilities
* **First Phalange of Thumb:** Strong - Determined and willful when passionate

**Core Character Traits:**
* **Intellectually Curious:** Your head line's slight curve shows you balance analysis with intuition
* **Emotionally Intelligent:** The quality of your heart line reveals deep empathy
* **Adaptable:** The spacing between your fingers shows flexibility in approach
* **Honest:** Straight Jupiter finger indicates integrity in dealings
* **Loyal:** Deep, consistent heart line shows commitment to loved ones
* **Sensitive:** Fine skin texture indicates high sensitivity to environment
* **Slightly Impatient:** A few stress lines near the Mercury mount show occasional restlessness

**Interaction Style:**
* You connect best through meaningful conversation and idea exchange
* You value intellectual honesty over social niceties
* You need mental stimulation in relationships and work environments
* You avoid shallow social interactions and superficial connections

**Potential Growth Areas:** 
* Learn to trust your intuition without overthinking
* Practice patience with those who process information differently
* Balance your mental activity with physical grounding practices

---

**Page 5: Emotional Intelligence & Love Life – Heart Matters**
**Heart Line Analysis:** Your heart line is deep, curved, and rises toward the Jupiter mount (index finger), indicating a romantic nature with high emotional standards. The depth suggests emotional intensity and authenticity, while the upward curve toward Jupiter shows idealism in love.

**Emotional Patterns:**
* **Emotional Depth:** The clear definition of your heart line indicates profound feelings
* **Emotional Expression:** The sweeping curve shows open expression of feelings
* **Emotional Resilience:** Few islands or breaks suggest strong emotional recovery
* **Emotional Needs:** The line's position shows need for both independence and connection

**Love and Relationship Tendencies:**
* You approach relationships with sincerity and commitment
* You value emotional depth, intellectual connection, and authentic communication
* You're attracted to partners who challenge your thinking while respecting your values
* You're loving, loyal, and expressive—but can retreat if emotionally overwhelmed
* You need space to process feelings before discussing emotional matters

**Venus Mount Insights:**
The moderate development of your Venus mount (base of thumb) indicates:
* Balanced approach to physical and emotional intimacy
* Capacity for deep connection without becoming dependent
* Appreciation for beauty and harmony in relationships

**Marriage Line Details:**
* Multiple fine lines with one dominant line suggests several meaningful relationships
* The dominant line's depth indicates a significant long-term partnership
* A slight fork at the end indicates potential for growth and evolution in this partnership

**Ideal Match Traits:**
* Emotionally mature and self-aware
* Intellectually stimulating and curious
* Communicative about feelings and thoughts
* Creative or spiritually inclined
* Respectful of personal space and independence

**Love Challenges to Overcome:**
* Tendency to analyze feelings rather than simply experience them
* Occasional withdrawal when emotionally overwhelmed
* Need to learn the difference between healthy standards and perfectionism
* Remembering that not all partners communicate love the same way you do

---

**Page 6: Career Potential & Purpose – Your Professional Path**
**Fate & Head Line Combined Analysis:**
Your fate line begins clearly but shows a significant fork around the middle of your palm, indicating a purposeful career shift at some point in your 30s. This, combined with your analytical yet creative head line, suggests a professional path that will eventually align both your logical abilities and creative instincts.

**Natural Talents (Based on Finger Analysis):**
* **Strong Jupiter (Index) Finger:** Leadership, organization, direction-setting
* **Balanced Saturn (Middle) Finger:** Precision, responsibility, methodical approach
* **Well-Developed Apollo (Ring) Finger:** Creativity, performance, aesthetic sense
* **Prominent Mercury (Little) Finger:** Communication, quick thinking, adaptability

**Career Strength Indicators:**
* Your Apollo and head lines' connection shows creative intelligence
* The sun line's presence indicates recognition for your unique contributions
* The mercury line's clarity suggests business acumen and communicative abilities
* Strong, clearly etched lines overall show concentrated energy and focus

**Best Career Paths Based on Palm Analysis:**
* **Creative Fields:** Design, Writing, Visual Arts, Performance
* **Communication-Focused:** Psychology, Counseling, Coaching, Public Relations
* **Analytical Creativity:** Research, Problem-Solving, Innovation Development
* **People Leadership:** Education, Team Management, Community Organization

**Work Environment Needs:**
* Intellectual stimulation and continuous learning
* Creative freedom and opportunity for self-expression
* Ethical alignment with personal values
* Recognition for unique contributions
* Balance of structure and flexibility

**Career Timeline (Based on Fate Line):**
* **Early Career (20s):** Exploration and skill development
* **Late 20s to Early 30s:** Increasing clarity about true calling
* **Mid-30s:** Significant pivot or refinement of direction
* **40s Onward:** Greater alignment with purpose and increased success

**Purpose Indicators:**
Your palm suggests your highest purpose involves integrating communication, creativity, and empathy to inspire or guide others. The connection between your head and heart lines indicates you'll find most fulfillment when your work engages both your intellectual and emotional intelligences.

---

**Page 7: Success Timing & Life Events – Key Transitions**
Your palm reveals important timing markers that indicate periods of change, growth, and accomplishment. These points are determined by analyzing where lines intersect, fork, or show significant changes in character.

**Key Life Transition Points:**

* **Age 21-23:** First major decision phase
  * Indicated by: Initial branch in fate line
  * Nature: Educational or early career choice
  * Guidance: Trust your intellectual curiosity during this period

* **Age 28-29:** Career shift or breakthrough
  * Indicated by: Prominent fork in fate line
  * Nature: Change in direction or significant advancement
  * Guidance: Follow opportunities that align with your creativity

* **Age 35-37:** Personal reinvention
  * Indicated by: Intersection of influence line with fate line
  * Nature: Deeper alignment with authentic purpose
  * Guidance: This period may bring challenges before breakthrough

* **Age 42-45:** Recognition and establishment
  * Indicated by: Strengthening of sun line
  * Nature: Public acknowledgment of your contributions
  * Guidance: Remain true to your unique approach

* **Age 52-55:** Wisdom integration
  * Indicated by: Secondary influence line joining fate line
  * Nature: Teaching, mentoring, or sharing accumulated knowledge
  * Guidance: Focus on leaving a legacy

**Success Line Analysis:**
Your sun line (line of Apollo) becomes more pronounced after age 35, indicating that your most significant recognition and success is likely to come in the second half of your life. This delayed but substantial success pattern is common in visionaries whose work requires maturity and life experience to fully develop.

**Challenge Periods:**
Small breaks in your fate line around ages 31-33 suggest a period of uncertainty or reevaluation before your true path becomes clear. The star formation near your heart line around age 40 indicates an emotional breakthrough that will contribute to your success.

**Life Event Indicators:**
* A triangular formation at the beginning of your life line suggests a significant early life influence that shapes your path
* The island in your head line in the first third indicates a period of mental uncertainty followed by greater clarity
* The connection between your fate and heart lines suggests your emotional life and career will influence each other significantly

**Key Advice for Transitions:**
Embrace these transition phases as natural evolutionary points. Your palm shows you gain strength through adaptation and grow most significantly during periods of change.

---

**Page 8: Mental Strengths & Challenges – Your Thought Patterns**
The head line is one of the most revealing elements of your palm, showing how you think, process information, and make decisions. Your head line is moderately long with a slight downward curve toward the moon mount, indicating a balance between logical analysis and creative intuition.

**Your Cognitive Style:**
* **Analytical Foundation:** The clear beginning portion shows strong rational abilities
* **Creative Integration:** The gentle curve indicates growing comfort with intuitive thinking
* **Depth of Concentration:** The line's depth shows powerful focus when engaged
* **Thought Flexibility:** The slight branches indicate ability to consider alternatives

**Mental Strengths Based on Head Line:**
* Strong analytical and critical thinking abilities
* Excellent detail recognition and pattern identification
* Good balance between objective and subjective reasoning
* Ability to communicate complex ideas effectively
* Memory for information that has emotional significance

**Cognitive Challenges:**
* Tendency toward overthinking important decisions
* Mental fatigue when dealing with too many variables
* Occasional difficulty quieting the mind for relaxation
* Impatience with vague communications or instructions

**Best Learning & Problem-Solving Approaches:**
* You absorb information best through reading and discussion
* You solve problems by examining components then seeking patterns
* You benefit from alternating focused work with reflection periods
* You make best decisions when balancing analysis with intuition

**Mental Energy Management:**
Your head line's intersection with minor stress lines suggests:
* Need for mental variety to maintain engagement
* Benefit from scheduled downtime for mental recovery
* Importance of sleep for cognitive performance
* Value of mindfulness practices for mental clarity

**Memory Patterns:**
The quality of your head line indicates:
* Strong conceptual memory for ideas and systems
* Good recall for information with emotional connections
* Potential to improve memory through visualization techniques
* Benefit from organizing information in written form

**Recommended Mental Development Practices:**
* Regular journaling to integrate logical and intuitive insights
* Meditation focused on open awareness rather than concentration
* Learning new skills that combine analytical and creative thinking
* Engaging in structured debates or discussions about complex topics

---

**Page 9: Physical Health & Vitality – Wellness Indicators**
Your palm contains important indicators of your physical health tendencies, strengths, and areas needing attention. While palmistry cannot diagnose medical conditions, it can highlight constitutional tendencies and guide wellness practices.

**Life Line Analysis (Vitality & Energy):**
Your life line is deep and forms a wide arc around the Venus mount, indicating:
* Strong basic constitution and recuperative ability
* Good energy levels when properly rested and nourished
* Capacity for physical endurance with proper conditioning
* Natural resilience after illness or stress

**Health Line Indicators:**
Your health line (Mercury line) is present but shows some variation in strength, suggesting:
* Generally good health with periods of fluctuation
* Need for preventive self-care rather than crisis management
* Benefit from regular health monitoring and maintenance
* Potential sensitivity in digestive and respiratory systems

**Stress Response Patterns:**
Small stress lines intersecting your head line indicate:
* Tendency for mental stress to affect physical wellbeing
* Physical symptoms may manifest during periods of high pressure
* Need for active stress management practices
* Benefit from mind-body approaches to health

**Body System Strengths & Sensitivities:**
Based on specific mount developments and minor line formations:
* **Cardiovascular System:** Good basic strength (strong life line)
* **Respiratory System:** Some sensitivity (minor stress lines near Saturn mount)
* **Digestive System:** Requires attention (variations in health line)
* **Nervous System:** Highly responsive (fine lines on Mercury mount)
* **Immune Function:** Strong with proper rest (deep life line)

**Optimal Health Practices Based on Palm Indicators:**
* **Movement Type:** Combination of structured exercise and flowing movement
* **Nutrition Needs:** Regular meals with emphasis on anti-inflammatory foods
* **Sleep Patterns:** Need for 7-8 hours with consistent schedule
* **Stress Management:** Mental decompression activities daily
* **Energy Regulation:** Alternating periods of activity and recovery

**Longevity Indicators:**
Your deep, clear life line without serious breaks or fragmentation suggests:
* Potential for long life with proper self-care
* Periods of high vitality throughout life stages
* Good recovery capacity after health challenges
* Importance of preventive rather than reactive approach

**Health Focus Recommendations:**
* Balance mental activity with physical movement
* Maintain consistent sleep patterns and quality
* Practice conscious stress management techniques
* Listen to early warning signals from your body
* Prioritize digestive and respiratory health

---

**Page 10: Relationship Compatibility – Your Ideal Match**
Your palm reveals specific patterns that indicate your relationship needs, strengths as a partner, and the types of connections that will bring greatest fulfillment. Understanding these patterns helps you recognize compatible partners and develop healthier relationships.

**Core Relationship Requirements:**
Based on your heart, head, and fate lines' positions and quality:
* Intellectual stimulation and mental connection
* Emotional authenticity and depth
* Space for individuality within togetherness
* Shared values and ethical alignment
* Balance of stability and growth

**Your Relationship Strengths:**
* Loyalty and commitment when truly connected
* Thoughtful communication and conflict resolution
* Intellectual and emotional support
* Respect for partner's independence
* Willingness to grow and evolve together

**Relationship Challenges to Overcome:**
* Tendency to analyze rather than feel in emotional moments
* Occasional emotional withdrawal when overwhelmed
* Setting appropriate boundaries consistently
* Balancing personal pursuits with relationship needs
* Managing expectations of self and others

**Compatibility Matrix by Hand Types:**
Your Air hand type has natural affinity with certain hand types:

* **Best Match - Water Hands:**
  * **Compatibility Score:** 90%
  * **Strengths:** Emotional depth balances your intellectual focus
  * **Challenges:** May need to balance their feeling with your thinking

* **Strong Match - Air Hands:**
  * **Compatibility Score:** 85%
  * **Strengths:** Intellectual alignment and similar communication style
  * **Challenges:** Potential for overthinking and limited emotional expression

* **Good Match - Fire Hands:**
  * **Compatibility Score:** 80%
  * **Strengths:** Their spontaneity balances your analysis
  * **Challenges:** Different processing speeds and decision approaches

* **Challenging Match - Earth Hands:**
  * **Compatibility Score:** 70%
  * **Strengths:** Their practicality grounds your ideas
  * **Challenges:** Different values around change and security

**Ideal Partner Line Indicators:**
For deepest compatibility, look for partners whose palms show:
* Heart line that curves upward (emotional expressiveness)
* Head line with some flexibility (balanced thinking)
* Strong, clear life line (emotional stability and vitality)
* Mount of Venus that's moderately developed (balanced affection)
* Few negative stress lines (emotional resilience)

**Relationship Timing:**
Your marriage/relationship lines suggest:
* Significant relationships likely at ages: 24-26, 32-34, and 40-42
* Most harmonious long-term connection likely in your 30s
* Relationship clarity increases significantly after age 35

**Love Growth Recommendations:**
* Practice expressing emotions directly rather than intellectualizing
* Develop comfort with emotional vulnerability
* Recognize the difference between independence and avoidance
* Communicate your need for mental connection
* Value emotional intelligence equally with intellectual compatibility

---

**Page 11: Intuition & Spiritual Path – Inner Guidance**
Your palm reveals significant spiritual and intuitive potential that forms an important dimension of your life purpose. The fine lines, mount developments, and special markings indicate your natural intuitive style and optimal spiritual practices.

**Intuitive Strengths:**
* **Triangle near Mercury Mount:** Natural psychic sensitivity and perception
* **Moon Mount Development:** Active dream life and subconscious connection
* **Mystic Cross:** Spiritual interest and potential for meaningful insights
* **Head Line Curve:** Balance of logical and intuitive processing

**Your Intuitive Style:**
* **Primary Intuitive Mode:** Claircognizance (clear knowing)
* **Secondary Intuitive Mode:** Clairsentience (clear feeling)
* **Intuitive Triggers:** Mental contemplation, symbolic recognition, aesthetic experiences
* **Intuitive Blockers:** Overthinking, environmental stress, physical depletion

**Spiritual Connection Indicators:**
* **Fate Line-Heart Line Connection:** Integration of purpose and emotional wisdom
* **Spiritual Bracelet Quality:** Three clear lines indicating holistic development
* **Jupiter Mount Development:** Philosophical nature and search for meaning
* **Ring of Solomon:** (Fine line under Jupiter finger) Wisdom and spiritual insight

**Optimal Spiritual Practices:**
Based on the specific patterns in your palm, these approaches will resonate most strongly:
* **Meditation Style:** Mindfulness and open awareness rather than strict focus
* **Contemplative Practices:** Journaling, symbolic analysis, metaphysical study
* **Physical Practices:** Walking meditation, flowing movement, nature immersion
* **Creative Spiritual Expression:** Writing, music, visual symbolism

**Spiritual Growth Timeline:**
* **Early Life (Before 30):** Questions and intellectual spiritual exploration
* **Middle Period (30-45):** Deepening experience and practical application
* **Mature Phase (45+):** Integration and increasing intuitive wisdom

**Intuitive Development Recommendations:**
* Regular quiet time for intuitive listening without agenda
* Dream journaling to strengthen subconscious connection
* Study of symbolic systems (tarot, I Ching, astrology) as intuitive tools
* Time in nature to reset intuitive sensitivity
* Artistic expression as a channel for intuitive insights

**Spiritual Challenges to Navigate:**
* Balancing intellectual understanding with direct experience
* Trusting intuitive impressions without overanalysis
* Integrating spiritual insights into practical life
* Finding community that respects your individual path
* Maintaining consistent practice through life transitions

---

**Page 12: Creativity & Self-Expression – Your Artistic Nature**
Your palm shows significant creative potential with multiple indicators of artistic ability and innovative thinking. The most notable is your prominent sun line (Apollo line), which reveals natural creative talent and potential for recognition through creative expression.

**Creative Strength Indicators:**
* **Sun Line Quality:** Clear and without breaks - Strong, consistent creative energy
* **Apollo Finger Length:** Slightly longer than average - Natural artistic sensibility
* **Apollo Mount Development:** Well-defined - Expressive capacity and aesthetic appreciation
* **Head-Heart Line Relationship:** Balanced spacing - Integration of thought and feeling in creation

**Your Creative Type:**
Based on the specific patterns in your palm, your creative nature is best described as:
* **Primary Creative Mode:** Conceptual Creator (ideas, systems, patterns)
* **Secondary Creative Mode:** Aesthetic Refiner (beauty, harmony, refinement)
* **Creative Approach:** Analytical exploration followed by intuitive development
* **Creative Drivers:** Meaningful communication, pattern recognition, problem-solving

**Best Creative Mediums:**
Your palm indicates natural affinity for:
* **Visual Arts:** Design, photography, visual communication
* **Verbal Arts:** Writing, speaking, teaching
* **Conceptual Arts:** Systems design, theoretical frameworks
* **Performance:** Presentational speaking, coaching, facilitation

**Creative Process Insights:**
* Your creative cycle typically follows a pattern of:
  * Information gathering and analysis
  * Incubation period (often subconscious)
  * Insight or clarity moment
  * Structured development and refinement
* You work best with alternating periods of engagement and reflection
* Your creativity is enhanced by intellectual stimulation and conversation
* You benefit from capturing initial ideas immediately before analysis

**Blocks to Creative Flow:**
Your palm indicates potential creative blocks related to:
* Perfectionism (small stress lines near Apollo mount)
* Overthinking (intensity of head line)
* External judgment concerns (relationship between Apollo and Saturn)
* Energy management (fluctuations in vitality lines)

**Creative Development Recommendations:**
* Establish regular creative practice without judgment
* Create "concept capture" system for ideas before evaluation
* Seek constructive feedback from trusted sources
* Balance analytical and intuitive approaches
* Connect with creative community for inspiration and accountability

**Expression Timeline:**
* Your creative expression is likely to mature significantly around age 35-40
* Most recognized work will likely emerge in your 40s and 50s
* Teaching or mentoring others becomes important after 50

---

**Page 13: Social Life & Influence – Your Connection Style**
Your palm reveals distinct patterns in how you connect with others, build community, and exercise social influence. The development of specific mounts, finger formations, and relationship lines provides insight into your social nature and interpersonal dynamics.

**Social Style Indicators:**
* **Thumb Set:** Balanced position showing social independence with connection capacity
* **Jupiter Mount:** Well-developed indicating natural leadership and social confidence
* **Mercury Mount:** Prominent showing communication skill and social adaptability
* **Venus Mount:** Moderately developed indicating selective but warm social approach
* **Apollo Mount:** Active showing appreciation for quality social engagement

**Your Social Connection Pattern:**
Based on these indicators, your social style is best described as:
* **Primary Social Mode:** Selective Connector (quality over quantity)
* **Secondary Social Mode:** Thoughtful Leader (influence through ideas)
* **Social Strengths:** Meaningful conversation, loyalty, thoughtful listening
* **Social Challenges:** Impatience with superficiality, need for depth

**Friendship Patterns:**
* You tend to form fewer but deeper friendships
* You value intellectual connection in social bonds
* You maintain long-term relationships with like-minded people
* You prefer small group settings to large gatherings
* You enjoy activities with purpose or learning components

**Leadership & Influence Style:**
The relationship between your head line, Apollo line, and Jupiter mount reveals:
* Natural ability to influence through ideas and communication
* Leadership by example rather than authority
* Preference for collaborative rather than hierarchical structures
* Ability to bridge different perspectives and viewpoints
* Influential capacity that grows stronger with age and experience

**Social Growth Opportunities:**
* Developing comfort with broader network connections
* Practicing brevity in communication when appropriate
* Building skills for navigating larger group dynamics
* Balancing depth with accessibility in social contexts
* Recognizing when to lead and when to support

**Relationship Line Details:**
* Multiple influence lines crossing your fate line indicate several significant individuals who impact your life path
* Your friendship line (horizontal line under little finger) shows selective but loyal friendship approach
* The quality of your heart line indicates warmth that becomes more apparent as relationships deepen

**Social Timing Patterns:**
* Most significant friendships form during transition periods (20s, mid-30s, early 50s)
* Social influence increases substantially after age 40
* Teaching, mentoring, or community leadership becomes important in your 50s

---

**Page 14: Financial Tendencies & Prosperity – Wealth Patterns**
Your palm reveals important patterns related to financial attitudes, money management tendencies, and your relationship with material prosperity. The development of specific mounts, finger formations, and fortune lines provides insight into your financial journey.

**Financial Pattern Indicators:**
* **Mount of Jupiter:** Well-defined indicating ambition and confidence with resources
* **Mount of Saturn:** Moderate showing practicality without excessive caution
* **Mount of Mercury:** Prominent revealing business acumen and financial intelligence
* **Mount of Luna:** Partially developed suggesting some financial imagination
* **Thumb Development:** Strong showing good financial willpower and decision-making

**Your Financial Mindset:**
Based on these indicators, your relationship with money is best described as:
* **Primary Financial Mode:** Strategic Planner (thoughtful allocation)
* **Secondary Financial Mode:** Value Investor (meaning over materialism)
* **Financial Strengths:** Analysis, pattern recognition, moderate risk assessment
* **Financial Challenges:** Occasional overthinking, balancing present vs. future

**Money Management Tendencies:**
* You approach finances with analytical intelligence
* You value security but not at the expense of quality experiences
* You make financial decisions based on long-term considerations
* You tend to research thoroughly before significant investments
* You balance saving with strategic spending on growth opportunities

**Prosperity Timeline:**
* **Early Adult Phase (20s):** Building skills and financial foundation
* **Mid-Life Phase (30s-40s):** Period of significant income growth
* **Mature Phase (50+):** Integration of multiple income streams
* **Notable financial turning points:** Ages 33-35, 42-45, and 57-60

**Wealth Line Indicators:**
* Your fate line's strength suggests career stability with growth potential
* The sun line's prominence indicates recognition that can lead to financial rewards
* The line of Mercury (money line) shows financial intelligence that develops over time
* A positive triangle formation near your fate line indicates unexpected financial opportunity around age 38-42

**Financial Growth Recommendations:**
* Trust your analytical abilities but set decision deadlines
* Develop passive income streams that leverage your intellectual assets
* Invest in your own skill development as a primary wealth strategy
* Balance security needs with calculated risks for growth
* Consider partnerships that complement your financial approach

**Prosperity Blocks to Address:**
* Occasional tendency to delay decisions seeking perfect information
* Potential undervaluing of your own services or contributions
* Need to balance long-term planning with present enjoyment
* Importance of communicating financial goals in partnerships

---

**Page 15: Life Lessons & Karmic Patterns – Soul Purpose**
Your palm reveals deeper patterns related to your soul's journey, lessons to master in this lifetime, and karmic themes that shape your experiences. These insights come from analyzing special markings, unusual formations, and the overall message of your palm's blueprint.

**Soul Journey Indicators:**
* **Fate Line Origin:** From Life Line - Self-created destiny with strong connection to identity
* **Life Line Loop:** Early formation suggesting intensive early development
* **Heart-Head Line Relationship:** Nearly parallel with slight convergence - Balancing thinking and feeling is a core lesson
* **Karmic Lines:** Fine vertical lines on Saturn mount indicating responsibility themes
* **Spiritual Loop:** Formation on Jupiter mount revealing spiritual leadership potential

**Core Life Lessons:**
Based on these indicators, your most important lessons involve:
* Finding balance between giving and receiving (tendency to over-give)
* Integrating intellectual understanding with emotional wisdom
* Expressing authentic voice despite social pressure
* Developing comfort with visibility and recognition
* Trusting intuitive guidance alongside analytical thinking

**Karmic Theme Analysis:**
Your palm suggests these soul themes carry forward from past experiences:
* **Primary Theme:** Worthiness - Learning to value your contributions
* **Secondary Theme:** Expression - Finding courage to share unique perspective
* **Supporting Theme:** Connection - Building bridges between different viewpoints
* **Challenge Theme:** Perfectionism - Releasing impossible standards

**Spiritual Contract Indicators:**
Special markings and formations suggest your soul agreements include:
* Teaching or mentoring others in communication or creative expression
* Bridging different knowledge systems or perspectives
* Healing through truthful but compassionate communication
* Creating systems or frameworks that support others' growth
* Demonstrating integration of intellectual and intuitive wisdom

**Soul Gift Markers:**
Unique features in your palm indicating special capacities:
* **Mystic Cross:** Located on Jupiter mount - Spiritual leadership
* **Triangle Formation:** Near Apollo line - Creative problem-solving
* **Star Pattern:** At head-heart intersection - Intuitive intelligence
* **Unusual Loop:** On Saturn mount - Responsibility carried with grace

**Integration Recommendations:**
* Journal regularly about challenges to identify recurring patterns
* Notice when perfectionism blocks progress and practice "good enough"
* Develop comfort with visibility and recognition for your contributions
* Balance analytical thinking with intuitive guidance
* Remember that vulnerability is strength, not weakness

---

**Page 16: Life Purpose Summary – Your Soul's Mission**
From all the elements analyzed in your palm, a clear life purpose emerges. This purpose integrates your strengths, challenges, lessons, and soul patterns into a cohesive mission that represents your highest contribution.

**Purpose Statement:**
Your soul's mission is to inspire transformation through authentic communication, creative expression, and the integration of intellectual and intuitive wisdom. You are here to build bridges between different perspectives, create systems that support growth, and demonstrate the power of balanced living.

**Core Mission Elements:**
* **Primary Purpose:** To teach, guide, and inspire others through your unique voice
* **Secondary Purpose:** To create frameworks, systems, or methods that facilitate understanding
* **Supporting Purpose:** To demonstrate integration of heart and mind in daily living
* **Challenge Purpose:** To overcome perfectionism and fear of judgment

**Purpose Fulfillment Indicators:**
Your palm shows these signs of alignment with purpose:
* Strong sun line indicates recognition for authentic expression
* Connection between head and heart lines shows integration of intellect and emotion
* Fate line's clear path with intentional branches shows purposeful evolution
* Special markings (triangle, star) indicate unique contribution potential

**When You're Living Your Purpose:**
* You feel energized rather than depleted by your work
* Your communication resonates deeply with others
* You lose track of time when engaged in creative expression
* You naturally bridge different viewpoints and perspectives
* You experience synchronicities and "flow state" regularly

**Purpose Development Timeline:**
* **Foundation Phase (Before 35):** Skill development and personal growth
* **Emergence Phase (35-45):** Growing clarity and initial impact
* **Fulfillment Phase (45+):** Full expression and expanding influence

**Destiny vs. Free Will:**
Your palm shows a balanced fate line indicating:
* Core purpose is consistent throughout life
* Execution and expression involve significant free choice
* Major life direction points offer decision opportunities
* Self-awareness accelerates purpose alignment

**Purpose Keywords:**
* **Inspire:** Through authentic voice and integrated living
* **Bridge:** Between different perspectives and knowledge systems
* **Create:** Systems, frameworks, and expressions that facilitate growth
* **Transform:** Help others evolve through compassionate truth
* **Integrate:** Demonstrate harmony of intellectual and intuitive wisdom

---

**Page 17: Past - What Your Palms Reveal About Your History**
Your palm contains important markers of your past experiences, early influences, and developmental patterns. By examining specific formations in the early sections of your major lines, we can decode significant aspects of your history.

**Early Life Indicators:**
* **Life Line Formation:** The beginning shows a protective loop - indicating a nurturing yet possibly sheltered early environment
* **Head Line Origin:** Strong, clear beginning - suggesting early intellectual stimulation and support for cognitive development
* **Heart Line Early Section:** Slightly fainter at start - pointing to a gradual development of emotional expression
* **Fate Line Beginning:** Starts from life line rather than wrist - indicating a path linked to family but requiring self-direction

**Developmental Phases Revealed:**
* **Early Childhood (0-7):** 
  * Protective and structured environment (life line loop)
  * Strong foundation for intellectual development (head line quality)
  * Possible sensitivity that required adaptation (fine lines near Luna mount)

* **Middle Childhood (7-14):**
  * Period of significant curiosity and learning (strong head line)
  * Growing independence but within secure boundaries (life line shape)
  * Beginning of unique perspective development (early Apollo line formation)

* **Adolescence (14-21):**
  * Important emotional learning experiences (heart line development)
  * Intellectual growth and identity formation (head line strength)
  * Initial direction-setting decisions (early fate line formation)

**Past Challenges Overcome:**
* A small island in your head line around the age position of 16 suggests a period of mental uncertainty or difficult decision-making that you successfully navigated
* A stress line crossing your life line in early position points to an early challenge that strengthened your resilience
* The relationship between early heart and head lines suggests learning to balance emotional and intellectual aspects

**Formative Influences:**
* The prominence of your Jupiter mount indicates strong early authority figures or mentors
* Your Apollo line development suggests early recognition of creative or expressive abilities
* The quality of your Mercury mount points to early emphasis on communication skills

**Key Past Lessons:**
* Learning to trust your unique perspective and voice
* Developing emotional resilience through early challenges
* Building an intellectual foundation that supports later purpose
* Finding balance between security and independence
* Recognizing your natural strengths and abilities

**Past Life Connection (Metaphysical Interpretation):**
If viewing from a spiritual perspective, your palm shows signs of:
* Past experiences as a teacher, guide, or messenger (Mercury prominence)
* Previous development of creative or leadership abilities (Apollo and Jupiter mounts)
* Karmic themes around communication and truth-speaking (unique line formations)

---

**Page 18: Present - Your Current Life Phase**
Your palm reveals specific indicators about your current life phase, challenges, opportunities, and optimal focus areas. By examining the middle sections of your major lines and their current quality, we can decode your present situation.

**Current Phase Indicators:**
* **Life Line Current Section:** Deep and clear - indicating strong vitality and life force
* **Head Line Middle Section:** Well-defined with slight forking - showing mental clarity with multiple interests
* **Heart Line Present Area:** Strong and curved - revealing emotional openness and availability
* **Fate Line Current Position:** Distinct with positive influence line - suggesting supportive connections for your path

**Present Life Themes:**
* **Primary Theme:** Integration - Bringing together different aspects of yourself
* **Secondary Theme:** Clarification - Refining purpose and direction
* **Supporting Theme:** Connection - Developing meaningful relationships
* **Challenge Theme:** Balance - Managing multiple responsibilities and interests

**Current Strengths to Leverage:**
* Mental clarity and analytical ability (head line quality)
* Communication skills and expression (Mercury mount)
* Creative problem-solving (Apollo line influence)
* Relationship building and emotional intelligence (heart line)
* Purpose alignment (fate line quality)

**Present Challenges to Navigate:**
* Potential for overextension (multiple branches from head line)
* Need for work-life integration (relationship between life and fate lines)
* Managing expectations of self and others (Saturn influence)
* Balancing analysis with action (head-Saturn relationship)

**Optimal Focus Areas Now:**
* Cultivating confidence in your unique approach and perspective
* Making decisions aligned with core values rather than external expectations
* Strengthening boundaries while maintaining meaningful connections
* Developing routines that support mental and physical wellbeing
* Pursuing growth opportunities that combine multiple interests

**Astrological Influences (Present Period):**
Your palm shows markers correlating with current astrological influences:
* Saturn's influence encouraging foundation-building and structure
* Jupiter's energy supporting expansion in aligned directions
* Mercury's position enhancing communication and connection
* Venus patterns promoting harmony in relationships through authenticity

**Current Phase in Purpose Timeline:**
You are currently in a period of growing alignment with your purpose, characterized by:
* Increasing clarity about contribution and direction
* Refinement of skills and approaches
* Recognition from others for your unique qualities
* Important relationship connections supporting growth
* Integration of past experiences into coherent wisdom

---

**Page 19: Future - What Lies Ahead on Your Path**
Your palm contains important indicators about your future trajectory, upcoming opportunities, challenges, and optimal directions. By examining the end sections of your major lines and special markings affecting future time periods, we can decode potential future patterns.

**Future Timeline Indicators:**
* **Life Line Extended Section:** Strong and clear - indicating continued vitality into later years
* **Head Line Final Section:** Deepening with slight downward curve - showing growing intuitive wisdom
* **Heart Line Future Area:** Strengthening with upward branch - revealing emotional fulfillment and expansion
* **Fate Line Advanced Position:** Prominent with supporting lines - suggesting increased impact and recognition

**Key Future Transition Points:**

* **Age 35-37:** 
  * **Indicated by:** Important fork in fate line
  * **Nature:** Significant direction clarification or opportunity
  * **Guidance:** Trust emerging clarity about your unique contribution

* **Age 42-45:** 
  * **Indicated by:** Sun line strengthening and influence lines joining fate line
  * **Nature:** Recognition, increased visibility, and supportive partnerships
  * **Guidance:** Embrace visibility rather than hiding your light

* **Age 52-55:** 
  * **Indicated by:** Secondary fate line merging with primary line
  * **Nature:** Integration of different aspects of purpose into cohesive contribution
  * **Guidance:** Share accumulated wisdom through teaching or mentoring

* **Age 60-65:** 
  * **Indicated by:** Positive markings on Apollo and Jupiter mounts
  * **Nature:** Legacy phase with recognition and influence
  * **Guidance:** Focus on meaningful contribution rather than achievement

**Future Growth Areas:**
* Spiritual and intuitive development (head line's gentle curve toward Luna)
* Teaching, mentoring, and wisdom-sharing (fate-Jupiter connection)
* Creative expression and recognition (strong Apollo line)
* Deepening relationships and emotional fulfillment (heart line quality)
* Integration of practical and philosophical approaches (Saturn-Jupiter balance)

**Potential Challenges to Prepare For:**
* Maintaining energy boundaries as demands increase (life line variations)
* Balancing visibility with personal needs (Apollo-Saturn relationship)
* Managing expectations as influence grows (Jupiter-Saturn balance)
* Preserving authentic voice amid recognition (Apollo-Mercury connection)

**Optimal Future Directions:**
Based on your palm's indications, these paths offer greatest fulfillment:
* Roles combining creative expression with intellectual structure
* Work involving teaching, mentoring, or guiding others
* Projects that bridge different fields, perspectives, or approaches
* Opportunities for writing, speaking, or knowledge-sharing
* Positions allowing autonomy with meaningful collaboration

**Future Travel & Geographic Influences:**
Lines and formations near your Luna mount suggest:
* Significant travel or relocation between ages 38-42
* Positive connection with water elements or coastal locations
* International influence or recognition after age 45
* Meaningful journey with spiritual significance around age 50

**Legacy Indications:**
Your palm shows you will likely be remembered for:
* Innovative frameworks or approaches that help others
* Bridging different perspectives or knowledge systems
* Authentic communication that inspires positive change
* Integration of intellectual clarity with emotional wisdom

---

**Page 20: Summary Dashboard & Final Words**
This final page provides a comprehensive overview of your palmistry analysis, highlighting key strengths, opportunities, and recommendations across all major life areas.

**Life Area Performance Dashboard:**

| Life Area        | Score | Alignment | Key Strength               | Growth Opportunity         |
| ---------------- | ----- | --------- | -------------------------- | -------------------------- |
| Personality      | 92%   | High      | Analytical intelligence    | Trusting intuition         |
| Emotional Life   | 87%   | Balanced  | Depth and authenticity     | Consistent expression      |
| Relationships    | 85%   | Strong    | Loyalty and communication  | Vulnerability without fear |
| Career & Purpose | 90%   | High      | Direction with flexibility | Embracing visibility       |
| Health & Vitality| 85%   | Stable    | Resilience and recovery    | Preventive maintenance     |
| Financial Life   | 78%   | Improving | Strategic planning         | Valuing contributions      |
| Creativity       | 95%   | Excellent | Innovative thinking        | Consistent practice        |
| Spiritual Growth | 91%   | High      | Depth of understanding     | Practical integration      |
| Social Impact    | 89%   | Strong    | Meaningful influence       | Broader reach              |

**Life Phase Summary:**
* **Past:** Built strong foundation through intellectual development and emotional learning
* **Present:** Integrating different aspects of self and clarifying authentic direction
* **Future:** Increasing recognition, impact, and legacy creation through teaching and creative expression

**Core Theme Integration:**
Throughout all aspects of your analysis, these themes consistently appear:
* Integration of intellectual clarity with emotional wisdom
* Balance of structure and creative freedom
* Authentic communication that bridges perspectives
* Purpose expressed through teaching, guiding, and creating frameworks for others
* Growth through embracing visibility while maintaining integrity

**Palm Reading Timeline Highlights:**
* **Ages 35-37:** Direction clarification and new opportunities
* **Ages 42-45:** Recognition and increased impact
* **Ages 52-55:** Wisdom integration and teaching focus
* **Ages 60-65:** Legacy phase and meaningful contribution

**Final Guidance:**
Dear ${userName},

Your palms reveal a life of meaningful impact through the integration of your analytical mind, creative spirit, and authentic voice. The journey mapped in your hands shows early development of intellectual strength, middle-life integration of purpose elements, and later recognition for your unique contribution.

Your most significant life work involves bridging different perspectives, creating frameworks that help others navigate complexity, and modeling the integration of mind and heart. While your path hasn't always been straight, each curve and line on your palm shows how experiences have shaped you toward increasing clarity and impact.

Your hands tell a story that only you can fulfill. Let this guide serve as a compass and companion as you continue your journey. Embrace your gifts, rise from challenges with newfound wisdom, and move forward with the clarity that comes from self-understanding.

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

