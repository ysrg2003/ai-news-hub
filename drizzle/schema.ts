import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Categories for AI News Hub
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  color: varchar("color", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Articles table
 */
export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  categoryId: int("categoryId").notNull(),
  authorId: int("authorId"),
  authorName: varchar("authorName", { length: 100 }),
  articleType: mysqlEnum("articleType", ["trending", "evergreen"]).notNull(),
  image: text("image"), // Base64 SVG or image URL
  imageAltText: varchar("imageAltText", { length: 255 }),
  metaTitle: varchar("metaTitle", { length: 60 }),
  metaDescription: varchar("metaDescription", { length: 160 }),
  readTime: int("readTime"), // in minutes
  viewCount: int("viewCount").default(0),
  conceptualIcon: varchar("conceptualIcon", { length: 100 }),
  published: int("published").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;

/**
 * Tags table
 */
export const tags = mysqlTable("tags", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Tag = typeof tags.$inferSelect;
export type InsertTag = typeof tags.$inferInsert;

/**
 * Article-Tag relationship (many-to-many)
 */
export const articleTags = mysqlTable("article_tags", {
  articleId: int("articleId").notNull(),
  tagId: int("tagId").notNull(),
});

export type ArticleTag = typeof articleTags.$inferSelect;
export type InsertArticleTag = typeof articleTags.$inferInsert;

/**
 * Job Queue for pending article generation
 */
export const jobQueue = mysqlTable("job_queue", {
  id: int("id").autoincrement().primaryKey(),
  jobId: varchar("jobId", { length: 100 }).notNull().unique(),
  categoryId: int("categoryId").notNull(),
  articleType: mysqlEnum("articleType", ["trending", "evergreen"]).notNull(),
  status: varchar("status", { length: 100 }).notNull(),
  attempts: int("attempts").default(1),
  lastAttempted: timestamp("lastAttempted"),
  intermediateData: text("intermediateData"), // JSON string
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JobQueueItem = typeof jobQueue.$inferSelect;
export type InsertJobQueueItem = typeof jobQueue.$inferInsert;