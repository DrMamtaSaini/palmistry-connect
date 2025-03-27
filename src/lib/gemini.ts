
// This is a utility file for Gemini AI integration
// The actual API key should be provided by the user and stored securely

interface GeminiConfig {
  apiKey: string;
  modelName: string;
}

export class GeminiAI {
  private apiKey: string;
  private modelName: string;
  private baseUrl: string = "https://generativelanguage.googleapis.com/v1beta";

  constructor(config: GeminiConfig) {
    this.apiKey = config.apiKey;
    this.modelName = config.modelName || "gemini-1.5-flash";
  }

  async analyzePalm(imageBase64: string): Promise<string> {
    try {
      const endpoint = `${this.baseUrl}/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: "Analyze this palm image and provide insights about the person's character, career potential, relationships, and future prospects based on palmistry principles. Focus on the major lines (heart, head, life, fate) and any special markings."
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64.replace(/^data:image\/\w+;base64,/, "")
                }
              }
            ]
          }
        ],
        generation_config: {
          temperature: 0.4,
          top_p: 0.95,
          top_k: 40,
          max_output_tokens: 1024,
        }
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error analyzing palm with Gemini:", error);
      throw error;
    }
  }

  async checkCompatibility(palm1Base64: string, palm2Base64: string, nameA?: string, nameB?: string, birthdateA?: string, birthdateB?: string): Promise<string> {
    try {
      const endpoint = `${this.baseUrl}/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      
      let prompt = "Analyze these two palm images and provide detailed compatibility insights between these people. Include the following sections:\n";
      prompt += "1. Overall Compatibility (with percentage)\n";
      prompt += "2. Guna Milan Analysis (Vedic Compatibility Score out of 36)\n";
      prompt += "   - Include analysis of all eight Guna Milan factors: Varna, Vashya, Tara, Yoni, Maitri, Gana, Bhakoot, and Nadi\n";
      prompt += "   - Provide individual scores for each factor and total score\n";
      prompt += "3. Hand Shape & Element Matching (Fire, Water, Earth, Air)\n";
      prompt += "4. Heart Line Analysis (Love & Emotional Compatibility)\n";
      prompt += "5. Head Line Analysis (Communication & Understanding)\n";
      prompt += "6. Fate Line Comparison (Life Goals & Stability)\n";
      prompt += "7. Venus Mount Analysis (Romantic & Physical Attraction)\n";
      prompt += "8. Marriage Line Assessment (Commitment & Long-Term Potential)\n";
      prompt += "9. Relationship Strengths\n";
      prompt += "10. Relationship Challenges\n";
      prompt += "11. Personalized Advice for Improving Compatibility\n\n";
      
      if (nameA && nameB) {
        prompt += `Personalize the report for ${nameA} and ${nameB}. `;
      }
      
      if (birthdateA && birthdateB) {
        prompt += `Consider their birthdates (${nameA}: ${birthdateA}, ${nameB}: ${birthdateB}) for the Guna Milan analysis. `;
      }
      
      prompt += "Format the response with clear section headers and be specific with insights based on palmistry principles and Vedic astrology. Provide actionable recommendations based on the analysis. If birthdates are provided, use them for more accurate Guna Milan calculations.";
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: palm1Base64.replace(/^data:image\/\w+;base64,/, "")
                }
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: palm2Base64.replace(/^data:image\/\w+;base64,/, "")
                }
              }
            ]
          }
        ],
        generation_config: {
          temperature: 0.4,
          top_p: 0.95,
          top_k: 40,
          max_output_tokens: 4096, // Increased token limit for more detailed analysis
        }
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error analyzing compatibility with Gemini:", error);
      throw error;
    }
  }

  // Method to initialize Gemini with user's API key
  static initialize(apiKey: string, modelName: string = "gemini-1.5-flash"): GeminiAI {
    if (!apiKey) {
      throw new Error("Gemini API key is required");
    }
    
    return new GeminiAI({
      apiKey,
      modelName
    });
  }
}

export default GeminiAI;
