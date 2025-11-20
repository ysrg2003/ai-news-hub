import { getDb } from "./db";
import { tags, articleTags, articles } from "../drizzle/schema";
import { eq, inArray } from "drizzle-orm";

/**
 * Get all tags
 */
export async function getAllTags() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return [];
  }

  try {
    const result = await db.select().from(tags);
    return result;
  } catch (error) {
    console.error("Error getting all tags:", error);
    return [];
  }
}

/**
 * Get tag by ID
 */
export async function getTagById(tagId: number) {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return null;
  }

  try {
    const result = await db.select().from(tags).where(eq(tags.id, tagId)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error getting tag:", error);
    return null;
  }
}

/**
 * Get tag by slug
 */
export async function getTagBySlug(slug: string) {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return null;
  }

  try {
    const result = await db.select().from(tags).where(eq(tags.slug, slug)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error getting tag by slug:", error);
    return null;
  }
}

/**
 * Get articles by tag
 */
export async function getArticlesByTag(tagId: number, limit: number = 20, offset: number = 0) {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return { articles: [], total: 0 };
  }

  try {
    // Get article IDs for this tag
    const articleIds = await db
      .select({ articleId: articleTags.articleId })
      .from(articleTags)
      .where(eq(articleTags.tagId, tagId));

    if (articleIds.length === 0) {
      return { articles: [], total: 0 };
    }

    const ids = articleIds.map((a) => a.articleId);

    // Get articles
    const result = await db
      .select()
      .from(articles)
      .where(inArray(articles.id, ids))
      .limit(limit)
      .offset(offset);

    return {
      articles: result,
      total: ids.length,
    };
  } catch (error) {
    console.error("Error getting articles by tag:", error);
    return { articles: [], total: 0 };
  }
}

/**
 * Get tags for an article
 */
export async function getArticleTags(articleId: number) {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return [];
  }

  try {
    const tagIds = await db
      .select({ tagId: articleTags.tagId })
      .from(articleTags)
      .where(eq(articleTags.articleId, articleId));

    if (tagIds.length === 0) {
      return [];
    }

    const ids = tagIds.map((t) => t.tagId);

    const result = await db
      .select()
      .from(tags)
      .where(inArray(tags.id, ids));

    return result;
  } catch (error) {
    console.error("Error getting article tags:", error);
    return [];
  }
}

/**
 * Create a new tag
 */
export async function createTag(name: string, slug: string) {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return null;
  }

  try {
    const result = await db.insert(tags).values({
      name,
      slug,
    });

    return {
      id: (result as any).insertId,
      name,
      slug,
    };
  } catch (error) {
    console.error("Error creating tag:", error);
    return null;
  }
}

/**
 * Add tag to article
 */
export async function addTagToArticle(articleId: number, tagId: number) {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return false;
  }

  try {
    await db.insert(articleTags).values({
      articleId,
      tagId,
    });
    return true;
  } catch (error) {
    console.error("Error adding tag to article:", error);
    return false;
  }
}

/**
 * Remove tag from article
 */
export async function removeTagFromArticle(articleId: number, tagId: number) {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return false;
  }

  try {
    await db
      .delete(articleTags)
      .where(eq(articleTags.articleId, articleId));
    return true;
  } catch (error) {
    console.error("Error removing tag from article:", error);
    return false;
  }
}

/**
 * Get popular tags
 */
export async function getPopularTags(limit: number = 10) {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return [];
  }

  try {
    // Get all tags with their article counts
    const allTags = await db.select().from(tags);

    // For each tag, count articles
    const tagsWithCounts = await Promise.all(
      allTags.map(async (tag) => {
        const count = await db
          .select({ count: articleTags.articleId })
          .from(articleTags)
          .where(eq(articleTags.tagId, tag.id));

        return {
          ...tag,
          articleCount: count.length,
        };
      })
    );

    // Sort by count and limit
    return tagsWithCounts.sort((a, b) => b.articleCount - a.articleCount).slice(0, limit);
  } catch (error) {
    console.error("Error getting popular tags:", error);
    return [];
  }
}
