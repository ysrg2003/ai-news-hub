#!/usr/bin/env node

/**
 * Daily Article Generation Script
 * Generates 2 articles per category (16 total) using the 4-prompt pipeline
 * Respects Gemini API free tier constraints (15 RPM)
 * 
 * Usage: node scripts/daily-generate-articles.mjs
 */

import { createJob, processPendingJobs, getQueueStats } from "../server/advancedJobQueue.ts";

const CATEGORIES = [
  "machine-learning",
  "natural-language-processing",
  "computer-vision",
  "robotics",
  "generative-ai",
  "ai-applications",
  "ai-research",
  "ai-ethics",
];

const ARTICLE_TYPES = ["trending", "evergreen"];

async function main() {
  console.log(`[${new Date().toISOString()}] Starting daily article generation...`);

  try {
    // Create jobs for each category and article type
    console.log(`[${new Date().toISOString()}] Creating ${CATEGORIES.length * ARTICLE_TYPES.length} jobs...`);

    for (const category of CATEGORIES) {
      for (const articleType of ARTICLE_TYPES) {
        const job = await createJob(category, articleType);
        console.log(`[${new Date().toISOString()}] Created job: ${job.id} (${category} - ${articleType})`);
      }
    }

    // Get queue stats
    const stats = await getQueueStats();
    console.log(`[${new Date().toISOString()}] Queue stats:`, stats);

    // Process jobs sequentially to respect rate limits
    // With 15 RPM limit and 4 prompts per article, we can do ~3 articles per minute
    // Processing 1 job at a time with 2-second delays between prompts
    console.log(`[${new Date().toISOString()}] Starting job processing...`);
    await processPendingJobs(1);

    // Get final stats
    const finalStats = await getQueueStats();
    console.log(`[${new Date().toISOString()}] Final queue stats:`, finalStats);
    console.log(`[${new Date().toISOString()}] Daily article generation completed!`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error during daily generation:`, error);
    process.exit(1);
  }
}

main();
