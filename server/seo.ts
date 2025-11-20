/**
 * Generate SEO metadata for articles and pages
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  canonicalUrl: string;
  author: string;
  publishedDate: string;
  modifiedDate: string;
  schema: Record<string, any>;
}

/**
 * Generate SEO metadata for an article
 */
export function generateArticleSEO(
  article: {
    id: number;
    title: string;
    excerpt: string;
    slug: string;
    image: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
    category: string;
  },
  baseUrl: string = "https://ainewshub.com"
): SEOMetadata {
  const url = `${baseUrl}/article/${article.slug}`;
  
  // Generate keywords from title and category
  const keywords = [
    article.category,
    "AI",
    "artificial intelligence",
    "news",
    ...article.title.split(" ").filter((word) => word.length > 3),
  ].slice(0, 10);

  // Generate JSON-LD schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.image,
    author: {
      "@type": "Person",
      name: article.author,
    },
    datePublished: article.createdAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    publisher: {
      "@type": "Organization",
      name: "AI News Hub",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
  };

  return {
    title: `${article.title} | AI News Hub`,
    description: article.excerpt.substring(0, 160),
    keywords,
    ogTitle: article.title,
    ogDescription: article.excerpt.substring(0, 160),
    ogImage: article.image,
    ogUrl: url,
    canonicalUrl: url,
    author: article.author,
    publishedDate: article.createdAt.toISOString(),
    modifiedDate: article.updatedAt.toISOString(),
    schema,
  };
}

/**
 * Generate SEO metadata for category pages
 */
export function generateCategorySEO(
  category: {
    name: string;
    slug: string;
    description?: string;
  },
  baseUrl: string = "https://ainewshub.com"
): SEOMetadata {
  const url = `${baseUrl}/category/${category.slug}`;
  const description =
    category.description ||
    `Explore the latest articles and insights about ${category.name} in artificial intelligence.`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description,
    url,
    publisher: {
      "@type": "Organization",
      name: "AI News Hub",
    },
  };

  return {
    title: `${category.name} Articles | AI News Hub`,
    description: description.substring(0, 160),
    keywords: [category.name, "AI", "news", "articles"],
    ogTitle: `${category.name} Articles`,
    ogDescription: description.substring(0, 160),
    ogImage: `${baseUrl}/og-image.png`,
    ogUrl: url,
    canonicalUrl: url,
    author: "AI News Hub",
    publishedDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
    schema,
  };
}

/**
 * Generate SEO metadata for homepage
 */
export function generateHomepageSEO(
  baseUrl: string = "https://ainewshub.com"
): SEOMetadata {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI News Hub",
    url: baseUrl,
    description:
      "Stay updated with the latest AI news, trends, and breakthroughs. Daily articles covering Machine Learning, NLP, Computer Vision, Robotics, and more.",
    publisher: {
      "@type": "Organization",
      name: "AI News Hub",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
  };

  return {
    title: "AI News Hub - Automated Content Platform",
    description:
      "Stay updated with the latest AI news, trends, and breakthroughs. Daily articles covering Machine Learning, NLP, Computer Vision, Robotics, and more.",
    keywords: [
      "AI news",
      "artificial intelligence",
      "machine learning",
      "NLP",
      "computer vision",
      "robotics",
      "generative AI",
    ],
    ogTitle: "AI News Hub - Automated Content Platform",
    ogDescription:
      "Stay updated with the latest AI news, trends, and breakthroughs.",
    ogImage: `${baseUrl}/og-image.png`,
    ogUrl: baseUrl,
    canonicalUrl: baseUrl,
    author: "AI News Hub",
    publishedDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
    schema,
  };
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
  baseUrl: string = "https://ainewshub.com"
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}

/**
 * Generate meta tags HTML
 */
export function generateMetaTags(seo: SEOMetadata): string {
  return `
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}" />
    <meta name="keywords" content="${seo.keywords.join(", ")}" />
    <meta name="author" content="${escapeHtml(seo.author)}" />
    <meta property="og:title" content="${escapeHtml(seo.ogTitle)}" />
    <meta property="og:description" content="${escapeHtml(seo.ogDescription)}" />
    <meta property="og:image" content="${seo.ogImage}" />
    <meta property="og:url" content="${seo.ogUrl}" />
    <meta property="og:type" content="article" />
    <link rel="canonical" href="${seo.canonicalUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(seo.ogTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(seo.ogDescription)}" />
    <meta name="twitter:image" content="${seo.ogImage}" />
    <meta name="article:published_time" content="${seo.publishedDate}" />
    <meta name="article:modified_time" content="${seo.modifiedDate}" />
    <script type="application/ld+json">${JSON.stringify(seo.schema)}</script>
  `.trim();
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}
