
/**
 * GeminiAI - A class for interacting with the Gemini API for AI-powered palm reading
 */
class GeminiAI {
  private apiKey: string;
  private modelName: string;

  /**
   * Private constructor - use the static initialize method to create instances
   */
  private constructor(apiKey: string, modelName: string = "gemini-1.5-flash") {
    this.apiKey = apiKey;
    this.modelName = modelName;
    console.log('Initializing Gemini with model:', modelName);
  }

  /**
   * Creates a new instance of the GeminiAI class
   */
  static initialize(apiKey: string, modelName: string = "gemini-1.5-flash"): GeminiAI {
    return new GeminiAI(apiKey, modelName);
  }

  /**
   * Helper function to format an image into the format expected by the Gemini API
   */
  private formatImageForGemini(imageData: string): any {
    try {
      // Make sure the image data is correctly formatted
      // It should be a data URL starting with data:image/...
      if (!imageData.startsWith('data:image/')) {
        console.error('Invalid image format:', imageData.substring(0, 20) + '...');
        throw new Error('Invalid image format. Expected a data URL.');
      }

      // Format the image for the Gemini API
      const base64Image = imageData.split(',')[1];
      console.log('Image correctly formatted for Gemini API');
      
      return {
        inlineData: {
          data: base64Image,
          mimeType: imageData.split(';')[0].split(':')[1],
        },
      };
    } catch (error) {
      console.error('Error formatting image:', error);
      throw new Error('Failed to format image for analysis. Please try again with a different image.');
    }
  }

  /**
   * Analyze a palm image using the Gemini API - Basic Version
   */
  async analyzePalm(imageData: string): Promise<string> {
    try {
      console.log('Analyzing palm with Gemini API...');
      
      // Format the image for the Gemini API
      const formattedImage = this.formatImageForGemini(imageData);
      
      // Create the API request URL
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      console.log(`Using Gemini API endpoint: ${this.modelName}`);
      
      // Create the API request body with comprehensive palmistry prompt
      const body = {
        contents: [
          {
            parts: [
              {
                text: `You are an expert AI Palm Reader with deep knowledge of traditional Indian palmistry and modern behavioral psychology.

Analyze the palm image provided to generate an in-depth life reading report. Focus on these key elements:

# Key Lines to Analyze
- Heart Line: Emotional life and relationships
- Head Line: Intellect, thinking style, and mental approach
- Life Line: Vitality, energy, and major life changes
- Fate Line: Career path and life direction
- Sun Line: Success, fame, and recognition
- Mercury Line: Communication and business aptitude
- Marriage Line: Relationships and commitment patterns
- Health Line: Overall wellbeing and potential health concerns
- Girdle of Venus: Emotional sensitivity and intuition

# Palm Features to Examine
- Hand Shape (Earth, Air, Fire, Water)
- Finger Length and Proportions
- Thumb Flexibility and Position
- Mounts (Mercury, Venus, Moon, Mars, Jupiter, Saturn, Apollo)
- Special Markings (stars, crosses, triangles, islands)

# Content to Include in Your Report
## Personal Overview
- Core personality traits
- Key strengths and potential weaknesses
- Dominant energies and tendencies

## Career & Financial Path
- Natural professional aptitudes
- Financial prosperity indicators
- Best career directions
- Timeline for major career developments

## Relationships & Emotional Life
- Love patterns and compatibility
- Marriage timeline indicators (if present)
- Emotional tendencies in relationships
- Communication style in close relationships

## Health & Wellbeing
- Areas of potential vulnerability
- Stress indicators and coping mechanisms
- Lifestyle recommendations based on hand indicators

## Life Journey & Spiritual Path
- Major life transitions indicated
- Spiritual or philosophical tendencies
- Higher purpose indicators
- Personal growth opportunities

## Practical Guidance
- Traditional remedies (gemstones, mantras)
- Modern approaches to maximize potential
- Specific advice for questions like:
  - "Will I settle abroad?"
  - "When will I get married?"
  - "What is my true life purpose?"

FORMAT YOUR RESPONSE WITH PROPER MARKDOWN:
- Use # for main section headers
- Use ## for subsections
- Use - for bullet points
- Use **bold text** for emphasis on key points
- Organize content into clear, readable sections
- Include a brief summary at the beginning

CRITICALLY IMPORTANT: Ensure ALL text is clearly visible and readable with high contrast. Use standard HTML text with NO colored text - only use regular black text that will display clearly on any background. DO NOT use any special formatting that might cause text to be invisible or hard to read.

IMPORTANT: This is for a real person seeking genuine insights. Do NOT include phrases like "this is a demonstration" or "this is a sample reading" anywhere in your response. Provide a genuine, personalized analysis based solely on what you can see in the image.

Keep your tone professional, insightful, and compassionate throughout the reading.

VERY IMPORTANT: Make sure to format the text so it's clearly readable with proper markdown formatting with clear section headers and paragraphs. Only use markdown formatting that can be properly rendered in a standard React application.`
              },
              formattedImage
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
          topP: 0.95,
          topK: 40
        }
      };

      // Make the API request
      console.log('Sending request to Gemini API...');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      // Check if the response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from Gemini API:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      // Parse the response
      const result = await response.json();
      console.log('Received response from Gemini API');
      
      // Check if the response contains an error
      if (result.error) {
        console.error('Error from Gemini API:', result.error);
        throw new Error(result.error.message || 'Unknown error from Gemini API');
      }
      
      // Additional validation to ensure we don't get a demo or example response
      if (result.candidates && 
          result.candidates[0] && 
          result.candidates[0].content && 
          result.candidates[0].content.parts && 
          result.candidates[0].content.parts[0] && 
          result.candidates[0].content.parts[0].text) {
            
        const analysisText = result.candidates[0].content.parts[0].text;
        
        // Check if response contains demo-related words
        const demoKeywords = ['demo', 'example', 'sample', 'this is a demonstration'];
        const containsDemoKeywords = demoKeywords.some(keyword => 
          analysisText.toLowerCase().includes(keyword.toLowerCase()));
        
        if (containsDemoKeywords) {
          console.error('Gemini API returned a demo/sample response');
          throw new Error('The AI generated a demo response. Please try again for a real analysis.');
        }
        
        if (!analysisText || analysisText.trim() === '') {
          throw new Error('Empty response from Gemini API');
        }
        
        console.log('Successfully extracted palm reading from Gemini response');
        console.log('First 200 chars of response:', analysisText.substring(0, 200));
        
        // Detect if the response doesn't start with a proper heading and add one if needed
        let formattedText = analysisText;
        if (!formattedText.trim().startsWith('# ')) {
          formattedText = '# Palm Reading Analysis\n\n' + formattedText;
        }
        
        return formattedText;
      } else {
        console.error('Invalid response structure from Gemini API:', result);
        throw new Error('The response from Gemini API was not in the expected format');
      }
    } catch (error) {
      console.error('Error in analyzePalm:', error);
      throw error;
    }
  }

  /**
   * Analyze a palm image using the Gemini API to generate a comprehensive 20-page report
   */
  async analyzeComprehensivePalm(imageData: string, userName: string = "User"): Promise<string> {
    try {
      console.log('Analyzing palm with Gemini API to generate comprehensive 20-page report...');
      
      // Format the image for the Gemini API
      const formattedImage = this.formatImageForGemini(imageData);
      
      // Create the API request URL
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      console.log(`Using Gemini API endpoint: ${this.modelName}`);
      
      // Create the API request body with comprehensive 20-page palmistry prompt
      const body = {
        contents: [
          {
            parts: [
              {
                text: `Act as a world-class palmistry expert, life coach, and personality psychologist. You are creating a 20-page personalized "PalmCode™ Life Blueprint Report" for ${userName}. 

This is a premium, high-quality palm reading service that decodes the user's palm lines, mounts, shapes, and patterns using modern palmistry and psychology. Blend mystical insight with practical advice to create a truly personalized report that feels individualized and specific to this person.

# Report Structure
Create exactly 20 sections, each representing one page of the report. Label each section clearly as "PAGE 1", "PAGE 2", etc. Each page should cover a different aspect of the person's life and personality.

# Content to Include
Analyze the following aspects from the palm image:

PAGE 1: Executive Summary - Life Blueprint Overview
- Main characteristics revealed in the palm
- Summary of key personality traits
- Core life purpose indicators
- Visual description of hand type and structure

PAGE 2: Hand Shape & Elemental Analysis
- Hand shape classification (Earth, Air, Fire, Water)
- What this reveals about core personality
- Key strengths based on hand structure
- Proportion analysis and its meaning

PAGE 3: Life Line Analysis
- Detailed examination of life line characteristics
- Vitality and energy indicators
- Major life transitions revealed
- Health patterns and longevity indications

PAGE 4: Head Line Analysis
- Thinking style and intellectual approach
- Decision-making patterns
- Mental strengths and potential challenges
- Learning style and cognitive preferences

PAGE 5: Heart Line Insights
- Emotional nature and expression
- Love language and romantic tendencies
- Emotional intelligence indicators
- Relationship patterns and needs

PAGE 6: Fate Line & Career Path
- Career trajectory and professional aptitude
- Success timing and key periods
- Natural talents visible in the palm
- Professional challenges and how to overcome them

PAGE 7: Mount of Venus & Relationships
- Love compatibility profile
- Relationship strengths and potential challenges
- Romantic timeline indicators
- Partnership compatibility scores with different personality types

PAGE 8: Money & Financial Pattern Analysis
- Financial aptitude and money relationship
- Wealth potential indicators
- Resource management style
- Prosperity periods and opportunities

PAGE 9: Apollo Line & Creative Expression
- Creative and artistic abilities
- Fame and recognition potential
- Self-expression channels
- Optimal creative outlets based on palm structure

PAGE 10: Mercury Mount & Communication Style
- Communication strengths and patterns
- Business acumen and entrepreneurial potential
- Persuasive abilities
- Networking and social influence style

PAGE 11: Jupiter Mount & Leadership Profile
- Leadership style and strengths
- Authority presence and charisma indicators
- Ambition patterns and goal achievement
- Personal power expression

PAGE 12: Saturn Line & Life Responsibilities
- Core life responsibilities and duties
- Discipline and structure indicators
- Karmic patterns visible in the palm
- Life lessons and growth areas

PAGE 13: Timing Indicators & Life Phases
- Key age milestones revealed in the palm
- Timing indicators for major life events
- Life phases and their characteristics
- Current position in life journey

PAGE 14: Health & Wellness Blueprint
- Physical vitality indicators
- Stress response patterns
- Health strengths and potential vulnerabilities
- Wellness recommendations based on hand characteristics

PAGE 15: Marriage & Relationship Lines
- Relationship count and quality indicators
- Marriage timing indicators (if present)
- Attachment style and emotional bonding
- Partnership compatibility insights

PAGE 16: Children Lines & Legacy
- Family life indicators
- Nurturing tendencies and parenting style
- Legacy creation and impact potential
- Generational patterns and influences

PAGE 17: Travel Lines & Life Experience
- Geographic destiny indicators
- Travel propensities and patterns
- Cultural influences and international connections
- Adaptability and exploration tendencies

PAGE 18: Intuition & Psychic Abilities
- Intuitive strengths visible in the palm
- Psychic sensitivity indicators
- Spiritual connection patterns
- Intuition development recommendations

PAGE 19: Life Purpose & Soul Mission
- Core life purpose indicators
- Spiritual path and evolution
- Soul-level gifts and talents
- Higher calling and meaningful work

PAGE 20: Practical Guidance & Future Development
- Personalized affirmations based on palm characteristics
- Practical steps to maximize potential
- Challenges to be mindful of
- Future development roadmap

# Format Guidelines
- Create a visually descriptive, well-structured report
- Use headings, subheadings, and bullet points for clarity
- Include "compatibility scores" and "potential ratings" as text-based charts where appropriate
- Bold important insights and key takeaways
- Use markdown formatting for clean structure

# Style Guidelines
- Write in a warm, inspiring, and motivational tone
- Balance mystical insight with practical, actionable advice
- Be specific and personalized, avoiding generic statements
- Focus on empowerment and growth opportunities
- Address the reader directly in second person
- Use a professional yet conversational tone

The final report should read like a premium product that delivers genuine insight, self-understanding, and growth direction - something the recipient will want to save, revisit, and share with others.

CRITICALLY IMPORTANT: Ensure ALL text is clearly visible and readable with high contrast. Use standard HTML text with NO colored text - only use regular black text that will display clearly on any background.

VERY IMPORTANT: Make sure to format the text so it's clearly readable with proper markdown formatting with clear section headers and paragraphs. Label each page clearly. The report should be detailed and comprehensive.`
              },
              formattedImage
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 8000,
          topP: 0.95,
          topK: 40
        }
      };

      // Make the API request
      console.log('Sending request to Gemini API for comprehensive report...');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      // Check if the response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from Gemini API:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      // Parse the response
      const result = await response.json();
      console.log('Received comprehensive report response from Gemini API');
      
      // Check if the response contains an error
      if (result.error) {
        console.error('Error from Gemini API:', result.error);
        throw new Error(result.error.message || 'Unknown error from Gemini API');
      }
      
      // Validate and process the response
      if (result.candidates && 
          result.candidates[0] && 
          result.candidates[0].content && 
          result.candidates[0].content.parts && 
          result.candidates[0].content.parts[0] && 
          result.candidates[0].content.parts[0].text) {
            
        const analysisText = result.candidates[0].content.parts[0].text;
        
        if (!analysisText || analysisText.trim() === '') {
          throw new Error('Empty response from Gemini API');
        }
        
        console.log('Successfully extracted comprehensive palm reading from Gemini response');
        console.log('First 200 chars of response:', analysisText.substring(0, 200));
        
        // Ensure the report has a proper title
        let formattedText = analysisText;
        if (!formattedText.trim().startsWith('# ') && !formattedText.trim().includes('PAGE 1')) {
          formattedText = '# PalmCode™ Life Blueprint Report\n\n' + formattedText;
        }
        
        return formattedText;
      } else {
        console.error('Invalid response structure from Gemini API:', result);
        throw new Error('The response from Gemini API was not in the expected format');
      }
    } catch (error) {
      console.error('Error in analyzeComprehensivePalm:', error);
      throw error;
    }
  }

  /**
   * Analyze compatibility between two people based on palm readings
   */
  async analyzeCompatibility(person1Image: string, person2Image: string, person1Name: string, person2Name: string): Promise<string> {
    try {
      console.log('Analyzing compatibility with Gemini API...');
      
      // Format the images for the Gemini API
      const formattedImage1 = this.formatImageForGemini(person1Image);
      const formattedImage2 = this.formatImageForGemini(person2Image);
      
      // Create the API request URL
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      
      // Create the API request body for compatibility analysis
      const body = {
        contents: [
          {
            parts: [
              {
                text: `You are a professional palm reader with extensive knowledge of palmistry traditions. 
You'll analyze two palm images and provide a comprehensive compatibility analysis.

Create a detailed compatibility report with these sections:
1. Introduction - A brief welcome and overview of palmistry compatibility analysis
2. Individual Analysis - Brief summary of each person's dominant traits
3. Compatibility Score - Overall percentage compatibility with explanation
4. Emotional Compatibility - Analysis based on heart lines and related features
5. Communication Style - Analysis based on head lines and finger shapes
6. Life Goals Alignment - Analysis based on fate lines and palm shapes
7. Relationship Strengths - Positive aspects of the relationship
8. Relationship Challenges - Potential areas of friction
9. Guidance & Recommendations - Practical advice for harmonious relationship

Format the report with clear section headings using markdown (##, ###).
Be specific about what you observe in both images, making direct comparisons.

Use this formatting for your report:

# **💑 Partner Compatibility Report**  
**Generated by AI-Powered Palm Reading & Guna Milan Analysis**  

📅 **Date of Analysis:** [Current Date]
👤 **Partner 1:** ${person1Name}  
👩 **Partner 2:** ${person2Name}  
❤️ **Overall Compatibility Score:** **[Score]% – [Brief Label]**

> **Analysis Summary:**  
> [Brief summary of overall compatibility - 2-3 sentences]

---

## **🌟 Guna Milan (Vedic Compatibility Score)**  
According to traditional Hindu matchmaking, there are **8 key factors (Ashta Koot) with a total of 36 Gunas (points)**. A score of **18+ is considered acceptable**, while **24+ is excellent compatibility**.  

| **Guna Category** | **Matched Points (Out of Max)** | **Remarks** |
|------------------|-----------------------------|------------|
| **Varna (Spiritual Compatibility)** | [Score]/1 | [Brief remark] |
| **Vashya (Dominance & Mutual Influence)** | [Score]/2 | [Brief remark] |
| **Tara (Health & Well-being in Marriage)** | [Score]/3 | [Brief remark] |
| **Yoni (Physical & Sexual Compatibility)** | [Score]/4 | [Brief remark] |
| **Maitri (Mental Compatibility & Bonding)** | [Score]/5 | [Brief remark] |
| **Gana (Temperament Compatibility)** | [Score]/6 | [Brief remark] |
| **Bhakoot (Wealth & Career Growth Together)** | [Score]/7 | [Brief remark] |
| **Nadi (Health & Genetic Compatibility)** | [Score]/8 | [Brief remark] |

**✅ Total Guna Score: [Total]/36 → [Compatibility Label]**  

[... Rest of the report sections following the formatting shown in the example provided ...]

TEXT COLOR REQUIREMENT: Ensure that all text in your response will be clearly visible against both light and dark backgrounds. Do not use any background colors or colored text in your response. Use standard black text for optimal readability.

IMPORTANT: DO NOT include any text like "demo," "sample," or "example" in your response.
This should be a genuine, personalized compatibility analysis based on the actual uploaded images.`
              },
              formattedImage1,
              {
                text: `This is the palm of ${person2Name}:`
              },
              formattedImage2
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 4000,
        }
      };

      // Make the API request
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      // Check if the response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from Gemini API:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      // Parse the response
      const result = await response.json();
      
      // Check if the response contains an error
      if (result.error) {
        console.error('Error from Gemini API:', result.error);
        throw new Error(result.error.message || 'Unknown error from Gemini API');
      }
      
      // Validate the response structure
      if (!result.candidates || 
          !result.candidates[0] || 
          !result.candidates[0].content || 
          !result.candidates[0].content.parts || 
          !result.candidates[0].content.parts[0] || 
          !result.candidates[0].content.parts[0].text) {
        console.error('Invalid response structure from Gemini API:', result);
        throw new Error('The response from Gemini API was not in the expected format');
      }
      
      // Get the text content from the response
      const analysisText = result.candidates[0].content.parts[0].text;
      
      if (!analysisText || analysisText.trim() === '') {
        throw new Error('Empty response from Gemini API');
      }
      
      console.log('Successfully extracted compatibility analysis from Gemini response');
      return analysisText;
    } catch (error) {
      console.error('Error in analyzeCompatibility:', error);
      throw error;
    }
  }
}

export default GeminiAI;
