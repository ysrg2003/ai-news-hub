import mysql from "mysql2/promise";
import { config } from "dotenv";

config();

const CATEGORIES = [
  { id: 1, name: "Machine Learning", slug: "machine-learning" },
  { id: 2, name: "Natural Language Processing", slug: "natural-language-processing" },
  { id: 3, name: "Computer Vision", slug: "computer-vision" },
  { id: 4, name: "Robotics", slug: "robotics" },
  { id: 5, name: "Generative AI", slug: "generative-ai" },
  { id: 6, name: "AI Applications", slug: "ai-applications" },
  { id: 7, name: "AI Research", slug: "ai-research" },
  { id: 8, name: "AI Ethics", slug: "ai-ethics" },
];

const SAMPLE_ARTICLES = [
  {
    title: "Deep Learning Breakthroughs in 2024",
    excerpt: "Explore the latest advancements in deep learning technology.",
    content: "Deep learning continues to revolutionize AI applications...",
    categoryId: 1,
    articleType: "trending",
    author: "AI News Hub",
    readTime: 5,
  },
  {
    title: "Understanding Transformers: A Complete Guide",
    excerpt: "A comprehensive guide to transformer architectures.",
    content: "Transformers have become the foundation of modern NLP...",
    categoryId: 2,
    articleType: "evergreen",
    author: "AI News Hub",
    readTime: 8,
  },
  {
    title: "Computer Vision in Healthcare",
    excerpt: "How computer vision is transforming medical imaging.",
    content: "Computer vision technology is revolutionizing healthcare...",
    categoryId: 3,
    articleType: "trending",
    author: "AI News Hub",
    readTime: 6,
  },
  {
    title: "The Future of Robotics",
    excerpt: "Exploring the next generation of robotic systems.",
    content: "Robotics is advancing at an unprecedented pace...",
    categoryId: 4,
    articleType: "evergreen",
    author: "AI News Hub",
    readTime: 7,
  },
  {
    title: "Generative AI: Opportunities and Challenges",
    excerpt: "Understanding the impact of generative AI.",
    content: "Generative AI has opened new possibilities...",
    categoryId: 5,
    articleType: "trending",
    author: "AI News Hub",
    readTime: 9,
  },
  {
    title: "AI in Business: Real-World Applications",
    excerpt: "How companies are leveraging AI for growth.",
    content: "Artificial intelligence is transforming business...",
    categoryId: 6,
    articleType: "evergreen",
    author: "AI News Hub",
    readTime: 6,
  },
  {
    title: "Latest AI Research Findings",
    excerpt: "Breakthrough discoveries in AI research.",
    content: "Recent research has unveiled new insights...",
    categoryId: 7,
    articleType: "trending",
    author: "AI News Hub",
    readTime: 8,
  },
  {
    title: "Ethics in Artificial Intelligence",
    excerpt: "Addressing ethical concerns in AI development.",
    content: "As AI becomes more prevalent, ethical considerations...",
    categoryId: 8,
    articleType: "evergreen",
    author: "AI News Hub",
    readTime: 7,
  },
];

async function seedDatabase() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    console.log("🌱 Starting database seeding...");

    // Insert sample articles
    for (const article of SAMPLE_ARTICLES) {
      const slug = article.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const query = `
        INSERT INTO articles 
        (title, slug, excerpt, content, categoryId, articleType, author, readTime, image, imageAltText, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      await connection.execute(query, [
        article.title,
        slug,
        article.excerpt,
        article.content,
        article.categoryId,
        article.articleType,
        article.author,
        article.readTime,
        null, // image - will be generated
        article.title,
      ]);

      console.log(`✅ Created article: ${article.title}`);
    }

    console.log("\n✨ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedDatabase();
