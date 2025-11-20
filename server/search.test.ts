import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  searchArticles,
  getRecommendedArticles,
  getTrendingArticles,
  getEvergreenArticles,
  getRelatedArticles,
} from "./search";
import * as db from "./db";

// Mock the database
vi.mock("./db", () => ({
  getDb: vi.fn(),
}));

const mockArticles = [
  {
    id: 1,
    title: "Deep Learning Breakthroughs",
    excerpt: "Latest in deep learning",
    content: "Content about deep learning",
    categoryId: 1,
    articleType: "trending",
    author: "Test Author",
    readTime: 5,
  },
  {
    id: 2,
    title: "Understanding Transformers",
    excerpt: "Guide to transformers",
    content: "Content about transformers",
    categoryId: 2,
    articleType: "evergreen",
    author: "Test Author",
    readTime: 8,
  },
  {
    id: 3,
    title: "AI in Healthcare",
    excerpt: "AI applications in healthcare",
    content: "Content about AI in healthcare",
    categoryId: 1,
    articleType: "trending",
    author: "Test Author",
    readTime: 6,
  },
];

describe("Search Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("searchArticles", () => {
    it("should search articles by title", async () => {
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([mockArticles[0]]),
            }),
          }),
        }),
      };

      vi.mocked(db.getDb).mockResolvedValue(mockDb as any);

      const results = await searchArticles("Deep Learning");

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe("Deep Learning Breakthroughs");
    });

    it("should return empty array if database is unavailable", async () => {
      vi.mocked(db.getDb).mockResolvedValue(null);

      const results = await searchArticles("test");

      expect(results).toEqual([]);
    });

    it("should handle search errors gracefully", async () => {
      const mockDb = {
        select: vi.fn().mockImplementation(() => {
          throw new Error("Database error");
        }),
      };

      vi.mocked(db.getDb).mockResolvedValue(mockDb as any);

      const results = await searchArticles("test");

      expect(results).toEqual([]);
    });
  });

  describe("getRecommendedArticles", () => {
    it("should get articles from specific category", async () => {
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([mockArticles[0], mockArticles[2]]),
              }),
            }),
          }),
        }),
      };

      vi.mocked(db.getDb).mockResolvedValue(mockDb as any);

      const results = await getRecommendedArticles(1);

      expect(results).toHaveLength(2);
    });

    it("should exclude specified article ID", async () => {
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([mockArticles[0], mockArticles[2]]),
              }),
            }),
          }),
        }),
      };

      vi.mocked(db.getDb).mockResolvedValue(mockDb as any);

      const results = await getRecommendedArticles(1, 1);

      expect(results.some((a) => a.id === 1)).toBe(false);
    });

    it("should return empty array if database is unavailable", async () => {
      vi.mocked(db.getDb).mockResolvedValue(null);

      const results = await getRecommendedArticles(1);

      expect(results).toEqual([]);
    });
  });

  describe("getTrendingArticles", () => {
    it("should get trending articles", async () => {
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([mockArticles[0], mockArticles[2]]),
              }),
            }),
          }),
        }),
      };

      vi.mocked(db.getDb).mockResolvedValue(mockDb as any);

      const results = await getTrendingArticles();

      expect(results).toHaveLength(2);
      expect(results.every((a) => a.articleType === "trending")).toBe(true);
    });

    it("should respect limit parameter", async () => {
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([mockArticles[0]]),
              }),
            }),
          }),
        }),
      };

      vi.mocked(db.getDb).mockResolvedValue(mockDb as any);

      const results = await getTrendingArticles(5);

      expect(results).toHaveLength(1);
    });
  });

  describe("getEvergreenArticles", () => {
    it("should get evergreen articles", async () => {
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([mockArticles[1]]),
              }),
            }),
          }),
        }),
      };

      vi.mocked(db.getDb).mockResolvedValue(mockDb as any);

      const results = await getEvergreenArticles();

      expect(results).toHaveLength(1);
      expect(results[0].articleType).toBe("evergreen");
    });
  });

  describe("getRelatedArticles", () => {
    it("should get related articles from same category", async () => {
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([mockArticles[0], mockArticles[2]]),
              }),
            }),
          }),
        }),
      };

      vi.mocked(db.getDb).mockResolvedValue(mockDb as any);

      const results = await getRelatedArticles(1, 1);

      expect(results).toHaveLength(1);
      expect(results[0].id).not.toBe(1);
    });

    it("should exclude the current article", async () => {
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([mockArticles[0], mockArticles[2]]),
              }),
            }),
          }),
        }),
      };

      vi.mocked(db.getDb).mockResolvedValue(mockDb as any);

      const results = await getRelatedArticles(1, 1);

      expect(results.some((a) => a.id === 1)).toBe(false);
    });
  });
});
