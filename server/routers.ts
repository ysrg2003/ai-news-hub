import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { getDb } from "./db";

// Initialize database on module load
getDb().catch((err) => console.error("Failed to initialize database:", err));

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  articles: router({
    list: publicProcedure
      .input(
        z.object({
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(12),
          categoryId: z.number().optional(),
          search: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const { page, limit, categoryId, search } = input;
        const offset = (page - 1) * limit;
        const articles = await db.getAllArticles(limit, offset);
        const totalArticles = articles.length;
        const totalPages = Math.ceil(totalArticles / limit);
        return {
          articles,
          totalPages,
        };
      }),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getArticleBySlug(input.slug);
      }),

    byCategory: publicProcedure
      .input(
        z.object({
          categorySlug: z.string(),
          page: z.number().min(1).default(1),
          limit: z.number().min(1).max(100).default(12),
        })
      )
      .query(async ({ input }) => {
        const category = await db.getCategoryBySlug(input.categorySlug);
        if (!category) return { articles: [], totalPages: 0 };
        const offset = (input.page - 1) * input.limit;
        const articles = await db.getArticlesByCategory(category.id, input.limit, offset);
        const totalPages = Math.ceil(articles.length / input.limit);
        return { articles, totalPages };
      }),
  }),

  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getCategories();
    }),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return await db.getCategoryBySlug(input.slug);
      }),
  }),
});

export type AppRouter = typeof appRouter;
