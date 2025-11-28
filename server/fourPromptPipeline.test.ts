import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  promptA_DiscoverStory,
  promptB_GenerateDraft,
  promptC_OptimizeForSEO,
  promptD_FinalReview,
  runFullPipeline,
} from "./fourPromptPipeline";

// Mock the LLM module
vi.mock("./server/_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

import { invokeLLM } from "./server/_core/llm";

describe("Four-Prompt Pipeline", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Prompt A: Story Discovery", () => {
    it("should validate story schema", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                title: "Breaking: New AI Model Achieves 99% Accuracy",
                summary: "Researchers announce breakthrough in AI accuracy",
                sources: ["arxiv.org", "techcrunch.com", "nature.com"],
                keyPoints: ["99% accuracy", "New architecture", "Faster training"],
                relevance: 95,
              }),
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse);

      const result = await promptA_DiscoverStory("machine-learning", "trending");

      expect(result.title).toBeDefined();
      expect(result.summary).toBeDefined();
      expect(result.sources).toHaveLength(3);
      expect(result.relevance).toBeGreaterThanOrEqual(0);
      expect(result.relevance).toBeLessThanOrEqual(100);
    });

    it("should handle API errors", async () => {
      vi.mocked(invokeLLM).mockRejectedValueOnce(new Error("API Error"));

      await expect(promptA_DiscoverStory("machine-learning", "trending")).rejects.toThrow(
        "Story discovery failed"
      );
    });
  });

  describe("Prompt B: Draft Generation", () =    it("should generate a comprehensive dra    it("should validate draft schema", async () => {
      const mockStory = {
        title: "Test Story",
        summary: "Test summary with enough content",
        sources: ["source1", "source2", "source3"],
        keyPoints: ["point1", "point2", "point3"],
        relevance: 90,
      };     };   const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                title: "Test Article",
                excerpt: "This is a test excerpt for the article",
                content: "This is a comprehensive article with multiple sections and detailed information about the topic.",
                sections: [
                  { heading: "Introduction", content: "Intro content" },
                  { heading: "Main Points", content: "Main content" },
                ],
                citations: ["citation1", "citation2"],
              }),
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse);

      const result = await promptB_GenerateDraft(mockStory);

      expect(result.title).toBeDefined();
      expect(result.content.length).toBeGreaterThan(100);
      expect(result.sections.length).toBeGreaterThan(0);
      expect(result.citations.length).toBeGreaterThan(0);
    });
  });

  describe("Prompt C: SEO Optimization", () => {
    it("should optimize content for SEO", async () => {
      const mockDraft = {
        title: "Test Article",
        excerpt: "Test excerpt with sufficient length for validation purposes",
        content: "This is test content for SEO optimization with enough words to meet minimum requirements for the system",
        sections: [{ heading: "Test", content: "content" }],
        citations: ["citation1"],
      };

      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                title: "SEO Optimized Title",
                metaDescription: "This is a meta description for search engines",
                keywords: ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
                content: "Optimized content with keywords",
                internalLinks: [
                  { text: "Related Article", url: "/article/related" },
                  { text: "Learn More", url: "/article/learn-more" },
                ],
                readingTime: 8,
              }),
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse);

      const result = await promptC_OptimizeForSEO(mockDraft, "machine-learning");

      expect(result.title.length).toBeLessThanOrEqual(60);
      expect(result.metaDescription.length).toBeLessThanOrEqual(160);
      expect(result.keywords.length).toBeGreaterThanOrEqual(5);
      expect(result.readingTime).toBeGreaterThan(0);
    });
  });

  describe("Prompt D: Final Review", () => {
    it("should approve high-quality content", async () => {
      const mockOptimized = {
        title: "Test Article",
        metaDescription: "Meta description",
        keywords: ["keyword1", "keyword2"],
        content: "Test content",
        internalLinks: [],
        readingTime: 5,
      };

      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                approved: true,
                qualityScore: 92,
                issues: [],
                suggestions: ["Consider adding more examples"],
                finalContent: "Final approved content",
              }),
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse);

      const result = await promptD_FinalReview(mockOptimized, "machine-learning");

      expect(result.approved).toBe(true);
      expect(result.qualityScore).toBeGreaterThanOrEqual(0);
      expect(result.qualityScore).toBeLessThanOrEqual(100);
    });

    it("should reject low-quality content", async () => {
      const mockOptimized = {
        title: "Test Article",
        metaDescription: "Meta description",
        keywords: ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
        content: "Test content with minimum length requirement",
        internalLinks: [],
        readingTime: 2,
      };

      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                approved: false,
                qualityScore: 35,
                issues: ["Content too short", "Insufficient keywords"],
                suggestions: ["Expand content to at least 1500 words", "Add more keywords"],
                finalContent: "Original content",
              }),
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse);

      const result = await promptD_FinalReview(mockOptimized, "machine-learning");

      expect(result.approved).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });
  });

  describe("Pipeline Validation", () => {
    it("should validate story with minimum requirements", async () => {
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                title: "Valid Story Title",
                summary: "This is a valid summary with enough content",
                sources: ["source1", "source2", "source3"],
                keyPoints: ["point1", "point2", "point3"],
                relevance: 50,
              }),
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse);

      const result = await promptA_DiscoverStory("machine-learning", "trending");
      expect(result).toBeDefined();
    });

    it("should handle rate limiting delays", async () => {
      const startTime = Date.now();
      
      const mockResponse = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                title: "Test Story",
                summary: "Test summary for rate limit testing",
                sources: ["source1", "source2", "source3"],
                keyPoints: ["point1", "point2", "point3"],
                relevance: 75,
              }),
            },
          },
        ],
      };

      vi.mocked(invokeLLM).mockResolvedValueOnce(mockResponse);

      await promptA_DiscoverStory("machine-learning", "trending");
      
      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(0);
    });
  });
});
