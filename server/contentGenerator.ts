import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Schema validation for article generation
const ArticleDraftSchema = z.object({
  draftTitle: z.string(),
  draftContent: z.string(),
});

const FinalArticleSchema = z.object({
  finalTitle: z.string(),
  finalContent: z.string(),
  excerpt: z.string(),
  seo: z.object({
    metaTitle: z.string(),
    metaDescription: z.string(),
    imageAltText: z.string(),
  }),
  tags: z.array(z.string()),
  conceptualIcon: z.string(),
  futureArticleSuggestions: z.array(z.string()),
});

export type ArticleDraft = z.infer<typeof ArticleDraftSchema>;
export type FinalArticle = z.infer<typeof FinalArticleSchema>;

interface ContentGeneratorOptions {
  geminiApiKey: string;
  categoryName: string;
  articleType: "trending" | "evergreen";
  existingArticles?: Array<{
    title: string;
    slug: string;
    excerpt: string;
    tags: string[];
    articleType: string;
  }>;
}

/**
 * Step 1: Discover story or topic
 */
async function step1_DiscoverStory(
  client: GoogleGenerativeAI,
  categoryName: string,
  articleType: "trending" | "evergreen"
): Promise<string> {
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt =
    articleType === "trending"
      ? `You are an investigative tech journalist. Your mission is to find a compelling and impactful story in the "${categoryName}" field. Use your available search tool (Google Search) to search the modern Google index for a significant study, or a practical application from a leading company that has made an impact within the last few months. I don't want just a general topic; I want a narrative angle that connects the technical concept to a human impact or commercial success. Based on your research, suggest a catchy journalistic headline that reflects this story. Return only the headline as plain text.`
      : `You are an educational content editor. Your task is to choose a fundamental and evergreen topic from the "${categoryName}" field. After choosing the topic, use the search tool (Google Search) to find the latest developments or practical applications of this concept. Based on that, suggest an engaging educational headline that connects the core concept to its modern applications. Return only the headline as plain text.`;

  const response = await model.generateContent(prompt);
  const headline = response.response.text().trim();

  return headline;
}

/**
 * Step 2: Generate article draft
 */
async function step2_GenerateDraft(
  client: GoogleGenerativeAI,
  headline: string
): Promise<ArticleDraft> {
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are the Senior and Chief Editor at 'AI News Hub'. You don't just write; you build, critique, and improve in real-time. Your mission is to create a comprehensive article draft (1500-1800 words) based on the following headline: '${headline}'.

Before you write a single word, internalize this philosophy: Every sentence must serve a purpose, every paragraph must build momentum, and every section must deliver undeniable value.

---

**Section One: The Unseen Editorial Principles**
*(This is your critical lens through which you must constantly evaluate your work)*

1.  **The "So What?" Principle:** After every fact you present, ask yourself, "So, what's the significance?" and answer that question. Don't leave any information hanging.
2.  **The "Avoid the AI Voice" Principle:** Completely avoid generic and repetitive phrases (like "In today's digital age...", "The world of AI is ever-evolving...", "In conclusion..."). If you write a sentence that sounds like it came from a template, delete it and rewrite it with a confident, direct human voice.
3.  **The "Depth, Not Breadth" Principle:** Choose only 4-5 key points and delve into their analysis completely. Resist the temptation to mention everything. Quality comes from deep analysis.
4.  **The "Double Verification" Principle:** While researching, try to find two sources for important information to ensure absolute accuracy.
5.  **The "Directed Narrative" Principle:** Build the article as a narrative with a beginning (problem/opportunity), middle (exploration of solutions and challenges), and end (a vision for the future).
6.  **The "Balanced Perspective" Principle:** Always present the benefits (The Upside) and the challenges or criticisms (The Downside) of any technology to add credibility.
7.  **The "Visual Clarity of Text" Principle:** Mix short, impactful sentences with longer ones that explain complex ideas to create an enjoyable and non-monotonous reading rhythm.

---

**Section Two: The Strict Execution Checklist**
*(This is the list of technical tasks that must be executed literally, without any simplification)*

1.  **Originality and Depth:**
    *   Use the search tool (Google Search) extensively to gather data from multiple, reliable sources (studies, technical reports, articles from experts).
    *   Don't just list facts. Provide in-depth analysis, explain the 'why' and 'how', and offer unique insights not found in any other single article.
    *   The content must be 100% original and written from scratch based on your research.

2.  **Structure and Formatting:**
    *   **Engaging Introduction:** Start by grabbing the reader's attention with a story, a question, or a surprising fact. Do not use generic introductions.
    *   **Article Body:** Divide the content into logical parts using clear subheadings (H2 and H3). Each section should be self-contained but contribute to the overall narrative.
    *   **Strong Conclusion:** Summarize the main points and offer a final thought or a call to think. Avoid using the word "In conclusion".

3.  **Clarity and Readability:**
    *   Use simple, clear, and professional English. **Explain any complex technical terms in a simplified manner** as if you were explaining them to a smart, non-specialist colleague.
    *   Write short paragraphs (2-4 sentences as a general rule) to facilitate reading on all devices.
    *   Ensure the text is completely free of grammatical and spelling errors.
    *   **Use a storytelling and engaging writing style, naturally employing advanced linguistic techniques to enhance the message.**

4.  **Reader-Focused Value:**
    *   The primary goal of the article must be to educate and benefit the reader.

---

**Section Three: The Mandatory Self-Correction Loop**
*(After writing the initial draft, review it completely based on the following questions. This is not an option; it is part of the task)*

*   **Does the introduction truly engage the reader, or is it just a preamble?** If it's a preamble, rewrite it.
*   **Does each section clearly answer the "So What?" question?** If not, add the necessary analysis.
*   **Is there any sentence that sounds like "filler" or from an "AI template"?** If you find one, delete or replace it.
*   **Is the narrative coherent from beginning to end?** If not, rearrange paragraphs or add better transitions.
*   **Is the explanation of complex terms simple enough for a non-technical person?** If not, simplify it further.
*   **Does the article present a balanced perspective, or does it seem overly promotional?** If it's promotional, add a section on challenges or criticisms.

---

Start the article with the human side or the real-world impact of the story. After completing the writing and self-review process, return the final result as a JSON object containing \`draftTitle\` and \`draftContent\` (in HTML format).`;

  const response = await model.generateContent(prompt);
  const content = response.response.text();

  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract JSON from draft response");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return ArticleDraftSchema.parse(parsed);
}

/**
 * Step 3: Final editing and SEO optimization
 */
async function step3_FinalEdit(
  client: GoogleGenerativeAI,
  draft: ArticleDraft,
  existingArticles?: Array<{
    title: string;
    slug: string;
    excerpt: string;
    tags: string[];
    articleType: string;
  }>
): Promise<FinalArticle> {
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });

  const knowledgeGraph = existingArticles
    ? JSON.stringify(existingArticles.slice(0, 20))
    : "[]";

  const prompt = `You are the Strategic Editor-in-Chief of 'AI News Hub'. Your job is not just to edit this draft, but to intelligently integrate it into the site's existing knowledge network to maximize its overall value.

**Inputs:**
1.  **Current Draft:** ${JSON.stringify(draft)}
2.  **Site Database (The Knowledge Graph):** ${knowledgeGraph}

**Execute the following strategic and editorial tasks with extreme precision:**

**Section One: Article-Level Optimization**

1.  **Stellar Polish:**
    *   Review every sentence for clarity and impact. Delete unnecessary words and filler.
    *   Ensure the style is consistent and engaging from start to finish, reflecting the 'AI News Hub' identity.
    *   Perform a final check for grammatical and spelling errors.

2.  **Add Textual Rich Media Elements:**
    *   Add **bulleted or numbered lists** to break up long texts and make complex information easier to digest.
    *   Use **Blockquotes** to highlight important points or expert quotes.

3.  **Conceptual Icon Extraction:**
    *   Extract one or two English words that represent the core concept of the article (e.g., 'network', 'balance', 'security').

**Section Two: Network-Level Optimization**

4.  **Strategic Internal Linking:**
    *   **Gap Analysis:** Based on the current draft, analyze the site database. Are there concepts mentioned in the draft that are not explained in depth in existing articles?
    *   **Deep Linking:** Add 3-5 HTML links (\`<a href=... >\`) to the most relevant existing articles. Don't just link keywords; link phrases that explain a concept.
    *   **Future Article Suggestions:** Based on the gap analysis, suggest **two titles for future articles** that could be written to fill these knowledge gaps.

5.  **Article Positioning in the Network:**
    *   Analyze the article type (Trending/Evergreen) and its content.
    *   Is this article considered **"Pillar Content"** or **"Spoke Content"**?
    *   Based on this analysis, adjust the \`excerpt\` and \`tags\` to reflect its role in the network.

**Section Three: Final Publishing Package**

6.  **Create a Complete SEO Package:**
    *   \`metaTitle\`: An attractive and search-engine-friendly title (50-60 characters).
    *   \`metaDescription\`: A brief and compelling description (150-160 characters).
    *   \`imageAltText\`: A descriptive alt text for the main image.
    *   \`tags\`: A list of 5-7 optimized tags based on the analysis of the article's position in the network.

**Required Output:**
Return a final JSON object containing: \`finalTitle\`, \`finalContent\`, \`excerpt\`, \`seo\`, \`tags\`, \`conceptualIcon\`, and \`futureArticleSuggestions\` (an array of two titles).`;

  const response = await model.generateContent(prompt);
  const content = response.response.text();

  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract JSON from final edit response");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return FinalArticleSchema.parse(parsed);
}

/**
 * Main content generation function
 */
export async function generateArticle(
  options: ContentGeneratorOptions
): Promise<FinalArticle> {
  const client = new GoogleGenerativeAI(options.geminiApiKey);

  try {
    // Step 1: Discover story/topic
    console.log(`[Step 1] Discovering ${options.articleType} story for ${options.categoryName}...`);
    const headline = await step1_DiscoverStory(client, options.categoryName, options.articleType);
    console.log(`[Step 1] Headline: ${headline}`);

    // Add delay to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Step 2: Generate draft
    console.log(`[Step 2] Generating article draft...`);
    const draft = await step2_GenerateDraft(client, headline);
    console.log(`[Step 2] Draft generated: ${draft.draftTitle}`);

    // Add delay to respect rate limits
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Step 3: Final editing
    console.log(`[Step 3] Final editing and SEO optimization...`);
    const finalArticle = await step3_FinalEdit(client, draft, options.existingArticles);
    console.log(`[Step 3] Article finalized: ${finalArticle.finalTitle}`);

    return finalArticle;
  } catch (error) {
    console.error("Error generating article:", error);
    throw error;
  }
}

/**
 * Generate multiple articles with rate limiting
 */
export async function generateArticlesBatch(
  articles: ContentGeneratorOptions[],
  concurrency: number = 2
): Promise<Array<{ article: FinalArticle; options: ContentGeneratorOptions } | { error: Error; options: ContentGeneratorOptions }>> {
  const results: Array<{ article: FinalArticle; options: ContentGeneratorOptions } | { error: Error; options: ContentGeneratorOptions }> = [];
  const queue = [...articles];

  while (queue.length > 0) {
    const batch = queue.splice(0, concurrency);
    const batchResults = await Promise.allSettled(
      batch.map((options) => generateArticle(options))
    );

    batchResults.forEach((result, index) => {
      const options = batch[index]!;
      if (result.status === "fulfilled") {
        results.push({ article: result.value, options });
      } else {
        results.push({ error: result.reason, options });
      }
    });

    // Add delay between batches
    if (queue.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return results;
}
