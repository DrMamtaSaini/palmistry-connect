
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.initialize(apiKey);
    }
  }

  initialize(apiKey: string) {
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } catch (error) {
      console.error('Error initializing Gemini:', error);
      throw new Error('Failed to initialize Gemini API');
    }
  }

  async analyzePalm(imageData: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini not initialized. Please set your API key first.');
    }

    try {
      // Convert base64 to the format expected by Gemini
      const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg'
        }
      };

      const prompt = `You are a master palmist with decades of experience in reading palms. Analyze this palm image with deep expertise and provide a comprehensive, personalized palmistry reading.

IMPORTANT INSTRUCTIONS:
- This is a REAL palm reading for a real person, not a demonstration or example
- Provide specific, actionable insights based on what you actually observe in the image
- Be detailed and thorough while maintaining authenticity
- Focus on personality traits, life patterns, and meaningful guidance

Please analyze the following aspects in detail:

## **PALM ANALYSIS STRUCTURE:**

### **1. HAND SHAPE & ELEMENTAL TYPE**
- Identify the hand shape (Earth, Air, Water, or Fire)
- Describe the palm's proportions and what this reveals
- Explain the personality traits associated with this hand type

### **2. MAJOR LINES ANALYSIS**
**Heart Line (Love & Emotions):**
- Length, depth, and curvature
- Starting and ending points
- Emotional nature and relationship patterns
- Love life insights and romantic tendencies

**Head Line (Mind & Intelligence):**
- Length and direction (straight vs. curved)
- Mental approach and thinking style
- Learning preferences and intellectual strengths
- Decision-making patterns

**Life Line (Vitality & Life Changes):**
- Curve and strength of the line
- Energy levels and physical constitution
- Major life transitions and turning points
- Health and vitality indicators

**Fate Line (Career & Destiny):**
- Presence and characteristics of the fate line
- Career path and life direction
- External influences on life path
- Professional success indicators

### **3. MOUNTS ANALYSIS**
Analyze the prominent mounts and their meanings:
- Venus Mount (love, passion, family)
- Jupiter Mount (leadership, ambition)
- Saturn Mount (responsibility, discipline)
- Sun Mount (creativity, recognition)
- Mercury Mount (communication, business)
- Mars Mounts (courage, determination)

### **4. FINGER CHARACTERISTICS**
- Finger lengths and proportions
- Flexibility and positioning
- Thumb analysis (willpower and logic)
- Nail shapes and their significance

### **5. SPECIAL MARKINGS**
- Any crosses, stars, triangles, or islands
- Unusual formations or secondary lines
- Their specific meanings and influences

### **6. LIFE INSIGHTS & GUIDANCE**
Based on your analysis, provide insights on:
- **Personality Strengths:** Natural talents and abilities
- **Life Challenges:** Areas for personal growth
- **Relationship Patterns:** Love and friendship tendencies
- **Career Guidance:** Professional path and success factors
- **Health Indicators:** Physical and mental well-being signs
- **Life Timing:** Approximate timing for major life events

### **7. PRACTICAL ADVICE**
- Specific recommendations for personal growth
- How to leverage natural strengths
- Areas to focus on for improvement
- Relationship and career guidance

**IMPORTANT:** Base your reading entirely on what you observe in this specific palm image. Make it personal, meaningful, and actionable for this individual. Avoid generic statements - focus on the unique characteristics you can see in their palm.

The reading should be 800-1200 words, comprehensive yet accessible, and provide genuine value to the person seeking guidance.

Analyze this palm image now:`;

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }

      return text;
    } catch (error) {
      console.error('Error analyzing palm:', error);
      throw new Error(`Palm analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async analyzeComprehensivePalm(imageData: string, userName: string = "User"): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini not initialized. Please set your API key first.');
    }

    try {
      const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg'
        }
      };

      const prompt = `You are creating a comprehensive 20-page PalmCode™ Life Blueprint Report for ${userName}. This is a premium, in-depth analysis that combines traditional palmistry with modern psychological insights.

REPORT STRUCTURE (20 pages, approximately 400-500 words per page):

# **THE PALMCODE™ LIFE BLUEPRINT REPORT**
## **A Comprehensive 20-Page Personal Analysis for ${userName}**

---

## **PAGE 1: EXECUTIVE SUMMARY & INTRODUCTION**
Welcome ${userName} to your personalized PalmCode™ Life Blueprint Report. Provide an overview of the key findings and what makes their palm unique.

## **PAGE 2: ELEMENTAL HAND TYPE & CORE PERSONALITY**
Detailed analysis of hand shape (Earth, Air, Water, Fire) and fundamental personality traits.

## **PAGE 3: THE TRINITY OF MAJOR LINES**
Deep dive into Heart, Head, and Life lines and their interconnected meanings.

## **PAGE 4: LOVE & RELATIONSHIPS BLUEPRINT**
Comprehensive analysis of romantic patterns, compatibility, and relationship guidance.

## **PAGE 5: CAREER & PROFESSIONAL DESTINY**
Detailed career path analysis, professional strengths, and success timing.

## **PAGE 6: FINANCIAL PROSPERITY PATTERNS**
Money lines, wealth indicators, and financial success potential.

## **PAGE 7: HEALTH & VITALITY INDICATORS**
Physical constitution, health patterns, and wellness guidance.

## **PAGE 8: FAMILY & SOCIAL CONNECTIONS**
Family relationships, social patterns, and community involvement.

## **PAGE 9: CREATIVE & ARTISTIC POTENTIAL**
Creative abilities, artistic talents, and self-expression patterns.

## **PAGE 10: SPIRITUAL & PHILOSOPHICAL NATURE**
Spiritual inclinations, philosophical outlook, and higher purpose.

## **PAGE 11: COMMUNICATION & INTELLECTUAL GIFTS**
Mental patterns, communication style, and intellectual strengths.

## **PAGE 12: LEADERSHIP & AUTHORITY POTENTIAL**
Natural leadership abilities, management style, and influence patterns.

## **PAGE 13: ADVENTURE & TRAVEL INDICATORS**
Travel patterns, adventure seeking, and exploration tendencies.

## **PAGE 14: CHALLENGES & GROWTH OPPORTUNITIES**
Life challenges, obstacles, and pathways for personal development.

## **PAGE 15: TIMING & LIFE PHASES**
Age-based predictions and major life transition periods.

## **PAGE 16: SPECIAL MARKINGS & UNIQUE FEATURES**
Analysis of rare markings, unusual formations, and their significance.

## **PAGE 17: COMPATIBILITY & RELATIONSHIP MATCHING**
Ideal partner characteristics and relationship compatibility factors.

## **PAGE 18: SUCCESS STRATEGIES & RECOMMENDATIONS**
Personalized action plan for maximizing potential and achieving goals.

## **PAGE 19: MONTHLY GUIDANCE & SEASONAL PATTERNS**
Month-by-month guidance and seasonal influence patterns.

## **PAGE 20: CONCLUSION & LIFE MASTERY ROADMAP**
Summary of key insights and a roadmap for implementing the guidance.

**IMPORTANT GUIDELINES:**
- Each page should be 400-500 words minimum
- Include specific details observed from the palm image
- Provide actionable advice and practical guidance
- Use ${userName}'s name throughout for personalization
- Include timing predictions where appropriate
- Maintain a professional yet warm, encouraging tone
- Focus on empowerment and positive transformation

Generate this comprehensive 20-page report now, ensuring each page provides valuable, specific insights based on the palm analysis:`;

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }

      return text;
    } catch (error) {
      console.error('Error generating comprehensive palm analysis:', error);
      throw new Error(`Comprehensive analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateComprehensive50PageReport(imageData: string, userProfile: any): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini not initialized. Please set your API key first.');
    }

    try {
      const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg'
        }
      };

      // Calculate additional astrological insights
      const birthDate = new Date(userProfile.dateOfBirth);
      const zodiacSign = this.calculateZodiacSign(birthDate);
      const chineseSign = this.calculateChineseSign(birthDate.getFullYear());

      const prompt = `You are creating the ultimate 50-page comprehensive life analysis report that combines palmistry, astrology, and numerology for ${userProfile.fullName}. This is a premium, deeply personalized analysis that provides specific predictions, timing, and actionable guidance.

# **THE COMPLETE LIFE BLUEPRINT: 50-PAGE COMPREHENSIVE REPORT**
## **For ${userProfile.fullName}**

**PERSONAL DATA INTEGRATION:**
- Full Name: ${userProfile.fullName}
- Birth Date: ${userProfile.dateOfBirth} at ${userProfile.timeOfBirth}
- Birth Place: ${userProfile.placeOfBirth}
- Gender: ${userProfile.gender}
- Zodiac Sign: ${zodiacSign}
- Chinese Zodiac: ${chineseSign}
- Life Path Number: ${userProfile.lifePathNumber}
- Expression Number: ${userProfile.expressionNumber}
- Dominant Hand: ${userProfile.dominantHand}
- Hand Shape: ${userProfile.handShape}
- Primary Concerns: ${userProfile.primaryConcerns?.join(', ') || 'General life guidance'}
- Life Goals: ${userProfile.lifeGoals?.join(', ') || 'Personal fulfillment'}
- Current Challenges: ${userProfile.currentChallenges?.join(', ') || 'Personal growth'}
- Personality Traits: ${userProfile.personalityTraits?.join(', ') || 'Self-discovery'}

**REPORT STRUCTURE (50 pages, 300-500 words each):**

## **SECTION I: FOUNDATIONAL ANALYSIS (Pages 1-10)**

**PAGE 1: Introduction & Cosmic Blueprint Overview**
Welcome ${userProfile.fullName} to your comprehensive life analysis. Synthesize their cosmic signature combining palm, astrology, and numerology.

**PAGE 2: Elemental Hand Classification & Core Nature**
Detailed analysis of ${userProfile.handShape} hand type and its profound implications for personality and life approach.

**PAGE 3: Astrological Foundation - ${zodiacSign} Influence**
Deep dive into their ${zodiacSign} nature, planetary rulers, and cosmic influences.

**PAGE 4: Numerological Blueprint - Life Path ${userProfile.lifePathNumber}**
Comprehensive analysis of Life Path ${userProfile.lifePathNumber} and Expression ${userProfile.expressionNumber} meanings.

**PAGE 5: The Trinity of Major Lines - Integration Analysis**
Cross-validation between palm lines and astrological indicators for accuracy.

**PAGE 6: Personality Architecture & Character Foundation**
Integration of palm characteristics with ${userProfile.personalityTraits?.join(', ')} traits.

**PAGE 7: Karmic Patterns & Soul Purpose**
Past life influences and current life mission based on multiple divination systems.

**PAGE 8: Strengths & Natural Talents Inventory**
Comprehensive catalog of innate abilities and how to maximize them.

**PAGE 9: Life Challenges & Growth Opportunities**
Detailed analysis of ${userProfile.currentChallenges?.join(', ')} and transformation pathways.

**PAGE 10: Cosmic Timing & Life Phases Overview**
Major life phases and their approximate timing based on palm and astrological indicators.

## **SECTION II: RELATIONSHIP & LOVE ANALYSIS (Pages 11-20)**

**PAGE 11: Heart Line Deep Analysis & Love Nature**
Comprehensive relationship patterns and emotional blueprint.

**PAGE 12: Marriage & Partnership Timing Predictions**
Specific timing for marriage, relationships, and partnership opportunities.

**PAGE 13: Compatibility Matrix & Ideal Partner Profile**
Detailed description of ideal partner characteristics and compatibility factors.

**PAGE 14: Family Dynamics & Children Insights**
Family relationships, parenting style, and children-related predictions.

**PAGE 15: Venus & Relationship Planet Influences**
Astrological love patterns and romantic destiny.

**PAGE 16: Relationship Challenges & Solutions**
Common relationship patterns and how to overcome them.

**PAGE 17: Sexual & Intimacy Patterns**
Physical and emotional intimacy characteristics and guidance.

**PAGE 18: Social Connections & Friendship Patterns**
Social nature, friendship dynamics, and community involvement.

**PAGE 19: Communication in Relationships**
How ${userProfile.fullName} communicates in relationships and improvement strategies.

**PAGE 20: Long-term Relationship Success Strategies**
Specific advice for maintaining and deepening relationships.

## **SECTION III: CAREER & FINANCIAL PROSPERITY (Pages 21-30)**

**PAGE 21: Career Line & Professional Destiny Analysis**
Detailed career path based on fate line and astrological career houses.

**PAGE 22: Ideal Profession & Career Fields**
Specific career recommendations based on hand shape, lines, and astrological indicators.

**PAGE 23: Business & Entrepreneurship Potential**
Analysis of business acumen and entrepreneurial success factors.

**PAGE 24: Financial Prosperity Patterns & Wealth Building**
Money lines, wealth indicators, and financial success strategies.

**PAGE 25: Career Timing & Professional Milestones**
Specific years for career advancement, job changes, and professional success.

**PAGE 26: Leadership Style & Management Approach**
Natural leadership abilities and optimal management strategies.

**PAGE 27: Creative & Artistic Career Potential**
Analysis of creative talents and artistic career possibilities.

**PAGE 28: Technology & Modern Career Adaptability**
How to thrive in modern careers and technological changes.

**PAGE 29: Work-Life Balance & Professional Satisfaction**
Achieving harmony between career ambitions and personal fulfillment.

**PAGE 30: Retirement & Later Career Transitions**
Long-term career evolution and retirement planning insights.

## **SECTION IV: HEALTH, WELLNESS & VITALITY (Pages 31-35)**

**PAGE 31: Life Line & Constitutional Health Analysis**
Physical constitution, energy patterns, and health predispositions.

**PAGE 32: Specific Health Areas & Preventive Care**
Body systems to monitor and preventive health strategies.

**PAGE 33: Mental Health & Emotional Wellness Patterns**
Psychological tendencies and mental wellness recommendations.

**PAGE 34: Optimal Diet, Exercise & Lifestyle Recommendations**
Personalized wellness plan based on constitutional type.

**PAGE 35: Health Timing & Critical Periods**
Ages and periods requiring extra health attention and care.

## **SECTION V: SPIRITUAL & PERSONAL DEVELOPMENT (Pages 36-40)**

**PAGE 36: Spiritual Inclinations & Higher Purpose**
Spiritual nature, religious tendencies, and soul mission.

**PAGE 37: Meditation, Mindfulness & Spiritual Practices**
Recommended spiritual practices and mindfulness techniques.

**PAGE 38: Intuitive Abilities & Psychic Potential**
Natural intuitive gifts and how to develop them.

**PAGE 39: Life Lessons & Karmic Themes**
Major life lessons and karmic patterns to resolve.

**PAGE 40: Personal Transformation & Enlightenment Path**
Pathways for spiritual growth and consciousness expansion.

## **SECTION VI: TIMING, PREDICTIONS & PRACTICAL GUIDANCE (Pages 41-50)**

**PAGE 41: Year-by-Year Predictions (Next 5 Years)**
Specific predictions for each of the next 5 years with key events and opportunities.

**PAGE 42: Major Life Transitions & Turning Points**
Significant life changes and how to navigate them successfully.

**PAGE 43: Lucky Numbers, Colors & Timing**
Personalized lucky elements and optimal timing for important decisions.

**PAGE 44: Gemstones, Remedies & Enhancement Techniques**
Traditional remedies, gemstones, and techniques for life enhancement.

**PAGE 45: Travel & Relocation Guidance**
Favorable directions, locations, and travel timing.

**PAGE 46: Investment & Financial Decision Timing**
Optimal timing for major financial decisions and investments.

**PAGE 47: Daily, Weekly & Monthly Guidance Patterns**
How to optimize daily life based on natural rhythms and patterns.

**PAGE 48: Emergency Guidance & Crisis Navigation**
How to handle unexpected challenges and crisis periods.

**PAGE 49: Success Acceleration Strategies**
Advanced techniques for accelerating success in all life areas.

**PAGE 50: Master Life Plan & Implementation Roadmap**
Comprehensive action plan for the next 10 years with specific steps and milestones.

**CROSS-VALIDATION REQUIREMENTS:**
- Ensure palmistry observations align with astrological indicators
- Highlight any discrepancies and provide deeper analysis
- Use multiple confirmation methods for major predictions
- Provide specific timing based on multiple systems
- Include both opportunities and challenges for balanced guidance

**WRITING GUIDELINES:**
- Each page must be 300-500 words minimum
- Include specific details from the palm image analysis
- Provide actionable, practical advice
- Use ${userProfile.fullName}'s name throughout for personalization
- Include specific timing predictions with approximate ages/years
- Maintain professional yet warm, encouraging tone
- Focus on empowerment and positive transformation
- Address their specific concerns: ${userProfile.primaryConcerns?.join(', ')}
- Align with their stated goals: ${userProfile.lifeGoals?.join(', ')}

Generate this comprehensive 50-page report now, ensuring each page provides valuable, specific insights based on the integrated analysis of palmistry, astrology, and numerology:`;

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }

      return text;
    } catch (error) {
      console.error('Error generating 50-page comprehensive report:', error);
      throw new Error(`50-page report generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculateZodiacSign(birthDate: Date): string {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return "Aries";
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return "Taurus";
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return "Gemini";
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return "Cancer";
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return "Leo";
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return "Virgo";
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return "Libra";
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return "Scorpio";
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return "Sagittarius";
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return "Capricorn";
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return "Aquarius";
    return "Pisces";
  }

  private calculateChineseSign(year: number): string {
    const signs = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
    return signs[(year - 1900) % 12];
  }

  isInitialized(): boolean {
    return this.model !== null;
  }
}

export const createGeminiService = (apiKey?: string) => {
  return new GeminiService(apiKey);
};
