export const generatePDF = async (content: any) => {
  console.log('Generating PDF with content:', content);
  
  try {
    // Create an HTML string with nicely formatted content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Palm Reading Analysis Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 40px;
      color: #333;
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
    .section {
      margin-bottom: 20px;
    }
    .insight {
      padding: 8px;
      margin: 5px 0;
      background-color: #f9f9f9;
      border-left: 3px solid #00FF7F;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <h1>Palm Reading Analysis Report</h1>
  
  ${content.sections.map(section => `
    <div class="section">
      <h2>${section.name}</h2>
      ${section.insights.map(insight => `
        <div class="insight">${insight}</div>
      `).join('')}
    </div>
  `).join('')}

  <div class="footer">
    This is a sample PDF report generated for demonstration purposes.
    Copyright © ${new Date().getFullYear()} PalmReading.ai
  </div>
</body>
</html>
    `;
    
    // Use the printJS functionality to print HTML as PDF
    return printHTMLAsPDF(htmlContent, 'palm-reading-report.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const generateDemoReport = async () => {
  console.log('Generating demo PDF report');
  
  try {
    // Create a nicely formatted HTML demo report
    const htmlDemoContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Demo Palm Reading Analysis Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 40px;
      color: #333;
    }
    h1 {
      color: #006400;
      text-align: center;
      margin-bottom: 20px;
      font-size: 24px;
    }
    h2 {
      color: #008000;
      text-align: center;
      margin-bottom: 30px;
      font-size: 18px;
    }
    h3 {
      color: #008000;
      margin-top: 20px;
      margin-bottom: 10px;
      font-size: 16px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-content {
      margin-left: 20px;
    }
    .preview-note {
      background-color: #f7f7f7;
      border: 1px dashed #ccc;
      padding: 15px;
      margin: 30px 0;
      text-align: center;
      font-style: italic;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <h1>COMPREHENSIVE PALM READING ANALYSIS</h1>
  <h2>70-PAGE DETAILED REPORT</h2>

  <div class="section">
    <h3>SECTION 1: PERSONALITY TRAITS</h3>
    <div class="section-content">
      <p>- Strong Leadership Qualities</p>
      <p>- Creative Thinking</p>
      <p>- Emotional Intelligence</p>
    </div>
  </div>

  <div class="section">
    <h3>SECTION 2: LIFE PATH INSIGHTS</h3>
    <div class="section-content">
      <p>- Career Trajectory</p>
      <p>- Relationship Patterns</p>
      <p>- Financial Outlook</p>
    </div>
  </div>

  <div class="section">
    <h3>SECTION 3: COMPREHENSIVE LIFE ANALYSIS</h3>
    <div class="section-content">
      <p>- Detailed Career Trajectory</p>
      <p>- Deep Relationship Analysis</p>
      <p>- Financial Prosperity Indicators</p>
    </div>
  </div>

  <div class="section">
    <h3>SECTION 4: HEALTH & WELLBEING</h3>
    <div class="section-content">
      <p>- Overall Vitality Signs</p>
      <p>- Stress Management Recommendations</p>
      <p>- Exercise Recommendations</p>
    </div>
  </div>

  <div class="section">
    <h3>SECTION 5: FUTURE TIMELINE PREDICTIONS</h3>
    <div class="section-content">
      <p>- Next 6 Months Forecast</p>
      <p>- 1-2 Years Outlook</p>
      <p>- 3-5 Years Major Milestones</p>
      <p>- 5+ Years Long-term Prosperity</p>
    </div>
  </div>

  <div class="preview-note">
    This is a sample of our 70-page comprehensive palm reading report.<br>
    Purchase the full analysis to access all insights and personalized recommendations.
  </div>

  <div class="footer">
    Copyright © ${new Date().getFullYear()} PalmReading.ai - All Rights Reserved
  </div>
</body>
</html>
    `;
    
    return printHTMLAsPDF(htmlDemoContent, 'demo-palm-reading-report.pdf');
  } catch (error) {
    console.error('Error generating demo PDF:', error);
    throw error;
  }
};

// Function to print HTML as PDF using browser's print functionality
export const printHTMLAsPDF = (htmlContent: string, filename: string) => {
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

// Import toast functionality
import { toast } from "@/hooks/use-toast";

// Keep the downloadTextAsPDF and createAndDownloadPDF functions for reference but they're not used
// ... keep existing code (downloadTextAsPDF and createAndDownloadPDF functions)
