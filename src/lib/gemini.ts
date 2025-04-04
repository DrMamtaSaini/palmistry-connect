
// This is a utility file for Gemini AI integration
// The actual API key should be provided by the user and stored securely

interface GeminiConfig {
  apiKey: string;
  modelName: string;
}

interface CompatibilityData {
  yourDetails: {
    name: string;
    birthDate: string;
    birthTime?: string;
    birthPlace?: string;
    palmImage: string;
  };
  partnerDetails: {
    name: string;
    birthDate: string;
    birthTime?: string;
    birthPlace?: string;
    palmImage: string;
  };
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
      console.log('Starting palm analysis with Gemini API');
      const endpoint = `${this.baseUrl}/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      
      // Ensure image is properly formatted for the API
      let formattedImage = imageBase64;
      if (!imageBase64.startsWith('data:image')) {
        console.log('Image is not properly formatted, adding data URI prefix');
        formattedImage = `data:image/jpeg;base64,${imageBase64}`;
      }
      
      const promptText = `
Analyze this palm image in detail and provide a comprehensive reading based on palmistry principles. Focus on:

1. Major Lines Analysis
   - Heart Line: Emotional nature, relationships, love life
   - Head Line: Intellectual capabilities, communication style, decision-making
   - Life Line: Vitality, health, major life changes (NOT lifespan prediction)
   - Fate Line: Career path, life direction, success indicators
   - Sun Line: Fame, recognition, talents
   - Marriage Lines: Romantic relationships, commitments

2. Mounts Analysis
   - Venus Mount (thumb base): Love, passion, vitality
   - Jupiter Mount (index finger): Ambition, leadership, confidence
   - Saturn Mount (middle finger): Responsibility, wisdom, fate
   - Apollo/Sun Mount (ring finger): Creativity, success, recognition
   - Mercury Mount (little finger): Communication, business acumen
   - Moon Mount (opposite thumb): Imagination, intuition, creativity
   - Mars Mounts: Energy, courage, determination

3. Fingers Analysis
   - Length, shape, flexibility
   - Special markings or features

4. Overall Hand Analysis
   - Shape (Earth, Air, Fire, Water)
   - Size and proportions
   - Skin texture and color
   - Flexibility

5. Special Markings
   - Star, cross, triangle, square, island, trident markings and their meanings

6. Personal Characteristics
   - Strengths and talents
   - Potential challenges
   - Relationship tendencies
   - Career aptitudes

7. Timeline Predictions
   - Potential significant events or changes
   - Past influences still affecting present
   - Future opportunities and challenges

Format the response as a detailed professional palm reading report with clear section headings. Focus on providing detailed, specific, and personalized insights rather than vague or general statements. Mention specific features visible in the image.

IMPORTANT: If certain lines or features are not visible in this image, please make your best assessment based on what IS visible, rather than stating you cannot see them.

Return a proper and complete palmistry report in a clear format with sections. The report should be comprehensive and at least 10-15 paragraphs long.
`;
      
      // Make sure the image is properly formatted for the API
      const imageData = formattedImage.replace(/^data:image\/\w+;base64,/, "");
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: promptText
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageData
                }
              }
            ]
          }
        ],
        generation_config: {
          temperature: 0.7,
          top_p: 0.95,
          top_k: 40,
          max_output_tokens: 4096,
        }
      };

      console.log('Sending request to Gemini API...');
      
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          let errorMessage = `API returned status ${response.status}`;
          try {
            const errorText = await response.text();
            console.error('Response not OK:', response.status, errorText);
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error?.message || errorMessage;
          } catch (e) {
            console.error('Failed to parse error response', e);
          }
          throw new Error(`Gemini API Error: ${errorMessage}`);
        }

        const data = await response.json();
        console.log('Received response from Gemini API:', data ? 'Data received' : 'No data');
        
        if (!data) {
          throw new Error('Empty response from Gemini API');
        }
        
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
          console.error('Unexpected API response format - no candidates:', data);
          throw new Error('Invalid response format from Gemini API: No candidates found');
        }
        
        if (!data.candidates[0].content.parts || !data.candidates[0].content.parts[0] || !data.candidates[0].content.parts[0].text) {
          console.error('Unexpected API response format - no text in parts:', data.candidates[0]);
          throw new Error('Invalid response format from Gemini API: No text content found');
        }
        
        const resultText = data.candidates[0].content.parts[0].text;
        console.log('Successfully extracted text result from API response');
        
        // Validate that we got a real analysis (not just an error message or empty response)
        if (resultText.length < 500) {
          console.error('Response text suspiciously short:', resultText);
          throw new Error('The generated palm reading is too short to be valid. Please try with a clearer palm image.');
        }
        
        return resultText;
      } catch (fetchError) {
        console.error('Fetch error during Gemini API call:', fetchError);
        throw fetchError;
      }
    } catch (error) {
      console.error("Error analyzing palm with Gemini:", error);
      throw error;
    }
  }

  async checkCompatibility(
    dataOrPalm1: string | CompatibilityData,
    palm2Base64?: string,
    nameA?: string,
    nameB?: string,
    birthdateA?: string,
    birthdateB?: string
  ): Promise<string> {
    try {
      const endpoint = `${this.baseUrl}/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      
      let palm1Base64: string;
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
      prompt += "IMPORTANT: Each palm needs to be analyzed thoroughly. If some lines are not clearly visible, use the information that IS visible to make your best assessment.\n\n";
      prompt += "For the Guna Milan analysis, you MUST use the provided birth details. This is essential for an accurate Vedic compatibility assessment.\n\n";
      prompt += "For palm analysis, look carefully for:\n";
      prompt += "- The shape and length of heart lines to determine emotional compatibility\n";
      prompt += "- Head line patterns to assess mental and communication compatibility\n";
      prompt += "- Life and fate lines to evaluate life path alignment\n";
      prompt += "- Marriage lines for commitment potential\n";
      prompt += "- Venus mount development for romantic compatibility\n";
      prompt += "Format the report in a detailed, professional manner with clear sections and specific insights for each area.\n\n";
      
      if (typeof dataOrPalm1 === 'object') {
        const data = dataOrPalm1;
        palm1Base64 = data.yourDetails.palmImage;
        
        prompt += `Personalize the report for ${data.yourDetails.name} and ${data.partnerDetails.name}. `;
        
        // Emphasize that we have birth details and they should be used
        prompt += `IMPORTANT: Use the provided birth details for accurate Guna Milan analysis: `;
        prompt += `${data.yourDetails.name}'s birthdate: ${data.yourDetails.birthDate}, `;
        
        if (data.yourDetails.birthTime) {
          prompt += `birth time: ${data.yourDetails.birthTime}, `;
        }
        
        if (data.yourDetails.birthPlace) {
          prompt += `birth place: ${data.yourDetails.birthPlace}. `;
        }
        
        prompt += `${data.partnerDetails.name}'s birthdate: ${data.partnerDetails.birthDate}, `;
        
        if (data.partnerDetails.birthTime) {
          prompt += `birth time: ${data.partnerDetails.birthTime}, `;
        }
        
        if (data.partnerDetails.birthPlace) {
          prompt += `birth place: ${data.partnerDetails.birthPlace}. `;
        }
        
        prompt += "\n\nImportant guidelines for palm analysis:\n";
        prompt += "1. Identify and analyze all major lines even if they appear faint\n";
        prompt += "2. Look for head line, heart line, life line, fate line, and marriage lines\n";
        prompt += "3. Analyze finger length ratios and palm shape for elemental analysis\n";
        prompt += "4. Compare the Venus mounts (base of thumb) between partners\n";
        prompt += "5. Provide a complete Guna Milan analysis using the birth details\n";
        prompt += "6. Ensure you produce a detailed report even if some lines are not immediately obvious\n";
        prompt += "7. The birth details provided MUST be used for the Guna Milan analysis - this is absolutely essential\n";
        
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
                    data: data.partnerDetails.palmImage.replace(/^data:image\/\w+;base64,/, "")
                  }
                }
              ]
            }
          ],
          generation_config: {
            temperature: 0.7,
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

        const responseData = await response.json();
        return responseData.candidates[0].content.parts[0].text;
      } else {
        palm1Base64 = dataOrPalm1;
        
        if (nameA && nameB) {
          prompt += `Personalize the report for ${nameA} and ${nameB}. `;
        }
        
        if (birthdateA && birthdateB) {
          // Emphasize that we have birth details and they should be used
          prompt += `IMPORTANT: Use the provided birth details for accurate Guna Milan analysis: `;
          prompt += `${nameA}'s birthdate: ${birthdateA}, ${nameB}'s birthdate: ${birthdateB}. `;
          prompt += `These birth details MUST be used for the Guna Milan analysis - this is absolutely essential. `;
        }
        
        prompt += "\n\nImportant guidelines for palm analysis:\n";
        prompt += "1. Identify and analyze all major lines even if they appear faint\n";
        prompt += "2. Look for head line, heart line, life line, fate line, and marriage lines\n";
        prompt += "3. Analyze finger length ratios and palm shape for elemental analysis\n";
        prompt += "4. Compare the Venus mounts (base of thumb) between partners\n";
        prompt += "5. Provide a complete Guna Milan analysis using the birth details\n";
        prompt += "6. Ensure you produce a detailed report even if some lines are not immediately obvious\n";
        prompt += "7. The birth details provided MUST be used for the Guna Milan analysis\n";
        
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
                    data: palm2Base64!.replace(/^data:image\/\w+;base64,/, "")
                  }
                }
              ]
            }
          ],
          generation_config: {
            temperature: 0.7,
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

        const responseData = await response.json();
        return responseData.candidates[0].content.parts[0].text;
      }
    } catch (error) {
      console.error("Error analyzing compatibility with Gemini:", error);
      throw error;
    }
  }

  // Method to initialize Gemini with user's API key
  static initialize(apiKey: string, modelName: string = "gemini-1.5-flash"): GeminiAI {
    if (!apiKey || apiKey.trim() === '') {
      throw new Error("Gemini API key is required");
    }
    
    console.log(`Initializing Gemini with model: ${modelName}`);
    return new GeminiAI({
      apiKey,
      modelName
    });
  }
}

export default GeminiAI;
