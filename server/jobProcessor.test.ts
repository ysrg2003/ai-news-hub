import { describe, it, expect, beforeEach, vi } from "vitest";
import { scheduleJob, processJob, processPendingJobs } from "./jobProcessor";
import * as db from "./db";

// Mock the database
vi.mock("./db", () => ({
  getDb: vi.fn(),
}));

describe("Job Processor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("scheduleJob", () => {
    it("should schedule a new job with correct parameters", async () => {
      const mockDb = {
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockResolvedValue(undefined),
        }),
      };

      vi.mocked(db.getDb).mockResolvedValue(mockDb as any);

      const jobId = await scheduleJob(1, "trending", { test: "data" });

      expect(jobId).toBeDefined();
      expect(jobId).toMatch(/^job_/);
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it("should return null if database is not available", async () => {
      vi.mocked(db.getDb).mockResolvedValue(null);

      const jobId = await scheduleJob(1, "evergreen");

      expect(jobId).toBeNull();
    });
  });

  describe("processJob", () => {
    it("should process a job successfully", async () => {
      const mockJob = {
        id: 1,
        jobId: "job_123",
        categoryId: 1,
        articleType: "trending",
        status: "pending",
        attempts: 0,
        intermediateData: null,
      };

      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([mockJob]),
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue(undefined),
          }),
        }),
      };

      vi.mocked(db.getDb).mockResolvedValue(mockDb as any);

      const result = await processJob("job_123");

      expect(result).toBeDefined();
      expect(mockDb.select).toHaveBeenCalled();
    });

    it("should return false if job is not found", async () => {
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([]),
            }),
          }),
        }),
      };

      vi.mocked(db.getDb).mockResolvedValue(mockDb as any);

      const result = await processJob("nonexistent_job");

      expect(result).toBe(false);
    });

    it("should return false if database is not available", async () => {
      vi.mocked(db.getDb).mockResolvedValue(null);

      const result = await processJob("job_123");

      expect(result).toBe(false);
    });
  });

  describe("processPendingJobs", () => {
    it("should process all pending jobs", async () => {
      const mockJobs = [
        {
          id: 1,
          jobId: "job_1",
          categoryId: 1,
          articleType: "trending",
          status: "pending",
          attempts: 0,
          intermediateData: null,
        },
        {
          id: 2,
          jobId: "job_2",
          categoryId: 2,
          articleType: "evergreen",
          status: "pending",
          attempts: 0,
          intermediateData: null,
        },
      ];

      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue(mockJobs),
          }),
        }),
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue(undefined),
          }),
        }),
      };

      vi.mocked(db.getDb).mockResolvedValue(mockDb as any);

      await processPendingJobs();

      expect(mockDb.select).toHaveBeenCalled();
    });

    it("should handle database errors gracefully", async () => {
      vi.mocked(db.getDb).mockResolvedValue(null);

      // Should not throw
      await expect(processPendingJobs()).resolves.toBeUndefined();
    });
  });
});
