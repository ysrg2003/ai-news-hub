import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { cache, cacheKeys, cacheTTL } from "./cache";

describe("Cache System", () => {
  beforeEach(() => {
    cache.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("set and get", () => {
    it("should set and retrieve cache entries", () => {
      const data = { id: 1, title: "Test Article" };
      cache.set("test:1", data);

      const retrieved = cache.get("test:1");
      expect(retrieved).toEqual(data);
    });

    it("should return null for non-existent keys", () => {
      const result = cache.get("nonexistent");
      expect(result).toBeNull();
    });

    it("should respect TTL expiration", () => {
      const data = { id: 1, title: "Test" };
      cache.set("test:1", data, 1000); // 1 second TTL

      // Should exist immediately
      expect(cache.get("test:1")).toEqual(data);

      // Advance time past TTL
      vi.advanceTimersByTime(1100);

      // Should be expired
      expect(cache.get("test:1")).toBeNull();
    });

    it("should use default TTL if not specified", () => {
      const data = { id: 1 };
      cache.set("test:1", data); // Uses default TTL

      expect(cache.get("test:1")).toEqual(data);
    });
  });

  describe("has", () => {
    it("should return true for existing valid entries", () => {
      cache.set("test:1", { data: "value" });
      expect(cache.has("test:1")).toBe(true);
    });

    it("should return false for non-existent entries", () => {
      expect(cache.has("nonexistent")).toBe(false);
    });

    it("should return false for expired entries", () => {
      cache.set("test:1", { data: "value" }, 1000);
      vi.advanceTimersByTime(1100);
      expect(cache.has("test:1")).toBe(false);
    });
  });

  describe("delete", () => {
    it("should delete cache entries", () => {
      cache.set("test:1", { data: "value" });
      expect(cache.has("test:1")).toBe(true);

      cache.delete("test:1");
      expect(cache.has("test:1")).toBe(false);
    });

    it("should handle deleting non-existent entries", () => {
      expect(() => cache.delete("nonexistent")).not.toThrow();
    });
  });

  describe("clear", () => {
    it("should clear all cache entries", () => {
      cache.set("test:1", { data: "value1" });
      cache.set("test:2", { data: "value2" });

      cache.clear();

      expect(cache.get("test:1")).toBeNull();
      expect(cache.get("test:2")).toBeNull();
    });
  });

  describe("cacheKeys", () => {
    it("should generate consistent cache keys", () => {
      const key1 = cacheKeys.articles(1, 10);
      const key2 = cacheKeys.articles(1, 10);

      expect(key1).toBe(key2);
    });

    it("should generate different keys for different parameters", () => {
      const key1 = cacheKeys.articles(1, 10);
      const key2 = cacheKeys.articles(2, 10);

      expect(key1).not.toBe(key2);
    });

    it("should generate article-specific keys", () => {
      const key = cacheKeys.article("test-article");
      expect(key).toContain("test-article");
    });

    it("should generate category keys", () => {
      const key = cacheKeys.category("machine-learning");
      expect(key).toContain("machine-learning");
    });
  });

  describe("cacheTTL", () => {
    it("should define appropriate TTL values", () => {
      expect(cacheTTL.SHORT).toBe(5 * 60 * 1000);
      expect(cacheTTL.MEDIUM).toBe(30 * 60 * 1000);
      expect(cacheTTL.LONG).toBe(60 * 60 * 1000);
      expect(cacheTTL.VERY_LONG).toBe(24 * 60 * 60 * 1000);
    });

    it("should have SHORT < MEDIUM < LONG < VERY_LONG", () => {
      expect(cacheTTL.SHORT).toBeLessThan(cacheTTL.MEDIUM);
      expect(cacheTTL.MEDIUM).toBeLessThan(cacheTTL.LONG);
      expect(cacheTTL.LONG).toBeLessThan(cacheTTL.VERY_LONG);
    });
  });

  describe("getStats", () => {
    it("should return cache statistics", () => {
      cache.set("test:1", { data: "value1" });
      cache.set("test:2", { data: "value2" });

      const stats = cache.getStats();

      expect(stats.size).toBe(2);
      expect(stats.keys).toContain("test:1");
      expect(stats.keys).toContain("test:2");
    });

    it("should return empty stats when cache is empty", () => {
      const stats = cache.getStats();

      expect(stats.size).toBe(0);
      expect(stats.keys).toHaveLength(0);
    });
  });
});
