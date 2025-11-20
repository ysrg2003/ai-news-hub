import { describe, it, expect } from "vitest";
import { calculateQualityScore, meetsQualityStandards } from "./contentQuality";

describe("Content Quality Scoring", () => {
  const sampleTitle = "Understanding Deep Learning: A Comprehensive Guide";
  const sampleExcerpt =
    "Deep learning has revolutionized artificial intelligence. Learn the fundamentals, architectures, and real-world applications in this comprehensive guide.";
  const sampleContent = `
# Understanding Deep Learning

Deep learning is a subset of machine learning that uses neural networks with multiple layers.

## What is Deep Learning?

Deep learning models are inspired by the structure and function of biological neural networks. They can learn from large amounts of unstructured data and automatically discover representations needed for detection or classification.

### Key Concepts

- **Neural Networks**: Interconnected nodes that process information
- **Backpropagation**: Algorithm for training networks
- **Activation Functions**: Non-linear transformations

## Applications

Deep learning has numerous applications across various domains:

1. **Computer Vision**: Image recognition, object detection
2. **Natural Language Processing**: Machine translation, sentiment analysis
3. **Speech Recognition**: Audio processing and transcription

## Getting Started

To get started with deep learning, you need:

\`\`\`python
import tensorflow as tf
model = tf.keras.Sequential([
  tf.keras.layers.Dense(128, activation='relu'),
  tf.keras.layers.Dense(10, activation='softmax')
])
\`\`\`

## Conclusion

Deep learning is a powerful tool for solving complex problems. With the right approach and resources, you can build impressive applications.
`;

  it("should calculate quality score for good content", () => {
    const score = calculateQualityScore(sampleTitle, sampleExcerpt, sampleContent, [
      "deep learning",
      "neural networks",
    ]);

    expect(score.overall).toBeGreaterThanOrEqual(0);
    expect(score.overall).toBeLessThanOrEqual(100);
    expect(score.readability).toBeGreaterThanOrEqual(0);
    expect(score.structure).toBeGreaterThanOrEqual(0);
    expect(score.seo).toBeGreaterThanOrEqual(0);
    expect(score.engagement).toBeGreaterThanOrEqual(0);
  });

  it("should identify quality issues in short content", () => {
    const shortContent = "This is a short article.";
    const score = calculateQualityScore("Short Title", "Short excerpt", shortContent);

    expect(score.overall).toBeLessThan(70);
    expect(score.details.length).toBeGreaterThan(0);
  });

  it("should identify quality issues in poorly structured content", () => {
    const poorContent = "This is a very long sentence that goes on and on without proper punctuation or structure making it hard to read and understand the main points being conveyed in this particular piece of writing.";
    const score = calculateQualityScore("Title", "Excerpt", poorContent);

    expect(score.readability).toBeLessThan(100);
  });

  it("should validate against minimum quality standards", () => {
    const goodScore = calculateQualityScore(sampleTitle, sampleExcerpt, sampleContent);
    const poorContent = "Short.";
    const poorScore = calculateQualityScore("T", "E", poorContent);

    expect(meetsQualityStandards(goodScore, 60)).toBe(true);
    expect(meetsQualityStandards(poorScore, 70)).toBe(false);
  });

  it("should detect missing keywords in content", () => {
    const score = calculateQualityScore(
      "Random Title",
      "Random excerpt",
      "This content has nothing to do with the title or keywords",
      ["deep learning", "neural networks"]
    );

    expect(score.seo).toBeLessThan(100);
  });

  it("should reward content with proper structure", () => {
    const score = calculateQualityScore(sampleTitle, sampleExcerpt, sampleContent);

    expect(score.structure).toBeGreaterThan(50);
    expect(score.engagement).toBeGreaterThan(50);
  });

  it("should provide helpful feedback details", () => {
    const score = calculateQualityScore(sampleTitle, sampleExcerpt, sampleContent);

    expect(score.details).toBeInstanceOf(Array);
    expect(score.details.length).toBeGreaterThan(0);
    expect(score.details[0]).toMatch(/✅|⚠️|❌/);
  });
});
