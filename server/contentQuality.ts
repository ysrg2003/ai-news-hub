/**
 * Content Quality Scoring System
 * Evaluates article quality based on multiple factors
 */

export interface QualityScore {
  overall: number;
  readability: number;
  structure: number;
  seo: number;
  engagement: number;
  details: string[];
}

/**
 * Calculate readability score
 */
function calculateReadabilityScore(content: string): number {
  let score = 100;

  // Check paragraph length (should be 3-5 sentences)
  const paragraphs = content.split("\n\n").filter((p) => p.trim());
  const avgParagraphLength = paragraphs.reduce((sum, p) => sum + p.split(".").length, 0) / paragraphs.length;

  if (avgParagraphLength < 2 || avgParagraphLength > 8) {
    score -= 10;
  }

  // Check sentence length (should average 15-20 words)
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim());
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(" ").length, 0) / sentences.length;

  if (avgSentenceLength < 10 || avgSentenceLength > 30) {
    score -= 10;
  }

  // Check for passive voice (should be < 20%)
  const passivePattern = /\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi;
  const passiveCount = (content.match(passivePattern) || []).length;
  const passivePercentage = (passiveCount / sentences.length) * 100;

  if (passivePercentage > 20) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate structure score
 */
function calculateStructureScore(
  title: string,
  excerpt: string,
  content: string,
  headings: number
): number {
  let score = 100;

  // Check title length (should be 50-70 characters)
  if (title.length < 40 || title.length > 80) {
    score -= 15;
  }

  // Check excerpt length (should be 150-160 characters)
  if (excerpt.length < 120 || excerpt.length > 200) {
    score -= 10;
  }

  // Check content length (should be at least 800 words)
  const wordCount = content.split(" ").length;
  if (wordCount < 500) {
    score -= 20;
  } else if (wordCount > 5000) {
    score -= 10;
  }

  // Check for headings (should have 3-5 main headings)
  if (headings < 2 || headings > 8) {
    score -= 15;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate SEO score
 */
function calculateSEOScore(
  title: string,
  excerpt: string,
  content: string,
  keywords: string[]
): number {
  let score = 100;

  // Check for keywords in title
  const titleHasKeyword = keywords.some((k) => title.toLowerCase().includes(k.toLowerCase()));
  if (!titleHasKeyword && keywords.length > 0) {
    score -= 15;
  }

  // Check for keywords in content
  const keywordMatches = keywords.filter((k) =>
    content.toLowerCase().includes(k.toLowerCase())
  ).length;

  if (keywordMatches < keywords.length * 0.5) {
    score -= 15;
  }

  // Check for meta description
  if (excerpt.length < 120 || excerpt.length > 160) {
    score -= 10;
  }

  // Check for internal links (should have at least 2-3)
  const linkPattern = /\[([^\]]+)\]\(\/[^)]+\)/g;
  const linkCount = (content.match(linkPattern) || []).length;

  if (linkCount < 2) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate engagement score
 */
function calculateEngagementScore(content: string): number {
  let score = 100;

  // Check for lists
  const listPattern = /^[-*]\s/gm;
  const listCount = (content.match(listPattern) || []).length;

  if (listCount < 1) {
    score -= 10;
  }

  // Check for quotes
  const quotePattern = /^>\s/gm;
  const quoteCount = (content.match(quotePattern) || []).length;

  if (quoteCount < 1) {
    score -= 10;
  }

  // Check for code blocks
  const codePattern = /```/g;
  const codeCount = (content.match(codePattern) || []).length;

  if (codeCount < 2) {
    score -= 5;
  }

  // Check for bold/emphasis
  const emphasisPattern = /\*\*|__/g;
  const emphasisCount = (content.match(emphasisPattern) || []).length;

  if (emphasisCount < 3) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate overall quality score
 */
export function calculateQualityScore(
  title: string,
  excerpt: string,
  content: string,
  keywords: string[] = []
): QualityScore {
  const headings = (content.match(/^#+\s/gm) || []).length;

  const readabilityScore = calculateReadabilityScore(content);
  const structureScore = calculateStructureScore(title, excerpt, content, headings);
  const seoScore = calculateSEOScore(title, excerpt, content, keywords);
  const engagementScore = calculateEngagementScore(content);

  const overallScore = Math.round(
    (readabilityScore + structureScore + seoScore + engagementScore) / 4
  );

  const details: string[] = [];

  if (readabilityScore < 70) {
    details.push("⚠️ Readability score is low. Consider simplifying sentences.");
  }

  if (structureScore < 70) {
    details.push("⚠️ Content structure needs improvement. Add more headings and organize better.");
  }

  if (seoScore < 70) {
    details.push("⚠️ SEO score is low. Include more keywords and internal links.");
  }

  if (engagementScore < 70) {
    details.push("⚠️ Engagement score is low. Add more lists, quotes, and emphasis.");
  }

  if (overallScore >= 80) {
    details.push("✅ Content quality is excellent!");
  } else if (overallScore >= 70) {
    details.push("✅ Content quality is good.");
  } else if (overallScore >= 60) {
    details.push("⚠️ Content quality is acceptable but could be improved.");
  } else {
    details.push("❌ Content quality is below standards. Major revisions needed.");
  }

  return {
    overall: overallScore,
    readability: Math.round(readabilityScore),
    structure: Math.round(structureScore),
    seo: Math.round(seoScore),
    engagement: Math.round(engagementScore),
    details,
  };
}

/**
 * Check if content meets minimum quality standards
 */
export function meetsQualityStandards(score: QualityScore, minimumScore: number = 70): boolean {
  return score.overall >= minimumScore;
}
