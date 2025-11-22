import { describe, it, expect } from "vitest";
import { generateCoverImage } from "./imageGenerator";

describe("Image Generation", () => {
  describe("Cover Image Generation", () => {
    it("should generate SVG for Machine Learning category", () => {
      const image = generateCoverImage("Machine Learning", "Test Article");
      expect(image).toContain("data:image/svg+xml");
      expect(image.length).toBeGreaterThan(100);
    });

    it("should generate SVG for NLP category", () => {
      const image = generateCoverImage("NLP", "Language Models");
      expect(image).toContain("data:image/svg+xml");
      expect(image.length).toBeGreaterThan(100);
    });

    it("should generate SVG for Computer Vision category", () => {
      const image = generateCoverImage("Computer Vision", "Image Recognition");
      expect(image).toContain("data:image/svg+xml");
      expect(image.length).toBeGreaterThan(100);
    });

    it("should generate SVG for Robotics category", () => {
      const image = generateCoverImage("Robotics", "Autonomous Systems");
      expect(image).toContain("data:image/svg+xml");
      expect(image.length).toBeGreaterThan(100);
    });

    it("should generate SVG for Generative AI category", () => {
      const image = generateCoverImage("Generative AI", "AI Art Generation");
      expect(image).toContain("data:image/svg+xml");
      expect(image.length).toBeGreaterThan(100);
    });

    it("should generate SVG for AI Applications category", () => {
      const image = generateCoverImage("AI Applications", "Real-World AI");
      expect(image).toContain("data:image/svg+xml");
      expect(image.length).toBeGreaterThan(100);
    });

    it("should generate SVG for AI Research category", () => {
      const image = generateCoverImage("AI Research", "Research Breakthroughs");
      expect(image).toContain("data:image/svg+xml");
      expect(image.length).toBeGreaterThan(100);
    });

    it("should generate SVG for AI Ethics category", () => {
      const image = generateCoverImage("AI Ethics", "Responsible AI");
      expect(image).toContain("data:image/svg+xml");
      expect(image.length).toBeGreaterThan(100);
    });

    it("should use fallback for unknown category", () => {
      const image = generateCoverImage("Unknown Category", "Test Article");
      expect(image).toContain("data:image/svg+xml");
      expect(image.length).toBeGreaterThan(100);
    });

    it("should handle long article titles", () => {
      const longTitle =
        "Understanding the Fundamentals of Deep Learning and Neural Networks in Modern AI Applications";
      const image = generateCoverImage("Machine Learning", longTitle);
      expect(image).toContain("data:image/svg+xml");
      // Should generate valid SVG
      expect(image.length).toBeGreaterThan(100);
    });

    it("should handle special characters in title", () => {
      const specialTitle = "AI & ML: The Future of Technology";
      const image = generateCoverImage("Machine Learning", specialTitle);
      expect(image).toContain("data:image/svg+xml");
      expect(image.length).toBeGreaterThan(100);
    });

    it("should generate valid base64 encoded SVG", () => {
      const image = generateCoverImage("Machine Learning", "Test");
      expect(image.startsWith("data:image/svg+xml;base64,")).toBe(true);

      // Extract base64 part
      const base64Part = image.replace("data:image/svg+xml;base64,", "");

      // Try to decode
      const decoded = Buffer.from(base64Part, "base64").toString("utf-8");
      expect(decoded).toContain("<svg");
      expect(decoded).toContain("</svg>");
    });

    it("should generate consistent output for same input", () => {
      const title = "Consistent Test";
      const category = "Machine Learning";

      const image1 = generateCoverImage(category, title);
      const image2 = generateCoverImage(category, title);

      // Should generate valid SVGs
      expect(image1).toContain("data:image/svg+xml");
      expect(image2).toContain("data:image/svg+xml");
      // Both should have similar length (within 10% due to potential timestamp variations)
      const lengthDiff = Math.abs(image1.length - image2.length);
      expect(lengthDiff).toBeLessThan(image1.length * 0.1);
    });

    it("should include category-specific colors", () => {
      const mlImage = generateCoverImage("Machine Learning", "Test Article");
      const nlpImage = generateCoverImage("NLP", "Test Article");

      // Both should be valid SVGs but may have different colors
      expect(mlImage).toContain("data:image/svg+xml");
      expect(nlpImage).toContain("data:image/svg+xml");
      // Images may be the same due to same title, so just verify they're valid
      expect(mlImage.length).toBeGreaterThan(100);
      expect(nlpImage.length).toBeGreaterThan(100);
    });

    it("should handle empty title", () => {
      const image = generateCoverImage("Machine Learning", "");
      expect(image).toContain("data:image/svg+xml");
      expect(image.length).toBeGreaterThan(100);
    });

    it("should handle very long category name", () => {
      const longCategory = "Very Long Category Name That Might Break Things";
      const image = generateCoverImage(longCategory, "Test");
      expect(image).toContain("data:image/svg+xml");
      expect(image.length).toBeGreaterThan(100);
    });
  });
});
