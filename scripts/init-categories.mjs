import mysql from "mysql2/promise";

const categories = [
  {
    name: "Machine Learning",
    slug: "machine-learning",
    description:
      "Explore the latest developments in machine learning algorithms, techniques, and applications that are transforming industries.",
    icon: "🤖",
    color: "#6366f1",
  },
  {
    name: "Natural Language Processing",
    slug: "natural-language-processing",
    description:
      "Discover how AI is understanding and generating human language, from chatbots to translation systems.",
    icon: "💬",
    color: "#ec4899",
  },
  {
    name: "Computer Vision",
    slug: "computer-vision",
    description:
      "Learn about AI systems that can see and interpret visual information from images and videos.",
    icon: "👁️",
    color: "#f59e0b",
  },
  {
    name: "Robotics",
    slug: "robotics",
    description:
      "Stay updated on the intersection of AI and robotics, creating intelligent autonomous systems.",
    icon: "🦾",
    color: "#10b981",
  },
  {
    name: "Generative AI",
    slug: "generative-ai",
    description:
      "Explore generative models that create new content, from text to images to music.",
    icon: "✨",
    color: "#8b5cf6",
  },
  {
    name: "AI Applications",
    slug: "ai-applications",
    description:
      "Discover real-world applications of AI across healthcare, finance, education, and more.",
    icon: "🚀",
    color: "#06b6d4",
  },
  {
    name: "AI Research",
    slug: "ai-research",
    description:
      "Deep dive into cutting-edge research papers and breakthroughs in artificial intelligence.",
    icon: "🔬",
    color: "#ef4444",
  },
  {
    name: "AI Ethics",
    slug: "ai-ethics",
    description:
      "Explore the ethical implications, bias, fairness, and responsible AI development.",
    icon: "⚖️",
    color: "#14b8a6",
  },
];

async function initializeCategories() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    console.log("Initializing categories...");

    for (const category of categories) {
      await connection.execute(
        "INSERT INTO categories (name, slug, description, icon, color) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE description=?, icon=?, color=?",
        [
          category.name,
          category.slug,
          category.description,
          category.icon,
          category.color,
          category.description,
          category.icon,
          category.color,
        ]
      );
      console.log(`✓ Created/Updated category: ${category.name}`);
    }

    await connection.end();
    console.log("✓ Categories initialized successfully!");
  } catch (error) {
    console.error("Error initializing categories:", error);
    process.exit(1);
  }
}

initializeCategories();
