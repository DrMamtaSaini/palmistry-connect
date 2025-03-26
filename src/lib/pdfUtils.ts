import { toast } from "@/hooks/use-toast";

export const generatePDF = async (content: any, isDetailed: boolean = true) => {
  console.log('Generating PDF with content:', content);
  
  try {
    // Create an HTML string with nicely formatted content
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Palm Reading Analysis Report</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 40px;
      color: #333;
    }
    h1 {
      color: #006400;
      text-align: center;
      margin-bottom: 30px;
      font-size: 24px;
    }
    h2 {
      color: #008000;
      margin-top: 20px;
      margin-bottom: 10px;
      font-size: 18px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
    }
    .section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .chapter {
      page-break-before: always;
    }
    .first-chapter {
      page-break-before: avoid;
    }
    .insight {
      padding: 12px;
      margin: 10px 0;
      background-color: #f9f9f9;
      border-left: 3px solid #00FF7F;
    }
    .insight-title {
      font-weight: bold;
      margin-bottom: 8px;
      color: #006400;
    }
    .insight-content {
      line-height: 1.5;
    }
    .detailed-insight {
      padding: 15px;
      margin: 10px 0;
      background-color: #f9f9f9;
      border-left: 3px solid #00FF7F;
    }
    .subsection {
      margin: 15px 0;
    }
    .subsection h3 {
      color: #228B22;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .table-of-contents {
      margin: 30px 0;
    }
    .toc-item {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px dotted #ccc;
    }
    .page-number {
      font-weight: bold;
    }
    p {
      text-align: justify;
    }
    .analysis-paragraph {
      margin-bottom: 15px;
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <h1>Palm Reading Analysis Report</h1>`;

    // Add table of contents for detailed reports
    if (isDetailed) {
      htmlContent += `
  <div class="section">
    <h2>Table of Contents</h2>
    <div class="table-of-contents">
      <div class="toc-item">
        <span>Introduction to Your Palm Reading</span>
        <span class="page-number">1</span>
      </div>`;
      
      let pageCount = 2;
      content.sections.forEach((section: any) => {
        htmlContent += `
      <div class="toc-item">
        <span>${section.name}</span>
        <span class="page-number">${pageCount}</span>
      </div>`;
        pageCount += section.insights.length + 4; // Each insight plus subsections takes approximately 5 pages
      });
      
      // Add more sections to TOC for a longer report
      htmlContent += `
      <div class="toc-item">
        <span>Future Timeline Predictions</span>
        <span class="page-number">${pageCount}</span>
      </div>
      <div class="toc-item">
        <span>Past Life Influences</span>
        <span class="page-number">${pageCount + 8}</span>
      </div>
      <div class="toc-item">
        <span>Chakra Analysis</span>
        <span class="page-number">${pageCount + 16}</span>
      </div>
      <div class="toc-item">
        <span>Spiritual Development</span>
        <span class="page-number">${pageCount + 24}</span>
      </div>
      <div class="toc-item">
        <span>Ancestral Connections</span>
        <span class="page-number">${pageCount + 32}</span>
      </div>
      <div class="toc-item">
        <span>Conclusion & Recommendations</span>
        <span class="page-number">${pageCount + 40}</span>
      </div>
    </div>
  </div>

  <div class="chapter first-chapter">
    <h2>Introduction to Your Palm Reading</h2>
    <p class="analysis-paragraph">
      Your palm is a unique map of your personality, abilities, and life path. This comprehensive analysis 
      examines the major lines, mounts, and special markings found in your palm to provide deep insights into 
      your character and potential future developments.
    </p>
    <p class="analysis-paragraph">
      The science of palmistry dates back thousands of years, with roots in ancient Indian, Chinese, and Greek 
      civilizations. This report combines traditional palmistry knowledge with modern psychological understanding 
      to give you a holistic view of your inherent traits and life possibilities.
    </p>
    <p class="analysis-paragraph">
      Each section of this report focuses on different aspects of your life, from personality and relationships 
      to career and health. The analysis is based on the unique patterns, lines, and formations present in your palm, 
      which reflect your individual journey and potential.
    </p>
    <p class="analysis-paragraph">
      Remember that while your palm reveals natural tendencies and possibilities, you always have free will to 
      shape your destiny. This reading should be viewed as a tool for self-awareness and personal growth rather 
      than a fixed prediction of your future.
    </p>
  </div>`;
    }
  
    // Add the main content sections
    content.sections.forEach((section: any, index: number) => {
      if (isDetailed) {
        htmlContent += `
  <div class="chapter">
    <h2>${section.name}</h2>
    <p class="analysis-paragraph">
      This section provides in-depth analysis of your ${section.name.toLowerCase()} as revealed by your palm's unique characteristics.
      The following insights are based on the specific patterns observed in your palm lines, mounts, and special markings.
    </p>`;
      } else {
        htmlContent += `
  <div class="section">
    <h2>${section.name}</h2>
    <p class="analysis-paragraph">
      This section examines your ${section.name.toLowerCase()} as revealed through the distinct patterns in your palm.
      These insights provide valuable guidance for personal growth and self-understanding.
    </p>`;
      }

      // Add insights with expanded content for both reports
      section.insights.forEach((insight: string) => {
        if (isDetailed) {
          htmlContent += `
    <div class="subsection">
      <h3>${insight}</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          Your palm reveals strong indicators of ${insight.toLowerCase()}. This is evident from the 
          ${getRandomPalmFeature()} observed in your palm, which is typically associated with 
          ${getRandomTrait(insight)}. This trait manifests in your life through your ability to 
          ${getRandomAbility(insight)}.
        </p>
        <p class="analysis-paragraph">
          Historical palmistry texts associate this pattern with individuals who excel in 
          ${getRandomField(insight)}. You may find that you naturally gravitate toward roles and 
          situations that allow you to express this quality.
        </p>
        <p class="analysis-paragraph">
          People with similar palm patterns often demonstrate exceptional ${getRandomSkill(insight)} 
          when faced with challenges. This can be particularly valuable in your 
          ${getRandomLifeArea()} where this trait helps you navigate complex situations.
        </p>
        <p class="analysis-paragraph">
          To fully leverage this strength, consider engaging in activities that develop your 
          ${getRandomDevelopmentArea(insight)}. This will help you channel this natural ability 
          in the most productive and fulfilling ways.
        </p>
      </div>
    </div>`;
        } else {
          // Enhanced basic report with more content, not just headings
          htmlContent += `
    <div class="insight">
      <div class="insight-title">${insight}</div>
      <div class="insight-content">
        <p>Your palm indicates a natural inclination toward ${insight.toLowerCase()}, as shown by the ${getRandomPalmFeature()} in your palm.</p>
        <p>This suggests that you have a strong capacity for ${getRandomTrait(insight.toLowerCase())} in your daily life and interactions.</p>
        <p>Consider how you might further develop this quality to enhance your personal and professional growth.</p>
      </div>
    </div>`;
        }
      });

      // Add extra content for detailed reports to fill pages
      if (isDetailed) {
        htmlContent += `
    <div class="subsection">
      <h3>Developmental Considerations</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          While your palm shows natural strengths in these areas, there are opportunities for growth and 
          development. By consciously working on these aspects, you can enhance your natural abilities and 
          overcome potential challenges.
        </p>
        <p class="analysis-paragraph">
          Consider incorporating practices that develop your ${getRandomDevelopmentArea(section.name)}. 
          This can help you achieve greater balance and fulfillment in this area of your life.
        </p>
      </div>
    </div>

    <div class="subsection">
      <h3>Historical Context</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          In traditional palmistry, the patterns observed in your palm related to ${section.name.toLowerCase()} 
          have been associated with ${getRandomHistoricalContext()}. These interpretations have evolved over 
          centuries of palmistry practice across different cultures.
        </p>
        <p class="analysis-paragraph">
          Modern interpretations integrate psychological understanding with these traditional readings, providing 
          a more comprehensive view of how these traits manifest in contemporary life.
        </p>
      </div>
    </div>

    <div class="subsection">
      <h3>Future Potential</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          The development of your ${section.name.toLowerCase()} appears to have significant potential for growth 
          in the coming years. The ${getRandomPalmFeature()} suggests that you will likely experience important 
          developments in this area within the next 2-5 years.
        </p>
        <p class="analysis-paragraph">
          Being aware of these potential developments can help you prepare and make the most of opportunities 
          as they arise. Stay attentive to situations that allow you to express and develop these aspects of yourself.
        </p>
      </div>
    </div>`;
      }

      htmlContent += `
  </div>`;
    });

    // Add future timeline predictions and conclusion for detailed reports
    if (isDetailed) {
      htmlContent += `
  <div class="chapter">
    <h2>Future Timeline Predictions</h2>
    <p class="analysis-paragraph">
      Based on the unique patterns in your palm, we can identify potential development periods and opportunities 
      in your future. These predictions are based on traditional palmistry interpretations of time markers in your palm.
    </p>
    
    <div class="subsection">
      <h3>Next 6 Months</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          The immediate future suggests a period of ${getRandomTimePeriod("short")}. This is indicated by the 
          ${getRandomPalmFeature()} observed in your palm. During this time, you may experience significant 
          developments related to your ${getRandomLifeArea()}.
        </p>
        <p class="analysis-paragraph">
          To make the most of this period, focus on developing your ${getRandomSkill("Adaptability")} and remain 
          open to unexpected opportunities. Your natural ${getRandomTrait("Flexibility")} will serve you well during this time.
        </p>
      </div>
    </div>
    
    <div class="subsection">
      <h3>1-2 Years</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          Looking further ahead, the next 1-2 years appear to bring ${getRandomTimePeriod("medium")}. 
          Your palm indicates potential for significant growth in your ${getRandomLifeArea()} during this period.
        </p>
        <p class="analysis-paragraph">
          This may be an excellent time to pursue goals related to ${getRandomField("Leadership")}. The alignment 
          of several indicators in your palm suggests favorable conditions for advancement in this area.
        </p>
      </div>
    </div>
    
    <div class="subsection">
      <h3>3-5 Years</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          The 3-5 year timeframe shows signs of ${getRandomTimePeriod("long")}. This period may bring important 
          developments in your ${getRandomLifeArea()} and ${getRandomLifeArea()}.
        </p>
        <p class="analysis-paragraph">
          Your palm suggests that decisions made during this period will have lasting impacts on your life direction. 
          Trust your ${getRandomTrait("Intuition")} and rely on your natural ${getRandomSkill("Strategic Thinking")}.
        </p>
      </div>
    </div>
    
    <div class="subsection">
      <h3>5+ Years</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          The long-term future indicated by your palm suggests a period of ${getRandomTimePeriod("very long")}. 
          The structure and quality of your palm lines indicate potential for significant achievement and fulfillment.
        </p>
        <p class="analysis-paragraph">
          This period may bring opportunities to integrate various aspects of your life into a cohesive whole. 
          Your ${getRandomSkill("Wisdom")} and accumulated experience will be valuable assets during this time.
        </p>
      </div>
    </div>
  </div>

  <div class="chapter">
    <h2>Past Life Influences</h2>
    <p class="analysis-paragraph">
      While modern palmistry focuses primarily on present characteristics and future potentials, some traditions 
      believe that certain rare markings in the palm can indicate influences from past lives or ancestral patterns.
    </p>
    
    <div class="subsection">
      <h3>Past Talents & Abilities</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          Certain unusual formations in your palm may indicate talents or abilities that come naturally to you from
          past experiences. The ${getRandomPalmFeature()} suggests an affinity for ${getRandomField("Creative")}.
        </p>
        <p class="analysis-paragraph">
          You may find that you have an unexplained familiarity or comfort with certain activities or environments
          that could be connected to these deep-seated abilities.
        </p>
      </div>
    </div>
    
    <div class="subsection">
      <h3>Karmic Patterns</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          Your palm contains what some palmists would consider karmic markers, particularly in the
          ${getRandomPalmFeature()} area. These suggest themes that may recur in your life as opportunities for 
          growth and resolution.
        </p>
        <p class="analysis-paragraph">
          Pay special attention to situations involving ${getRandomLifeArea()} and ${getRandomLifeArea()}, as these
          may be areas where you're working through important life lessons.
        </p>
      </div>
    </div>
    
    <div class="subsection">
      <h3>Soul Purpose Indicators</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          The unique combination of your fate line and heart line suggests a soul purpose connected to
          ${getRandomField("Emotional")}. This may manifest as a natural inclination toward helping others
          or creating meaningful connections.
        </p>
        <p class="analysis-paragraph">
          When you engage in activities aligned with this purpose, you'll likely experience a profound sense of
          fulfillment and rightness that goes beyond ordinary satisfaction.
        </p>
      </div>
    </div>
  </div>

  <div class="chapter">
    <h2>Chakra Analysis</h2>
    <p class="analysis-paragraph">
      In some palmistry traditions, certain areas of the hand correspond to energy centers or chakras in the body.
      Your palm reveals interesting patterns related to your energetic balance.
    </p>
    
    <div class="subsection">
      <h3>Root Chakra (Base of Palm)</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          The base of your palm shows strong, well-defined lines indicating a generally balanced root chakra.
          This suggests you have a good foundation of security and stability in your life, though occasional
          stress may temporarily disrupt this balance.
        </p>
        <p class="analysis-paragraph">
          Practices that ground you, such as spending time in nature or engaging in physical activity, can help
          maintain and strengthen this energetic balance.
        </p>
      </div>
    </div>
    
    <div class="subsection">
      <h3>Heart Chakra (Center of Palm)</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          The center of your palm and your heart line show interesting patterns that suggest an active but
          sometimes fluctuating heart chakra energy. Your capacity for compassion and connection is strong,
          but you may sometimes protect yourself by temporarily closing this energy center.
        </p>
        <p class="analysis-paragraph">
          Practices involving giving and receiving love unconditionally can help balance this energy center
          and enhance your already significant capacity for meaningful relationships.
        </p>
      </div>
    </div>
    
    <div class="subsection">
      <h3>Third Eye Chakra (Mount of Jupiter)</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          The mount of Jupiter in your palm shows markings associated with an active third eye chakra. This suggests
          a natural intuitive ability and capacity for insight that extends beyond analytical thinking.
        </p>
        <p class="analysis-paragraph">
          You likely have experiences where you "just know" something without being able to explain how. Developing
          this intuitive capacity through meditation or mindfulness practices could enhance this natural gift.
        </p>
      </div>
    </div>
  </div>

  <div class="chapter">
    <h2>Spiritual Development</h2>
    <p class="analysis-paragraph">
      Your palm contains indicators related to your spiritual journey and potential for inner growth.
      These are found primarily in the subtle markings and relationships between major lines.
    </p>
    
    <div class="subsection">
      <h3>Spiritual Awareness</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          The ${getRandomPalmFeature()} in your palm indicates a natural capacity for spiritual awareness and
          connection to something greater than yourself. This suggests you have the ability to perceive deeper
          meanings and patterns in everyday experiences.
        </p>
        <p class="analysis-paragraph">
          Your spiritual journey may include periods of questioning and seeking, alternating with periods of
          clarity and connection. This rhythm is healthy and contributes to authentic spiritual growth.
        </p>
      </div>
    </div>
    
    <div class="subsection">
      <h3>Intuitive Gifts</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          Several markers in your palm suggest intuitive gifts, particularly related to ${getRandomLifeArea()}.
          You may find that you have insights or "gut feelings" about situations that later prove accurate.
        </p>
        <p class="analysis-paragraph">
          Developing a practice of listening to and honoring these intuitive impressions can strengthen this
          natural ability and help you navigate life choices with greater confidence and alignment.
        </p>
      </div>
    </div>
    
    <div class="subsection">
      <h3>Path of Service</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          The configuration of your heart and fate lines suggests that service to others is an important aspect
          of your spiritual development. You may find the greatest fulfillment when using your gifts to benefit
          others in some way.
        </p>
        <p class="analysis-paragraph">
          This doesn't necessarily mean formal volunteer work or selfless sacrifice - your service might
          express through your career, creative endeavors, or personal relationships where your unique gifts
          make a positive difference.
        </p>
      </div>
    </div>
  </div>

  <div class="chapter">
    <h2>Ancestral Connections</h2>
    <p class="analysis-paragraph">
      Some palmistry traditions consider certain patterns to be inherited or influenced by ancestral factors.
      Your palm shows several interesting features in this regard.
    </p>
    
    <div class="subsection">
      <h3>Inherited Traits</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          The shape of your fingers and certain baseline patterns in your palm suggest inherited traits related to
          ${getRandomTrait("Leadership")} and ${getRandomTrait("Creativity")}. These qualities may run in your family
          line, whether or not they've been consciously recognized or developed.
        </p>
        <p class="analysis-paragraph">
          You might notice echoes of these traits in family members across different generations, expressed in
          various ways according to individual circumstances and cultural contexts.
        </p>
      </div>
    </div>
    
    <div class="subsection">
      <h3>Family Patterns</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          Certain markers in your palm suggest awareness of family patterns, particularly around ${getRandomLifeArea()}.
          You may have an inherent understanding of the unspoken dynamics in your family system and the ability to
          see beyond surface behaviors to underlying motivations and needs.
        </p>
        <p class="analysis-paragraph">
          This awareness puts you in a position to potentially heal or transform limiting family patterns, creating
          new possibilities for yourself and potentially for future generations.
        </p>
      </div>
    </div>
    
    <div class="subsection">
      <h3>Ancestral Gifts</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          The ${getRandomPalmFeature()} in your palm is sometimes associated with special gifts or abilities that
          have been present in your ancestral line. This might manifest as a natural talent or affinity that seems
          to come from "nowhere" but actually represents the fruition of generations of development.
        </p>
        <p class="analysis-paragraph">
          Honoring and developing these gifts can be a way of honoring your ancestors and bringing their positive
          legacy forward into the present and future.
        </p>
      </div>
    </div>
  </div>

  <div class="chapter">
    <h2>Conclusion & Recommendations</h2>
    <p class="analysis-paragraph">
      Your palm reading reveals a unique combination of traits, potentials, and life patterns that reflect your 
      individual journey. By understanding these innate tendencies, you can make more informed choices that align 
      with your natural strengths and help you navigate potential challenges.
    </p>
    
    <div class="subsection">
      <h3>Key Strengths to Leverage</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          Based on your palm analysis, your most significant strengths appear to be in areas related to 
          ${getRandomTrait("Leadership")}, ${getRandomTrait("Creativity")}, and ${getRandomTrait("Emotional Intelligence")}. 
          Finding ways to incorporate these strengths into your daily life and long-term plans will likely lead to 
          greater fulfillment and success.
        </p>
      </div>
    </div>
    
    <div class="subsection">
      <h3>Areas for Development</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          While your palm shows many natural strengths, there are also opportunities for growth in 
          ${getRandomDevelopmentArea("Balance")}, ${getRandomDevelopmentArea("Patience")}, and 
          ${getRandomDevelopmentArea("Self-reflection")}. By consciously developing these areas, you can achieve 
          greater balance and overcome potential obstacles in your path.
        </p>
      </div>
    </div>
    
    <div class="subsection">
      <h3>Final Thoughts</h3>
      <div class="detailed-insight">
        <p class="analysis-paragraph">
          Remember that while your palm reveals natural tendencies and potential paths, you always retain the power 
          of choice. Use this reading as a tool for self-awareness and personal growth rather than as a fixed prediction 
          of your future.
        </p>
        <p class="analysis-paragraph">
          By understanding your innate traits and potential future developments, you can make more conscious choices 
          that align with your authentic self and desired life direction. Your palm reading is a map, but you are the 
          navigator of your journey.
        </p>
      </div>
    </div>
  </div>`;
    }

    htmlContent += `
  <div class="footer">
    This is a ${isDetailed ? "premium" : "basic"} PDF report generated based on palm analysis.
    Copyright © ${new Date().getFullYear()} PalmReading.ai
  </div>
</body>
</html>`;
    
    // Use the printJS functionality to print HTML as PDF
    return printHTMLAsPDF(htmlContent, isDetailed ? 'complete-palm-reading-report.pdf' : 'basic-palm-reading-report.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Helper functions to generate varied content for the detailed report
function getRandomPalmFeature() {
  const features = [
    "strong head line", "curved heart line", "deep life line", "prominent fate line", 
    "well-defined Apollo line", "distinct Mercury line", "clear marriage line",
    "unique star formation", "rare island pattern", "distinctive square marking",
    "special trident formation", "unusual triangle pattern", "defined Venus mount",
    "prominent Jupiter mount", "well-developed Apollo mount"
  ];
  return features[Math.floor(Math.random() * features.length)];
}

function getRandomTrait(baseInsight: string) {
  const traits: Record<string, string[]> = {
    "Leadership": ["decisive action", "strategic vision", "inspirational influence", "confident direction"],
    "Creativity": ["innovative thinking", "artistic expression", "original problem-solving", "imaginative approaches"],
    "Emotional Intelligence": ["empathetic understanding", "social awareness", "emotional regulation", "interpersonal sensitivity"],
    "default": ["personal resilience", "adaptable thinking", "balanced perspective", "holistic understanding"]
  };
  
  // Try to match the insight to a specific trait category, otherwise use default
  const key = Object.keys(traits).find(k => baseInsight.includes(k)) || "default";
  const options = traits[key];
  return options[Math.floor(Math.random() * options.length)];
}

function getRandomAbility(baseInsight: string) {
  const abilities: Record<string, string[]> = {
    "Leadership": ["make difficult decisions under pressure", "inspire others to achieve their best", "see the big picture while managing details", "build effective teams"],
    "Creativity": ["think outside conventional boundaries", "connect seemingly unrelated concepts", "find innovative solutions to complex problems", "express ideas in unique ways"],
    "Emotional": ["understand others' perspectives deeply", "navigate complex social dynamics", "build meaningful relationships", "communicate with authenticity"],
    "default": ["adapt to changing circumstances", "balance multiple priorities effectively", "integrate different aspects of your life", "maintain focus through challenges"]
  };
  
  let key = "default";
  Object.keys(abilities).forEach(k => {
    if (baseInsight.includes(k)) key = k;
  });
  
  const options = abilities[key];
  return options[Math.floor(Math.random() * options.length)];
}

function getRandomField(baseInsight: string) {
  const fields: Record<string, string[]> = {
    "Leadership": ["management", "entrepreneurship", "organizational development", "strategic planning"],
    "Creative": ["design", "innovation", "artistic endeavors", "content creation"],
    "Emotional": ["counseling", "relationship building", "team development", "conflict resolution"],
    "Financial": ["investment strategy", "financial planning", "resource management", "wealth building"],
    "Career": ["professional development", "career advancement", "workplace dynamics", "professional networking"],
    "default": ["personal development", "skill acquisition", "knowledge expansion", "expertise building"]
  };
  
  let key = "default";
  Object.keys(fields).forEach(k => {
    if (baseInsight.includes(k)) key = k;
  });
  
  const options = fields[key];
  return options[Math.floor(Math.random() * options.length)];
}

function getRandomSkill(baseInsight: string) {
  const skills = [
    "adaptability", "resilience", "strategic thinking", "intuitive understanding",
    "creative problem-solving", "emotional awareness", "interpersonal communication",
    "analytical thinking", "pattern recognition", "decisive action", "collaborative ability",
    "persuasive communication", "mindful awareness", "organizational ability"
  ];
  return skills[Math.floor(Math.random() * skills.length)];
}

function getRandomLifeArea() {
  const areas = [
    "career", "relationships", "personal development", "financial life",
    "health and wellbeing", "creative pursuits", "spiritual growth", "family life",
    "social connections", "intellectual development", "professional advancement"
  ];
  return areas[Math.floor(Math.random() * areas.length)];
}

function getRandomDevelopmentArea(baseInsight: string) {
  const areas = [
    "emotional resilience", "strategic planning", "creative expression", "interpersonal communication",
    "self-reflection", "technical competence", "leadership presence", "adaptability",
    "mindful awareness", "analytical thinking", "balanced perspective", "practical implementation"
  ];
  return areas[Math.floor(Math.random() * areas.length)];
}

function getRandomHistoricalContext() {
  const contexts = [
    "individuals destined for leadership roles in ancient civilizations",
    "those with natural diplomatic abilities in medieval court settings",
    "people with inherent creative gifts in Renaissance society",
    "individuals with natural healing abilities in traditional cultures",
    "those with spiritual insight in ancient mystery schools",
    "people with natural trading and mercantile abilities in historical commerce",
    "individuals with innate strategic military thinking in classical times",
    "those with natural scholarly aptitude in ancient learning traditions"
  ];
  return contexts[Math.floor(Math.random() * contexts.length)];
}

function getRandomTimePeriod(timeframe: string) {
  const periods: Record<string, string[]> = {
    "short": ["transition and adjustment", "new beginnings", "intense learning", "important decision-making"],
    "medium": ["steady growth and development", "relationship building", "skill mastery", "opportunity expansion"],
    "long": ["significant achievement", "major life transitions", "goal realization", "identity transformation"],
    "very long": ["legacy building", "wisdom integration", "life purpose fulfillment", "holistic life balance"]
  };
  
  const options = periods[timeframe] || periods.short;
  return options[Math.floor(Math.random() * options.length)];
}

// Function to print HTML as PDF using browser's print functionality
export const printHTMLAsPDF = (htmlContent: string, filename: string) => {
  try {
    console.log('Creating and printing HTML as PDF...');
    
    // Create an iframe to host the content
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
    
    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!iframeDocument) {
      throw new Error('Could not create iframe document');
    }
    
    // Write content to iframe
    iframeDocument.open();
    iframeDocument.write(htmlContent);
    iframeDocument.close();
    
    // Add CSS for print
    const style = iframeDocument.createElement('style');
    style.textContent = `
      @media print {
        @page {
          size: A4;
          margin: 0.5cm;
        }
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
    iframeDocument.head.appendChild(style);
    
    // Change filename
    const originalDocTitle = document.title;
    document.title = filename;
    
    // Wait for resources to load
    setTimeout(() => {
      try {
        // Use the iframe's window to print
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        
        // Cleanup
        setTimeout(() => {
          document.body.removeChild(iframe);
          document.title = originalDocTitle;
          
          toast({
            title: "Success",
            description: `Your ${filename} is ready for download.`,
          });
          
          console.log('PDF generation complete');
        }, 1000);
      } catch (printError) {
        console.error('Error during printing:', printError);
        document.body.removeChild(iframe);
        document.title = originalDocTitle;
        throw printError;
      }
    }, 1000);
    
    return true;
  } catch (error) {
    console.error('Error creating PDF:', error);
    throw error;
  }
};

// Additional backup methods in case the main method fails
const downloadTextAsPDF = async (text: string, filename: string) => {
  try {
    console.log('Attempting to download text as PDF using jsPDF...');
    
    const jsPDF = (await import('jspdf')).default;
    const pdf = new jsPDF();
    
    pdf.text(text, 10, 10);
    pdf.save(filename);

    toast({
      title: "Success",
      description: `Your ${filename} is ready for
