import { getDb } from "./db";
import { articles } from "../drizzle/schema";
import { ilike, or, eq } from "drizzle-orm";

/**
 * Search articles by title, excerpt, or content
 */
export async function searchArticles(query: string, limit: number = 20) {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return [];
  }

  try {
    const searchQuery = `%${query}%`;
    const results = await db
      .select()
      .from(articles)
      .where(
        or(
          ilike(articles.title, searchQuery),
          ilike(articles.excerpt, searchQuery),
          ilike(articles.content, searchQuery)
        )
      )
      .limit(limit);

    return results;
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

/**
 * Get recommended articles based on category
 */
export async function getRecommendedArticles(
  categoryId: number,
  excludeArticleId?: number,
  limit: number = 5
) {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return [];
  }

  try {
    const results = await db
      .select()
      .from(articles)
      .where(eq(articles.categoryId, categoryId))
      .orderBy(articles.createdAt)
      .limit(limit);

    if (excludeArticleId) {
      return results.filter((a) => a.id !== excludeArticleId);
    }

    return results;
  } catch (error) {
    console.error("Error getting recommended articles:", error);
    return [];
  }
}

/**
 * Get trending articles
 */
export async function getTrendingArticles(limit: number = 10) {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return [];
  }

  try {
    const results = await db
      .select()
      .from(articles)
      .where(eq(articles.articleType, "trending"))
      .orderBy(articles.createdAt)
      .limit(limit);

    return results;
  } catch (error) {
    console.error("Error getting trending articles:", error);
    return [];
  }
}

/**
 * Get evergreen articles
 */
export async function getEvergreenArticles(limit: number = 10) {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return [];
  }

  try {
    const results = await db
      .select()
      .from(articles)
      .where(eq(articles.articleType, "evergreen"))
      .orderBy(articles.createdAt)
      .limit(limit);

    return results;
  } catch (error) {
    console.error("Error getting evergreen articles:", error);
    return [];
  }
}

/**
 * Get articles by tag
 */
export async function getArticlesByTag(tagId: number, limit: number = 20) {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return [];
  }

  try {
    // TODO: Implement tag-based article retrieval
    // This requires joining with the article_tags table
    return [];
  } catch (error) {
    console.error("Error getting articles by tag:", error);
    return [];
  }
}

/**
 * Get related articles based on content similarity
 */
export async function getRelatedArticles(
  articleId: number,
  categoryId: number,
  limit: number = 3
) {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return [];
  }

  try {
    const results = await db
      .select()
      .from(articles)
      .where(eq(articles.categoryId, categoryId))
      .orderBy(articles.createdAt)
      .limit(limit);

    return results.filter((a) => a.id !== articleId);
  } catch (error) {
    console.error("Error getting related articles:", error);
    return [];
  }
}
