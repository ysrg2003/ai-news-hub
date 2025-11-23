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
    excerpt: "Explore the latest advancements in deep learning technology and neural networks.",
    content: "Deep learning continues to revolutionize AI applications across industries. From computer vision to natural language processing, deep learning models are achieving unprecedented accuracy and performance levels.",
    categoryId: 1,
    articleType: "trending",
    author: "AI News Hub",
    readTime: 5,
  },
  {
    title: "Understanding Transformers: A Complete Guide",
    excerpt: "A comprehensive guide to transformer architectures and their applications.",
    content: "Transformers have become the foundation of modern NLP and vision models. This guide explores attention mechanisms, self-attention, and multi-head attention in detail.",
    categoryId: 2,
    articleType: "evergreen",
    author: "AI News Hub",
    readTime: 8,
  },
  {
    title: "Computer Vision in Healthcare",
    excerpt: "How computer vision is transforming medical imaging and diagnostics.",
    content: "Computer vision technology is revolutionizing healthcare by enabling faster and more accurate diagnoses. From X-ray analysis to tumor detection, CV is saving lives.",
    categoryId: 3,
    articleType: "trending",
    author: "AI News Hub",
    readTime: 6,
  },
  {
    title: "The Future of Robotics",
    excerpt: "Exploring the next generation of robotic systems and automation.",
    content: "Robotics is advancing at an unprecedented pace with improvements in AI, computer vision, and control systems. The future of robotics promises autonomous systems that can adapt to any environment.",
    categoryId: 4,
    articleType: "evergreen",
    author: "AI News Hub",
    readTime: 7,
  },
  {
    title: "Generative AI: Opportunities and Challenges",
    excerpt: "Understanding the impact of generative AI on society and business.",
    content: "Generative AI has opened new possibilities for content creation, code generation, and problem-solving. However, it also raises important questions about ethics and authenticity.",
    categoryId: 5,
    articleType: "trending",
    author: "AI News Hub",
    readTime: 9,
  },
  {
    title: "AI in Business: Real-World Applications",
    excerpt: "How companies are leveraging AI for growth and competitive advantage.",
    content: "Artificial intelligence is transforming business operations through automation, predictive analytics, and personalization. Companies across all sectors are adopting AI to improve efficiency.",
    categoryId: 6,
    articleType: "evergreen",
    author: "AI News Hub",
    readTime: 6,
  },
  {
    title: "Latest AI Research Findings",
    excerpt: "Breakthrough discoveries in AI research from leading institutions.",
    content: "Recent research has unveiled new insights into neural networks, attention mechanisms, and multimodal learning. These findings are shaping the future of AI development.",
    categoryId: 7,
    articleType: "trending",
    author: "AI News Hub",
    readTime: 8,
  },
  {
    title: "Ethics in Artificial Intelligence",
    excerpt: "Addressing ethical concerns in AI development and deployment.",
    content: "As AI becomes more prevalent, ethical considerations become increasingly important. Topics like bias, fairness, transparency, and accountability are critical to responsible AI.",
    categoryId: 8,
    articleType: "evergreen",
    author: "AI News Hub",
    readTime: 7,
  },
  {
    title: "Neural Networks: From Basics to Advanced",
    excerpt: "A deep dive into neural network architectures and training techniques.",
    content: "Neural networks form the foundation of modern deep learning. Understanding their structure, activation functions, and training methods is essential for AI practitioners.",
    categoryId: 1,
    articleType: "evergreen",
    author: "AI News Hub",
    readTime: 10,
  },
  {
    title: "NLP Models Breaking Language Barriers",
    excerpt: "How NLP models are enabling cross-lingual communication.",
    content: "Natural language processing models are breaking down language barriers and enabling real-time translation. These advances are making global communication more accessible.",
    categoryId: 2,
    articleType: "trending",
    author: "AI News Hub",
    readTime: 6,
  },
  {
    title: "Object Detection and Segmentation",
    excerpt: "Advanced techniques in computer vision for object detection.",
    content: "Object detection and semantic segmentation are key computer vision tasks. Modern architectures like YOLO and Mask R-CNN achieve impressive accuracy on various datasets.",
    categoryId: 3,
    articleType: "evergreen",
    author: "AI News Hub",
    readTime: 7,
  },
  {
    title: "Autonomous Robots in Manufacturing",
    excerpt: "How autonomous robots are revolutionizing manufacturing processes.",
    content: "Autonomous robots are transforming manufacturing by improving efficiency, reducing errors, and enabling 24/7 operations. Companies are investing heavily in robotic automation.",
    categoryId: 4,
    articleType: "trending",
    author: "AI News Hub",
    readTime: 6,
  },
  {
    title: "Diffusion Models: The Future of Generation",
    excerpt: "Understanding diffusion models and their applications.",
    content: "Diffusion models have emerged as a powerful approach to generative modeling. They work by gradually denoising random noise to generate high-quality outputs.",
    categoryId: 5,
    articleType: "evergreen",
    author: "AI News Hub",
    readTime: 8,
  },
  {
    title: "AI-Powered Customer Service",
    excerpt: "Transforming customer support with AI chatbots and automation.",
    content: "AI-powered customer service solutions are improving response times and customer satisfaction. Chatbots and virtual assistants are handling routine inquiries efficiently.",
    categoryId: 6,
    articleType: "trending",
    author: "AI News Hub",
    readTime: 5,
  },
  {
    title: "Quantum Computing and AI",
    excerpt: "Exploring the intersection of quantum computing and artificial intelligence.",
    content: "Quantum computing promises to accelerate AI algorithms and solve previously intractable problems. Researchers are exploring quantum machine learning applications.",
    categoryId: 7,
    articleType: "evergreen",
    author: "AI News Hub",
    readTime: 9,
  },
  {
    title: "Bias and Fairness in AI Systems",
    excerpt: "Addressing bias and ensuring fairness in AI models.",
    content: "Bias in AI systems can lead to unfair outcomes and discrimination. Researchers are developing techniques to detect, measure, and mitigate bias in machine learning models.",
    categoryId: 8,
    articleType: "trending",
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
        (title, slug, excerpt, content, categoryId, articleType, authorName, readTime, imageAltText, metaTitle, metaDescription, conceptualIcon, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
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
        article.title,
        article.title,
        article.excerpt,
        "brain",
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
