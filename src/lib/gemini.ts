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
   * Generate a comprehensive 50-page palmistry and astrology report
   */
  async generateComprehensive50PageReport(imageData: string, userProfile: any): Promise<string> {
    try {
      console.log('Generating comprehensive 50-page palmistry and astrology report...');
      
      // Format the image for the Gemini API
      const formattedImage = this.formatImageForGemini(imageData);
      
      // Create the API request URL
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      
      // Create comprehensive 50-page report prompt
      const comprehensivePrompt = `You are a master palmist and astrologer with 30+ years of experience. Generate a comprehensive, 50-page in-depth life report based on the provided palm data and astrological data.

USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

ANALYSIS REQUIREMENTS:

# PART 1: FOUNDATIONAL ANALYSIS (Pages 1-10)
PAGE 1: Executive Summary & Life Blueprint Overview
PAGE 2: Hand Shape & Elemental Analysis (Earth/Air/Fire/Water classification)
PAGE 3: Finger Analysis (Length, flexibility, proportions, nail analysis)
PAGE 4: Thumb Analysis (Will power, logic, energy levels)
PAGE 5: Palm Texture & Skin Analysis (Energy levels, sensitivity)
PAGE 6: Major Lines Overview (Heart, Head, Life, Fate lines)
PAGE 7: Mount Analysis (All 7 classical mounts)
PAGE 8: Special Markings & Symbols (Stars, crosses, triangles, squares)
PAGE 9: Hand Dominance & Bilateral Comparison
PAGE 10: Overall Hand Harmony & Balance Assessment

# PART 2: ASTROLOGICAL FOUNDATION (Pages 11-15)
PAGE 11: Birth Chart Overview & Planetary Positions
PAGE 12: Ascendant & House Analysis
PAGE 13: Major Planetary Aspects & Configurations
PAGE 14: Nodal Analysis (Rahu/Ketu or North/South Node)
PAGE 15: Current Dasha/Planetary Period Analysis

# PART 3: PAST INFLUENCES & KARMIC PATTERNS (Pages 16-20)
PAGE 16: Childhood & Early Life Indicators
PAGE 17: Family Dynamics & Inherited Patterns
PAGE 18: Past Life Karmic Influences
PAGE 19: Educational Journey & Early Career
PAGE 20: Formative Relationships & Their Impact

# PART 4: PRESENT CIRCUMSTANCES & CURRENT PHASE (Pages 21-25)
PAGE 21: Current Life Phase Analysis
PAGE 22: Present Career & Professional Status
PAGE 23: Current Relationship Dynamics
PAGE 24: Health & Vitality Assessment
PAGE 25: Financial Status & Resource Management

# PART 5: PERSONALITY & PSYCHOLOGICAL PROFILE (Pages 26-30)
PAGE 26: Core Personality Traits & Temperament
PAGE 27: Emotional Intelligence & Processing Style
PAGE 28: Communication Style & Social Interactions
PAGE 29: Decision-Making Patterns & Mental Approach
PAGE 30: Hidden Talents & Unexpressed Potentials

# PART 6: RELATIONSHIPS & FAMILY (Pages 31-35)
PAGE 31: Love Life & Romantic Patterns
PAGE 32: Marriage Compatibility & Partnership Dynamics
PAGE 33: Family Relationships & Dynamics
PAGE 34: Children - Number, Nature & Timing
PAGE 35: Social Circle & Friendship Patterns

# PART 7: CAREER & FINANCIAL DESTINY (Pages 36-40)
PAGE 36: Career Path Analysis & Professional Aptitudes
PAGE 37: Business vs. Employment Suitability
PAGE 38: Financial Patterns & Wealth Accumulation
PAGE 39: Success Timing & Peak Achievement Periods
PAGE 40: Professional Challenges & Growth Opportunities

# PART 8: HEALTH & WELLBEING (Pages 41-45)
PAGE 41: Physical Constitution & Health Patterns
PAGE 42: Mental Health & Stress Management
PAGE 43: Lifestyle Recommendations & Wellness Strategies
PAGE 44: Health Timing & Preventive Measures
PAGE 45: Longevity & Vitality Indicators

# PART 9: FUTURE PREDICTIONS & OPPORTUNITIES (Pages 46-50)
PAGE 46: Next 5 Years - Major Transitions & Opportunities
PAGE 47: Long-term Life Trajectory (10-20 years)
PAGE 48: Spiritual Evolution & Growth Path
PAGE 49: Timing for Major Life Events
PAGE 50: Final Guidance, Remedies & Success Strategies

SPECIFIC REQUIREMENTS:
- Each page should contain 300-500 words of detailed analysis
- Include specific predictions where possible (career fields, earning potential, number of children, partner characteristics)
- Provide actionable strategies and timing guidance
- Use illustrative examples and analogies
- Maintain professional yet compassionate tone
- Include both palmistry and astrological insights for each topic
- Format with clear headers and readable structure

CRITICAL FORMATTING:
- Use clear page headers: "PAGE X: [Title]"
- Use markdown formatting for structure
- Ensure all text is black and clearly readable
- Include specific predictions and practical guidance
- Avoid generic statements - be specific and personalized

Generate the complete 50-page report now:`;

      const body = {
        contents: [
          {
            parts: [
              {
                text: comprehensivePrompt
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
      console.log('Sending request for comprehensive 50-page report...');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from Gemini API:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Received comprehensive 50-page report response');
      
      if (result.error) {
        console.error('Error from Gemini API:', result.error);
        throw new Error(result.error.message || 'Unknown error from Gemini API');
      }
      
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
        
        console.log('Successfully generated comprehensive 50-page report');
        return analysisText;
      } else {
        console.error('Invalid response structure from Gemini API:', result);
        throw new Error('The response from Gemini API was not in the expected format');
      }
    } catch (error) {
      console.error('Error generating comprehensive 50-page report:', error);
      throw error;
    }
  }

  /**
   * Analyze a palm image using the Gemini API to generate a comprehensive 20-page report
   * with detailed astrology insights for past, present, and future
   */
  async analyzeComprehensivePalm(imageData: string, userName: string = "User"): Promise<string> {
    try {
      console.log('Analyzing palm with Gemini API to generate comprehensive 20-page report with astrology...');
      
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
                text: `Act as a world-class palmistry expert, astrologer, life coach, and personality psychologist. You are creating a 20-page personalized "PalmCode™ Life Blueprint Report" for ${userName}. 

This is a premium, high-quality palm reading service that decodes the user's palm lines, mounts, shapes, and patterns using modern palmistry, advanced astrology, and psychology. Blend mystical insight with practical advice to create a truly personalized report that feels individualized and specific to this person.

# Report Structure
Create exactly 20 sections, each representing one page of the report. Label each section clearly as "PAGE 1", "PAGE 2", etc. Each page should cover a different aspect of the person's life and personality in considerable detail (minimum 500 words per page).

# Content to Include
Analyze the following aspects from the palm image:

PAGE 1: Executive Summary - Life Blueprint Overview
- Main characteristics revealed in the palm
- Summary of key personality traits
- Core life purpose indicators
- Visual description of hand type and structure
- Overview of past, present, and future trajectory

PAGE 2: Hand Shape & Elemental Analysis
- Hand shape classification (Earth, Air, Fire, Water)
- What this reveals about core personality
- Key strengths based on hand structure
- Proportion analysis and its meaning
- Detailed interpretation of finger size, shape, and alignment

PAGE 3: Astrological Past - Formative Years & Origins
- How planetary positions at birth influenced early development
- Key karmic patterns from past lives visible in the palm
- Early life challenges and gifts as shown in minor lines
- Childhood indicators and formative experiences
- Family dynamics and inherited patterns

PAGE 4: Life Line Analysis
- Detailed examination of life line characteristics
- Vitality and energy indicators
- Major life transitions revealed
- Health patterns and longevity indications
- Specific timing of important life events

PAGE 5: Head Line Analysis
- Thinking style and intellectual approach
- Decision-making patterns
- Mental strengths and potential challenges
- Learning style and cognitive preferences
- Critical thinking abilities and rational tendencies

PAGE 6: Heart Line Insights
- Emotional nature and expression
- Love language and romantic tendencies
- Emotional intelligence indicators
- Relationship patterns and needs
- Capacity for empathy and emotional depth

PAGE 7: Astrological Present - Current Life Phase
- Current planetary influences and their manifestation
- Active dasha/antardasha periods and their effects
- Current life lessons and growth opportunities
- Present challenges and how they align with palm indicators
- Timing for current phase transitions

PAGE 8: Fate Line & Career Path
- Career trajectory and professional aptitude
- Success timing and key periods
- Natural talents visible in the palm
- Professional challenges and how to overcome them
- Career advancement strategies based on palm structure

PAGE 9: Mount of Venus & Relationships
- Love compatibility profile
- Relationship strengths and potential challenges
- Romantic timeline indicators
- Partnership compatibility scores with different personality types
- Deeper relationship patterns and attachment styles

PAGE 10: Money & Financial Pattern Analysis
- Financial aptitude and money relationship
- Wealth potential indicators
- Resource management style
- Prosperity periods and opportunities
- Specific timing for financial growth and challenges

PAGE 11: Astrological Future - Coming Life Phases
- Future planetary transits and their likely effects
- Upcoming life opportunities and challenges
- Critical decision points in the next 5-10 years
- Long-term destiny indicators
- Prediction of major life transitions

PAGE 12: Apollo Line & Creative Expression
- Creative and artistic abilities
- Fame and recognition potential
- Self-expression channels
- Optimal creative outlets based on palm structure
- Unique gifts and how to manifest them

PAGE 13: Mercury Mount & Communication Style
- Communication strengths and patterns
- Business acumen and entrepreneurial potential
- Persuasive abilities
- Networking and social influence style
- Optimal communication strategies

PAGE 14: Jupiter Mount & Leadership Profile
- Leadership style and strengths
- Authority presence and charisma indicators
- Ambition patterns and goal achievement
- Personal power expression
- Growth and expansion opportunities

PAGE 15: Saturn Line & Life Responsibilities
- Core life responsibilities and duties
- Discipline and structure indicators
- Karmic patterns visible in the palm
- Life lessons and growth areas
- Managing obligations and commitments

PAGE 16: Health & Wellness Blueprint
- Physical vitality indicators
- Stress response patterns
- Health strengths and potential vulnerabilities
- Wellness recommendations based on hand characteristics
- Preventative health strategies and timing

PAGE 17: Marriage & Relationship Lines
- Relationship count and quality indicators
- Marriage timing indicators (if present)
- Attachment style and emotional bonding
- Partnership compatibility insights
- Long-term relationship potential and challenges

PAGE 18: Children Lines & Legacy
- Family life indicators
- Nurturing tendencies and parenting style
- Legacy creation and impact potential
- Generational patterns and influences
- Creative and personal projects as extensions of self

PAGE 19: Travel Lines & Life Experience
- Geographic destiny indicators
- Travel propensities and patterns
- Cultural influences and international connections
- Adaptability and exploration tendencies
- Major relocations and their timing

PAGE 20: Intuition, Psychic Abilities & Spiritual Path
- Intuitive strengths visible in the palm
- Psychic sensitivity indicators
- Spiritual connection patterns
- Intuition development recommendations
- Higher purpose and soul mission

# Format Guidelines
- Create a visually descriptive, well-structured report with BLACK TEXT on white background
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

CRITICALLY IMPORTANT: Ensure ALL text is clearly visible and readable with high contrast. Use standard HTML text with NO colored text - only use regular black text that will display clearly on any background. DO NOT use any colors that might blend with the background.

VERY IMPORTANT: Make sure to format the text so it's clearly readable with proper markdown formatting with clear section headers and paragraphs. Label each page clearly. The report should be detailed, comprehensive, and at least 500 words per page for a total of 10,000+ words.`
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
