
interface ValidationResult {
  isConsistent: boolean;
  discrepancies: string[];
  reinforcements: string[];
  accuracyScore: number;
}

interface PalmData {
  handShape: string;
  heartLineCharacteristics: string;
  headLineCharacteristics: string;
  lifeLineCharacteristics: string;
  dominantHand: string;
}

interface AstrologicalData {
  zodiacSign: string;
  lifePathNumber: number;
  expressionNumber: number;
  birthDate: string;
}

export class CrossValidationService {
  static validatePalmAndAstrology(palmData: PalmData, astroData: AstrologicalData): ValidationResult {
    const discrepancies: string[] = [];
    const reinforcements: string[] = [];
    let accuracyScore = 0;
    let totalChecks = 0;

    // Hand Shape vs Zodiac Element validation
    const handElements = {
      'earth': 'earth',
      'air': 'air', 
      'water': 'water',
      'fire': 'fire'
    };

    const zodiacElements = {
      'Aries': 'fire', 'Leo': 'fire', 'Sagittarius': 'fire',
      'Taurus': 'earth', 'Virgo': 'earth', 'Capricorn': 'earth',
      'Gemini': 'air', 'Libra': 'air', 'Aquarius': 'air',
      'Cancer': 'water', 'Scorpio': 'water', 'Pisces': 'water'
    };

    if (palmData.handShape && astroData.zodiacSign) {
      totalChecks++;
      const palmElement = handElements[palmData.handShape as keyof typeof handElements];
      const zodiacElement = zodiacElements[astroData.zodiacSign as keyof typeof zodiacElements];
      
      if (palmElement === zodiacElement) {
        reinforcements.push(`Hand shape (${palmData.handShape}) aligns perfectly with ${astroData.zodiacSign} zodiac sign - both ${palmElement} element`);
        accuracyScore++;
      } else {
        discrepancies.push(`Hand shape suggests ${palmElement} nature while ${astroData.zodiacSign} indicates ${zodiacElement} - suggests complex personality with dual nature`);
      }
    }

    // Life Path Number vs Heart Line validation
    if (palmData.heartLineCharacteristics && astroData.lifePathNumber) {
      totalChecks++;
      const emotionalNumbers = [2, 6, 9]; // Typically more emotional life paths
      const isEmotionalNumber = emotionalNumbers.includes(astroData.lifePathNumber);
      const isEmotionalHeartLine = ['long-curved', 'deep-clear'].includes(palmData.heartLineCharacteristics);
      
      if ((isEmotionalNumber && isEmotionalHeartLine) || (!isEmotionalNumber && !isEmotionalHeartLine)) {
        reinforcements.push(`Life Path ${astroData.lifePathNumber} and heart line characteristics show consistent emotional patterns`);
        accuracyScore++;
      } else if (isEmotionalNumber && !isEmotionalHeartLine) {
        discrepancies.push(`Life Path ${astroData.lifePathNumber} suggests strong emotional nature, but heart line indicates more reserved emotional expression`);
      } else {
        discrepancies.push(`Heart line suggests deep emotional nature while Life Path ${astroData.lifePathNumber} indicates more practical approach to relationships`);
      }
    }

    // Head Line vs Expression Number validation
    if (palmData.headLineCharacteristics && astroData.expressionNumber) {
      totalChecks++;
      const intellectualNumbers = [1, 7, 8]; // Typically more analytical
      const isIntellectualNumber = intellectualNumbers.includes(astroData.expressionNumber);
      const isAnalyticalHeadLine = ['long-straight', 'deep-clear'].includes(palmData.headLineCharacteristics);
      
      if ((isIntellectualNumber && isAnalyticalHeadLine) || (!isIntellectualNumber && !isAnalyticalHeadLine)) {
        reinforcements.push(`Expression Number ${astroData.expressionNumber} and head line show consistent intellectual approach`);
        accuracyScore++;
      } else {
        discrepancies.push(`Mental approach shows interesting contrast between Expression Number ${astroData.expressionNumber} and head line characteristics`);
      }
    }

    const finalAccuracyScore = totalChecks > 0 ? (accuracyScore / totalChecks) * 100 : 0;

    return {
      isConsistent: discrepancies.length <= reinforcements.length,
      discrepancies,
      reinforcements,
      accuracyScore: Math.round(finalAccuracyScore)
    };
  }

  static generateCrossValidationInsights(validation: ValidationResult): string {
    let insights = "\n## **CROSS-VALIDATION ANALYSIS**\n\n";
    
    insights += `**Accuracy Score: ${validation.accuracyScore}%**\n\n`;
    
    if (validation.reinforcements.length > 0) {
      insights += "**Consistent Patterns Found:**\n";
      validation.reinforcements.forEach(reinforcement => {
        insights += `• ${reinforcement}\n`;
      });
      insights += "\n";
    }
    
    if (validation.discrepancies.length > 0) {
      insights += "**Areas of Complexity & Deeper Analysis:**\n";
      validation.discrepancies.forEach(discrepancy => {
        insights += `• ${discrepancy}\n`;
      });
      insights += "\n";
    }
    
    if (validation.accuracyScore >= 80) {
      insights += "**Interpretation:** Your palmistry and astrological indicators show remarkable consistency, suggesting a strong alignment between your inner nature and outer expression. This high coherence indicates that the predictions and insights in this report are highly reliable.\n\n";
    } else if (validation.accuracyScore >= 60) {
      insights += "**Interpretation:** Your palmistry and astrological patterns show good overall alignment with some interesting complexities. These variations suggest a multi-faceted personality with both consistent core traits and adaptable characteristics.\n\n";
    } else {
      insights += "**Interpretation:** Your palmistry and astrological indicators reveal a complex, multi-dimensional personality. The contrasts between different systems suggest someone who has evolved beyond their birth patterns or has significant hidden depths to explore.\n\n";
    }
    
    return insights;
  }

  static enhanceTimingPredictions(birthDate: string, currentAge: number): string {
    const birth = new Date(birthDate);
    const currentYear = new Date().getFullYear();
    const birthYear = birth.getFullYear();
    
    let timingInsights = "\n## **ENHANCED TIMING PREDICTIONS**\n\n";
    
    // 7-year life cycles
    const currentCycle = Math.floor(currentAge / 7) + 1;
    const cycleStart = (currentCycle - 1) * 7;
    const cycleEnd = currentCycle * 7;
    
    timingInsights += `**Current Life Cycle:** You are in your ${currentCycle}${this.getOrdinalSuffix(currentCycle)} seven-year cycle (ages ${cycleStart}-${cycleEnd})\n\n`;
    
    // Saturn Return timing
    if (currentAge >= 27 && currentAge <= 32) {
      timingInsights += "**Saturn Return Period:** You are experiencing or approaching your first Saturn Return (ages 27-32), a time of major life restructuring and responsibility.\n\n";
    } else if (currentAge >= 56 && currentAge <= 61) {
      timingInsights += "**Second Saturn Return:** You are in your second Saturn Return period (ages 56-61), focusing on wisdom, legacy, and life mastery.\n\n";
    }
    
    // Jupiter cycles (12-year cycles)
    const jupiterCycle = currentAge % 12;
    if (jupiterCycle >= 0 && jupiterCycle <= 2) {
      timingInsights += "**Jupiter Expansion Phase:** You are in a period of growth, opportunity, and expansion (lasts until age " + (currentAge + (2 - jupiterCycle)) + ").\n\n";
    }
    
    return timingInsights;
  }
  
  private static getOrdinalSuffix(num: number): string {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  }
}

export const generateNumerologyInsights = (fullName: string, birthDate: string): string => {
  const calculateLifePath = (date: string): number => {
    const numbers = date.replace(/-/g, '').split('').map(Number);
    let sum = numbers.reduce((a, b) => a + b, 0);
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }
    return sum;
  };
  
  const lifePath = calculateLifePath(birthDate);
  
  const lifePathMeanings = {
    1: "Natural leader with pioneering spirit and independence",
    2: "Cooperative, diplomatic, and relationship-focused",
    3: "Creative, expressive, and naturally optimistic",
    4: "Practical, hardworking, and detail-oriented",
    5: "Freedom-loving, adventurous, and versatile",
    6: "Nurturing, responsible, and family-oriented",
    7: "Analytical, spiritual, and introspective",
    8: "Ambitious, business-minded, and success-oriented",
    9: "Humanitarian, generous, and idealistic",
    11: "Intuitive, inspirational, and spiritually gifted",
    22: "Master builder with practical visionary abilities",
    33: "Master teacher with healing and uplifting abilities"
  };
  
  return `\n## **NUMEROLOGICAL BLUEPRINT**\n\n**Life Path Number ${lifePath}:** ${lifePathMeanings[lifePath as keyof typeof lifePathMeanings] || 'Unique spiritual path'}\n\n`;
};
