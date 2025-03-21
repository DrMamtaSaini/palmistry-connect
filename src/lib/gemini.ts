
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
    this.modelName = config.modelName || "gemini-pro-vision";
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

  async checkCompatibility(palm1Base64: string, palm2Base64: string): Promise<string> {
    try {
      const endpoint = `${this.baseUrl}/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: "Analyze these two palm images and provide insights about the compatibility between these two people. Consider their relationship potential, communication style, emotional connection, and long-term harmony based on palmistry principles."
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
      console.error("Error analyzing compatibility with Gemini:", error);
      throw error;
    }
  }

  // Method to initialize Gemini with user's API key
  static initialize(apiKey: string, modelName: string = "gemini-pro-vision"): GeminiAI {
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
