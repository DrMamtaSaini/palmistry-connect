
export const generatePDF = async (content: any) => {
  // This is a simulated PDF generation
  console.log('Generating PDF with content:', content);
  
  try {
    // Create a more substantial PDF content
    const pdfContent = `
Palm Reading Analysis Report
---------------------------
${JSON.stringify(content, null, 2)}
---------------------------
This is a sample PDF report generated for demonstration purposes.
    `;
    
    return createAndDownloadPDF(pdfContent, 'palm-reading-report.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const generateDemoReport = async () => {
  console.log('Generating demo PDF report');
  
  try {
    // Create a more substantial demo PDF content
    const demoContent = `
COMPREHENSIVE PALM READING ANALYSIS
==================================

70-PAGE DETAILED REPORT
-----------------------

SECTION 1: PERSONALITY TRAITS
- Strong Leadership Qualities
- Creative Thinking
- Emotional Intelligence

SECTION 2: LIFE PATH INSIGHTS
- Career Trajectory
- Relationship Patterns
- Financial Outlook

SECTION 3: COMPREHENSIVE LIFE ANALYSIS
- Detailed Career Trajectory
- Deep Relationship Analysis
- Financial Prosperity Indicators

SECTION 4: HEALTH & WELLBEING
- Overall Vitality Signs
- Stress Management Recommendations
- Exercise Recommendations

SECTION 5: FUTURE TIMELINE PREDICTIONS
- Next 6 Months Forecast
- 1-2 Years Outlook
- 3-5 Years Major Milestones
- 5+ Years Long-term Prosperity

This is a sample 70-page demo report for preview purposes.
    `;
    
    return createAndDownloadPDF(demoContent, 'demo-palm-reading-report.pdf');
  } catch (error) {
    console.error('Error generating demo PDF:', error);
    throw error;
  }
};

// Add a helper function to create and download any PDF
export const createAndDownloadPDF = (content: string, filename: string) => {
  try {
    console.log('Creating and downloading PDF...');
    
    // Create blob with content
    const blob = new Blob([content], { type: 'application/pdf' });
    
    // Create downloadable link
    const url = URL.createObjectURL(blob);
    
    // Create direct download link instead of using iframe
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    
    // Trigger download
    console.log('Triggering download...');
    a.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('Download cleanup complete');
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Error creating and downloading PDF:', error);
    throw error;
  }
};
