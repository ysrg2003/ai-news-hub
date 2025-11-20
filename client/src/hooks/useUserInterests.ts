import { useState, useEffect, useCallback } from "react";

interface UserInterests {
  categories: Record<string, number>;
  tags: Record<string, number>;
  articles: number[];
  lastUpdated: number;
}

const STORAGE_KEY = "ai-news-hub-interests";
const MAX_ARTICLES = 50;
const INTEREST_DECAY = 0.95; // Decay factor for old interests

/**
 * Hook for managing user interests with localStorage
 */
export function useUserInterests() {
  const [interests, setInterests] = useState<UserInterests>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading interests:", error);
    }

    return {
      categories: {},
      tags: {},
      articles: [],
      lastUpdated: Date.now(),
    };
  });

  // Save interests to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(interests));
    } catch (error) {
      console.error("Error saving interests:", error);
    }
  }, [interests]);

  /**
   * Record category interest
   */
  const recordCategoryInterest = useCallback(
    (categoryId: string | number) => {
      setInterests((prev) => {
        const key = String(categoryId);
        return {
          ...prev,
          categories: {
            ...prev.categories,
            [key]: (prev.categories[key] || 0) + 1,
          },
          lastUpdated: Date.now(),
        };
      });
    },
    []
  );

  /**
   * Record tag interest
   */
  const recordTagInterest = useCallback((tagId: string | number) => {
    setInterests((prev) => {
      const key = String(tagId);
      return {
        ...prev,
        tags: {
          ...prev.tags,
          [key]: (prev.tags[key] || 0) + 1,
        },
        lastUpdated: Date.now(),
      };
    });
  }, []);

  /**
   * Record article view
   */
  const recordArticleView = useCallback((articleId: number) => {
    setInterests((prev) => {
      const articles = [articleId, ...prev.articles.filter((id) => id !== articleId)].slice(
        0,
        MAX_ARTICLES
      );

      return {
        ...prev,
        articles,
        lastUpdated: Date.now(),
      };
    });
  }, []);

  /**
   * Get top categories by interest
   */
  const getTopCategories = useCallback((limit: number = 5): string[] => {
    return Object.entries(interests.categories)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([categoryId]) => categoryId);
  }, [interests.categories]);

  /**
   * Get top tags by interest
   */
  const getTopTags = useCallback((limit: number = 5): string[] => {
    return Object.entries(interests.tags)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tagId]) => tagId);
  }, [interests.tags]);

  /**
   * Get recently viewed articles
   */
  const getRecentArticles = useCallback((limit: number = 10): number[] => {
    return interests.articles.slice(0, limit);
  }, [interests.articles]);

  /**
   * Clear all interests
   */
  const clearInterests = useCallback(() => {
    setInterests({
      categories: {},
      tags: {},
      articles: [],
      lastUpdated: Date.now(),
    });
  }, []);

  /**
   * Apply interest decay (for older interests)
   */
  const applyDecay = useCallback(() => {
    const now = Date.now();
    const daysSinceUpdate = (now - interests.lastUpdated) / (1000 * 60 * 60 * 24);

    if (daysSinceUpdate > 7) {
      // Apply decay after 7 days
      const decayFactor = Math.pow(INTEREST_DECAY, Math.floor(daysSinceUpdate / 7));

      setInterests((prev) => ({
        ...prev,
        categories: Object.fromEntries(
          Object.entries(prev.categories).map(([key, value]) => [
            key,
            Math.max(1, Math.floor((value as number) * decayFactor)),
          ])
        ),
        tags: Object.fromEntries(
          Object.entries(prev.tags).map(([key, value]) => [
            key,
            Math.max(1, Math.floor((value as number) * decayFactor)),
          ])
        ),
        lastUpdated: now,
      }));
    }
  }, [interests.lastUpdated]);

  /**
   * Get personalization score for an article
   */
  const getPersonalizationScore = useCallback(
    (categoryId: string | number, tagIds: (string | number)[] = []): number => {
      let score = 0;

      // Category score
      const categoryScore = interests.categories[String(categoryId)] || 0;
      score += categoryScore * 10;

      // Tag scores
      tagIds.forEach((tagId) => {
        const tagScore = interests.tags[String(tagId)] || 0;
        score += tagScore * 5;
      });

      return score;
    },
    [interests]
  );

  return {
    interests,
    recordCategoryInterest,
    recordTagInterest,
    recordArticleView,
    getTopCategories,
    getTopTags,
    getRecentArticles,
    clearInterests,
    applyDecay,
    getPersonalizationScore,
  };
}
