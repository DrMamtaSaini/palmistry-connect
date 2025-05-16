
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Ensures text contrast by forcing text to be black
 * @param content The HTML or markdown content to process
 * @returns The content with improved contrast
 */
export function ensureTextContrast(content: string): string {
  if (!content) return '';
  
  // Add inline style to force black text color
  let processedContent = content;
  
  // Add style to headings
  processedContent = processedContent.replace(
    /^(#{1,6}\s.*?)$/gm, 
    '$1 {style="color: black; font-weight: bold;"}'
  );
  
  // Add style to paragraphs by adding a class
  processedContent = processedContent.replace(
    /^(?!#|>|-|\*|\d+\.\s|\|)(.+)$/gm, 
    '<p style="color: black;">$1</p>'
  );
  
  // Add style to list items
  processedContent = processedContent.replace(
    /^(-|\*)\s(.*)$/gm, 
    '$1 <span style="color: black;">$2</span>'
  );
  
  return processedContent;
}

/**
 * Creates a demo report with visible text for testing
 * @returns A sample palmistry report with proper formatting
 */
export function createDemoReport(userName: string = "User"): string {
  return `
# PalmCode™ Life Blueprint Report for ${userName}

## Executive Summary

This comprehensive analysis of your palm reveals a unique combination of traits and potentials. Your hand shows significant indicators of creativity, analytical thinking, and emotional depth.

PAGE 1: Executive Summary - Life Blueprint Overview
==================================================

Your palm reveals a fascinating blend of analytical thinking and creative potential. The prominent head line indicates strong intellectual capabilities, while your heart line suggests deep emotional sensitivity. These two core aspects of your personality create a dynamic interplay that influences most aspects of your life.

Your life purpose appears to be centered around bringing practical solutions to complex problems, particularly in ways that benefit others. The balance of your hand elements suggests you thrive in environments that allow both structured thinking and creative expression.

Key personality traits revealed in your palm include:
- Strong determination and persistence
- Natural analytical abilities
- Emotional intelligence and empathy
- Creative problem-solving approach
- Adaptability to changing circumstances

Your hand structure falls primarily into the Air hand category, with long fingers relative to palm size, indicating intellectual interests and communication skills. This is complemented by a strong Earth influence in your palm, providing practicality and groundedness to balance your analytical tendencies.

Past influences have shaped your current approaches to challenges, particularly in how you process emotions and make decisions. The present period shows a time of potential growth and expansion, while future indicators suggest upcoming opportunities for leadership and creative expression.

PAGE 2: Hand Shape & Elemental Analysis
======================================

Your hand shape predominantly falls into the Air element category, characterized by a rectangular palm and long fingers. This shape is typically associated with intellectual pursuits, communication skills, and analytical thinking.

The Air hand indicates someone who:
- Processes information intellectually before emotionally
- Enjoys abstract and theoretical concepts
- Has natural abilities in communication and expression
- Approaches problems logically and systematically
- May sometimes overthink or get lost in details

Your finger proportions provide additional insights into your personality. The index finger (Jupiter finger) is slightly shorter than average relative to your ring finger, suggesting a balance between confidence and caution in leadership situations. Your ring finger (Apollo finger) is proportionately longer, indicating creative abilities and aesthetic appreciation.

Your thumb shows flexibility and a good length, suggesting adaptability and strong willpower. The angle at which your thumb sits relative to your palm indicates a healthy balance between assertiveness and cooperation.

The overall proportions of your hand indicate someone who values both intellectual understanding and practical application. While you enjoy concepts and ideas, you also have a need to see tangible results from your efforts.

PAGE 3: Astrological Past - Formative Years & Origins
===================================================

The early formative influences visible in your palm show significant childhood experiences that shaped your current perspective. Minor lines intersecting your head line in the early section suggest intellectual challenges or pivotal learning experiences in your formative years that developed your analytical thinking.

Karmic patterns visible in your palm include a tendency toward overthinking and perfectionism, possibly carried from past experiences where precision and careful analysis were essential for survival or success. This manifests today as both a strength (attention to detail) and a potential challenge (analysis paralysis).

Early life challenges appear to have centered around communication and self-expression, as indicated by markings near the base of your Mercury finger. These experiences likely strengthened your resolve to be understood clearly and to express your unique perspective.

Family dynamics shown in your hand include a strong influence from a practical, grounded parental figure (likely paternal) and an emotionally nurturing but possibly complex relationship with a maternal figure. These influences created your current approach to balancing practical concerns with emotional needs.

PAGE 4: Life Line Analysis
=========================

Your life line begins with a clear, well-defined arch, indicating a strong sense of self and identity from an early age. The depth and clarity of this line suggest good vitality and physical energy throughout most of your life.

Several significant markers appear along your life line:
- A small island formation near the beginning suggests a period of uncertainty or health sensitivity in early childhood
- A fork or branch upward toward the mount of Jupiter around the mid-point indicates a significant choice or change in direction that expanded your horizons
- A strengthening of the line in the latter portion suggests increasing vigor and purpose as you mature

The overall sweep of your life line shows someone who gradually expands their sphere of influence and impact over time, rather than experiencing sudden dramatic changes. This steady progression allows you to build on experiences and grow organically.

Timing indicators on your life line place significant transitions approximately at ages:
- 18-22: A period of establishing independence and direction
- 32-38: A time of increased responsibility and purpose
- 45-55: A phase of personal mastery and deeper meaning

Your life line connects well with your head line, indicating good integration between your vital energy and mental faculties. This connection helps you direct your energy efficiently toward your goals and interests.

[Content continues for all 20 pages with black text...]
`;
}
