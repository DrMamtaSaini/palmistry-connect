
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
        throw new Error('Invalid image format. Expected a data URL.');
      }

      // Format the image for the Gemini API
      const base64Image = imageData.split(',')[1];
      
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
   * Analyze a palm image using the Gemini API
   */
  async analyzePalm(imageData: string): Promise<string> {
    try {
      console.log('Analyzing palm with Gemini API...');
      
      // Format the image for the Gemini API
      const formattedImage = this.formatImageForGemini(imageData);
      
      // Create the API request URL
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      
      // Create the API request body with comprehensive palmistry prompt
      const body = {
        contents: [
          {
            parts: [
              {
                text: `You are a master palm reader with deep knowledge in traditional palmistry, psychology, and spiritual guidance.
                
Based on the provided palm image, generate a comprehensive life report covering all key aspects of the person's life journey. 

Your analysis should include the following detailed sections, with clear ## markdown headers for each main section:

## Introduction
- Welcome message
- Disclaimer that this is for guidance, not prediction
- How palm reading reflects personality and potential

## Personality Overview
- Summary of temperament, emotional style, decision-making, and general energy

## Hand Shape Type Analysis
- Identify if this is an Earth, Air, Fire, or Water hand, with meaning and life approach

## Major Lines Analysis
### Life Line
- Strength, health, stability
- Major life phases
- Key challenges and strengths indicated

### Head Line
- Intelligence, thinking style, focus, mental aptitude
- Decision-making approach
- Stress indicators if present

### Heart Line
- Love style, emotional depth, relationship approach
- Trust and emotional range
- Romantic tendencies

### Fate Line (if visible)
- Career path, life purpose
- Major life changes indicated
- Periods of stability and change

## Mount Analysis
- Analysis of prominent mounts: Venus (love), Jupiter (ambition), Saturn (wisdom), Apollo (creativity), Mercury (communication), Moon (imagination), Mars (energy)
- What these reveal about the person's natural talents and challenges

## Career & Wealth Potential
- Suitable career paths
- Income potential (Low/Medium/High)
- Best periods for financial growth
- Natural strengths in work environments

## Relationships & Love Life
- Marriage or partnership indicators
- Relationship style and needs
- Best partner compatibility

## Life Path & Key Turning Points
- Major life phases
- Ages of significant changes or decisions
- Growth opportunities

## Spiritual & Creative Inclinations
- Intuitive abilities
- Creative talents
- Spiritual connection

## Actionable Guidance
- 3-5 specific recommendations based on the palm reading
- Areas for personal development
- Strengths to leverage

Format this comprehensive report professionally with clear section headings (using ## for main sections and ### for subsections) and maintain an insightful, supportive tone. Provide specific details based on what you can observe in the palm image, with special attention to unusual markings or distinctive features.

DO NOT mention that you're an AI - stay in character as an experienced palm reader with decades of expertise in palmistry traditions from around the world.`
              },
              formattedImage
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
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
      
      console.log('Successfully extracted palm reading from Gemini response');
      return analysisText;
    } catch (error) {
      console.error('Error in analyzePalm:', error);
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
                text: `You are a professional palm reader with extensive knowledge of palmistry and relationship compatibility analysis.
                I'll show you two palm images. The first palm belongs to ${person1Name} and the second palm belongs to ${person2Name}.
                
                Analyze these palm images and provide a detailed compatibility report that includes:
                1. Overall compatibility score as a percentage
                2. Emotional compatibility based on the heart lines
                3. Intellectual compatibility based on the head lines
                4. Communication style compatibility
                5. Life path alignment based on fate lines
                6. Strengths of the relationship
                7. Potential challenges and how to overcome them
                8. Compatibility in terms of career and finance
                9. Long-term relationship prospects
                
                Format this as a detailed report with clear sections and insights. Make it comprehensive and professional.
                DO NOT mention that you're an AI - stay in character as an experienced palm reader and compatibility expert. 
                Provide specific details based on what you can observe in the images.`
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
          temperature: 0.7,
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
