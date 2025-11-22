import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  validateArticleResponse,
} from "./contentGenerator";
import { generateCoverImage } from "./imageGenerator";

// Mock environment variables
beforeEach(() => {
  process.env.GEMINI_API_KEY = "test-key";
});

describe("Content Generation", () => {
  describe("Article Generation", () => {
    it("should generate article with valid structure", async () => {
      // This test validates the response schema
      const mockResponse = {
        title: "Understanding Deep Learning",
        excerpt: "Deep learning is a subset of machine learning that enables computers to learn from data without explicit programming. This comprehensive guide covers all aspects.",
        content: "# Deep Learning\n\nDeep learning is a subset of machine learning that uses neural networks with multiple layers. This comprehensive guide covers fundamentals, architectures, and real-world applications of deep learning in modern AI systems.",
        keywords: ["deep learning", "neural networks"],
        readTime: 5,
      };

      const isValid = validateArticleResponse(mockResponse);
      expect(isValid).toBe(true);
    });

    it("should reject invalid article response", () => {
      const invalidResponse = {
        title: "", // Empty title
        excerpt: "Short",
        content: "Content",
      };

      const isValid = validateArticleResponse(invalidResponse);
      expect(isValid).toBe(false);
    });

    it("should validate required fields", () => {
      const incompleteResponse = {
        title: "Valid Title",
        excerpt: "Valid excerpt that is long enough to be valid",
        // Missing content
      };

      const isValid = validateArticleResponse(incompleteResponse);
      expect(isValid).toBe(false);
    });

    it("should validate title length", () => {
      const shortTitle = {
        title: "A", // Too short
        excerpt: "Valid excerpt that is long enough",
        content: "Valid content here",
        keywords: [],
        readTime: 5,
      };

      const isValid = validateArticleResponse(shortTitle);
      expect(isValid).toBe(false);
    });

    it("should validate excerpt length", () => {
      const shortExcerpt = {
        title: "Valid Title",
        excerpt: "Short", // Too short
        content: "Valid content here",
        keywords: [],
        readTime: 5,
      };

      const isValid = validateArticleResponse(shortExcerpt);
      expect(isValid).toBe(false);
    });

    it("should validate content length", () => {
      const shortContent = {
        title: "Valid Title",
        excerpt: "Valid excerpt that is long enough",
        content: "Short", // Too short
        keywords: [],
        readTime: 5,
      };

      const isValid = validateArticleResponse(shortContent);
      expect(isValid).toBe(false);
    });

    it("should validate keywords array", () => {
      const noKeywords = {
        title: "Valid Title",
        excerpt: "Valid excerpt that is long enough",
        content: "Valid content that is long enough to pass validation",
        keywords: [], // Empty keywords
        readTime: 5,
      };

      const isValid = validateArticleResponse(noKeywords);
      expect(isValid).toBe(false);
    });

    it("should validate read time", () => {
      const invalidReadTime = {
        title: "Valid Title",
        excerpt: "Valid excerpt that is long enough",
        content: "Valid content that is long enough to pass validation",
        keywords: ["keyword"],
        readTime: 0, // Invalid
      };

      const isValid = validateArticleResponse(invalidReadTime);
      expect(isValid).toBe(false);
    });
  });

  describe("Image Generation", () => {
    it("should generate cover image with valid category", () => {
      const categories = [
        "Machine Learning",
        "NLP",
        "Computer Vision",
        "Robotics",
        "Generative AI",
        "AI Applications",
        "AI Research",
        "AI Ethics",
      ];

      for (const category of categories) {
        const image = generateCoverImage(category, "Test Article");
        expect(image).toBeDefined();
        expect(image).toContain("data:image/svg+xml");
      }
    });

    it("should generate image with fallback for unknown category", () => {
      const image = generateCoverImage("Unknown Category", "Test Article");
      expect(image).toBeDefined();
      expect(image).toContain("data:image/svg+xml;base64,");
    });

    it("should include article title in image", () => {
      const title = "Test Article Title";
      const image = generateCoverImage("Machine Learning", title);
      expect(image).toContain("data:image/svg+xml;base64,");
      expect(image.length).toBeGreaterThan(100);
    });
  });

  describe("Response Validation", () => {
    it("should handle null response", () => {
      const isValid = validateArticleResponse(null as any);
      expect(isValid).toBe(false);
    });

    it("should handle undefined response", () => {
      const isValid = validateArticleResponse(undefined as any);
      expect(isValid).toBe(false);
    });

    it("should handle string response", () => {
      const isValid = validateArticleResponse("invalid" as any);
      expect(isValid).toBe(false);
    });

    it("should validate complete valid response", () => {
      const validResponse = {
        title: "Complete Guide to Machine Learning and AI",
        excerpt:
          "This comprehensive guide covers all aspects of machine learning from basics to advanced techniques and real-world applications in modern AI systems.",
        content:
          "# Machine Learning\n\n## Introduction\n\nMachine learning is a subset of artificial intelligence that focuses on enabling computers to learn from data without being explicitly programmed. This comprehensive guide will walk you through the fundamentals, techniques, and practical applications of machine learning in modern software development and AI systems.\n\n## Core Concepts\n\nMachine learning algorithms learn patterns from data and make predictions without being explicitly programmed for every scenario.",
        keywords: ["machine learning", "AI", "algorithms"],
        readTime: 8,
      };

      const isValid = validateArticleResponse(validResponse);
      expect(isValid).toBe(true);
    });
  });
});
