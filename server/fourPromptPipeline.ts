import { invokeLLM } from "./server/_core/llm";
import { z } from "zod";

/**
 * Four-Prompt Content Generation Pipeline
 * Implements a sophisticated 4-step process for generating high-quality AI news articles
 * Designed to work within Gemini API free tier constraints (15 RPM)
 */

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const StorySchema = z.object({
  title: z.string().min(10).max(200),
  summary: z.string().min(50).max(500),
  sources: z.array(z.string()).min(2).max(5),
  keyPoints: z.array(z.string()).min(3).max(7),
  relevance: z.number().min(0).max(100),
});

const DraftSchema = z.object({
  title: z.string().min(10).max(200),
  excerpt: z.string().min(50).max(300),
  content: z.string().min(1000).max(5000),
  sections: z.array(
    z.object({
      heading: z.string(),
      content: z.string(),
    })
  ),
  citations: z.array(z.string()),
});

const OptimizedSchema = z.object({
  title: z.string().min(10).max(60),
  metaDescription: z.string().min(50).max(160),
  keywords: z.array(z.string()).min(5).max(10),
  content: z.string().min(1000),
  internalLinks: z.array(
    z.object({
      text: z.string(),
      url: z.string(),
    })
  ),
  readingTime: z.number().min(1).max(30),
});

const ReviewSchema = z.object({
  approved: z.boolean(),
  qualityScore: z.number().min(0).max(100),
  issues: z.array(z.string()),
  suggestions: z.array(z.string()),
  finalContent: z.string(),
});

// ============================================================================
// PROMPT A: STORY DISCOVERY & SOURCE IDENTIFICATION
// ============================================================================

export async function promptA_DiscoverStory(category: string, articleType: "trending" | "evergreen") {
  const systemPrompt = `You are an expert AI news researcher. Your task is to discover compelling stories and identify authoritative sources for AI news articles.

For ${articleType} content in the "${category}" category:
- ${articleType === "trending" ? "Focus on recent developments, breaking news, and emerging trends from the past 7 days" : "Focus on timeless topics, foundational concepts, and evergreen knowledge"}
- Identify 2-5 authoritative sources (academic papers, industry reports, news outlets)
- Provide a compelling story angle that would interest AI professionals and enthusiasts
- Rate the relevance and timeliness of the story (0-100)

Return ONLY valid JSON matching this structure:
{
  "title": "Compelling story title",
  "summary": "2-3 sentence summary of the story",
  "sources": ["source1", "source2", "source3"],
  "keyPoints": ["point1", "point2", "point3"],
  "relevance": 85
}`;

  const userPrompt = `Discover a ${articleType} story for the ${category} category. The story should be:
- Newsworthy and engaging
- Relevant to current AI developments
- Supported by credible sources
- Interesting to AI professionals and enthusiasts`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = response.choices[0]?.message.content || "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : "{}";
    const parsed = JSON.parse(jsonStr);

    return StorySchema.parse(parsed);
  } catch (error) {
    console.error("Prompt A failed:", error);
    throw new Error(`Story discovery failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// ============================================================================
// PROMPT B: ARTICLE DRAFT GENERATION
// ============================================================================

export async function promptB_GenerateDraft(story: z.infer<typeof StorySchema>) {
  const systemPrompt = `You are an expert AI journalist and technical writer. Your task is to write a comprehensive, well-researched article based on the provided story.

Guidelines:
- Write in clear, professional language suitable for AI professionals and enthusiasts
- Include specific examples, statistics, and technical details
- Organize content into logical sections with clear headings
- Cite sources appropriately
- Maintain a balanced, objective tone
- Target length: 1500-2500 words

Return ONLY valid JSON matching this structure:
{
  "title": "Article title",
  "excerpt": "150-200 word summary",
  "content": "Full article content with sections",
  "sections": [{"heading": "Section 1", "content": "..."}],
  "citations": ["citation1", "citation2"]
}`;

  const userPrompt = `Write a comprehensive article based on this story:
Title: ${story.title}
Summary: ${story.summary}
Key Points: ${story.keyPoints.join(", ")}
Sources: ${story.sources.join(", ")}

Create a well-structured, engaging article that explores the story in depth.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = response.choices[0]?.message.content || "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : "{}";
    const parsed = JSON.parse(jsonStr);

    return DraftSchema.parse(parsed);
  } catch (error) {
    console.error("Prompt B failed:", error);
    throw new Error(`Draft generation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// ============================================================================
// PROMPT C: STRATEGIC EDITING & SEO OPTIMIZATION
// ============================================================================

export async function promptC_OptimizeForSEO(draft: z.infer<typeof DraftSchema>, category: string) {
  const systemPrompt = `You are an expert SEO specialist and content strategist. Your task is to optimize the article for search engines while maintaining quality and readability.

Guidelines:
- Optimize title for search (50-60 characters)
- Create compelling meta description (150-160 characters)
- Identify 5-10 relevant keywords
- Improve content for keyword integration
- Suggest internal linking opportunities
- Calculate reading time

Return ONLY valid JSON matching this structure:
{
  "title": "SEO-optimized title",
  "metaDescription": "Meta description",
  "keywords": ["keyword1", "keyword2"],
  "content": "Optimized content",
  "internalLinks": [{"text": "link text", "url": "/article/slug"}],
  "readingTime": 8
}`;

  const userPrompt = `Optimize this article for SEO:
Title: ${draft.title}
Category: ${category}
Content: ${draft.content.substring(0, 1000)}...

Improve the title, create a meta description, identify keywords, and suggest internal linking opportunities.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = response.choices[0]?.message.content || "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : "{}";
    const parsed = JSON.parse(jsonStr);

    return OptimizedSchema.parse(parsed);
  } catch (error) {
    console.error("Prompt C failed:", error);
    throw new Error(`SEO optimization failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// ============================================================================
// PROMPT D: HUMAN-LEVEL FINAL REVIEW
// ============================================================================

export async function promptD_FinalReview(
  optimized: z.infer<typeof OptimizedSchema>,
  category: string
) {
  const systemPrompt = `You are an expert editor and quality assurance specialist. Your task is to perform a final review of the article.

Check for:
- Factual accuracy and credibility
- Proper grammar and spelling
- Logical flow and coherence
- Engagement and readability
- Compliance with editorial standards
- Plagiarism indicators (flag if content seems generic)
- Quality score (0-100)

Return ONLY valid JSON matching this structure:
{
  "approved": true/false,
  "qualityScore": 85,
  "issues": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "finalContent": "Final approved content"
}`;

  const userPrompt = `Review this article for publication:
Title: ${optimized.title}
Category: ${category}
Content: ${optimized.content.substring(0, 1500)}...

Provide a quality assessment and final approval recommendation.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = response.choices[0]?.message.content || "{}";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : "{}";
    const parsed = JSON.parse(jsonStr);

    return ReviewSchema.parse(parsed);
  } catch (error) {
    console.error("Prompt D failed:", error);
    throw new Error(`Final review failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// ============================================================================
// COMPLETE PIPELINE
// ============================================================================

export interface PipelineResult {
  success: boolean;
  story?: z.infer<typeof StorySchema>;
  draft?: z.infer<typeof DraftSchema>;
  optimized?: z.infer<typeof OptimizedSchema>;
  review?: z.infer<typeof ReviewSchema>;
  error?: string;
  executionTime: number;
}

export async function runFullPipeline(
  category: string,
  articleType: "trending" | "evergreen"
): Promise<PipelineResult> {
  const startTime = Date.now();

  try {
    console.log(`[${new Date().toISOString()}] Starting 4-prompt pipeline for ${category} (${articleType})`);

    // Step 1: Discover story
    console.log(`[${new Date().toISOString()}] Step 1: Discovering story...`);
    const story = await promptA_DiscoverStory(category, articleType);
    console.log(`[${new Date().toISOString()}] Story discovered: ${story.title}`);

    // Wait 2 seconds to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 2: Generate draft
    console.log(`[${new Date().toISOString()}] Step 2: Generating draft...`);
    const draft = await promptB_GenerateDraft(story);
    console.log(`[${new Date().toISOString()}] Draft generated: ${draft.content.length} characters`);

    // Wait 2 seconds to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 3: Optimize for SEO
    console.log(`[${new Date().toISOString()}] Step 3: Optimizing for SEO...`);
    const optimized = await promptC_OptimizeForSEO(draft, category);
    console.log(`[${new Date().toISOString()}] Content optimized: ${optimized.keywords.length} keywords`);

    // Wait 2 seconds to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Step 4: Final review
    console.log(`[${new Date().toISOString()}] Step 4: Final review...`);
    const review = await promptD_FinalReview(optimized, category);
    console.log(`[${new Date().toISOString()}] Review complete: Quality score ${review.qualityScore}`);

    const executionTime = Date.now() - startTime;

    if (!review.approved) {
      console.warn(`[${new Date().toISOString()}] Article not approved. Issues: ${review.issues.join(", ")}`);
      return {
        success: false,
        story,
        draft,
        optimized,
        review,
        error: `Article not approved. Issues: ${review.issues.join(", ")}`,
        executionTime,
      };
    }

    console.log(`[${new Date().toISOString()}] Pipeline completed successfully in ${executionTime}ms`);

    return {
      success: true,
      story,
      draft,
      optimized,
      review,
      executionTime,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] Pipeline failed:`, error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      executionTime,
    };
  }
}
