export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "Daily AI Hub";

export const APP_LOGO = import.meta.env.VITE_APP_LOGO || "https://placehold.co/128x128/6366f1/ffffff?text=AI";

export const APP_DESCRIPTION =
  "Daily AI news, research, and insights covering Machine Learning, NLP, Computer Vision, Robotics, Generative AI, and more. Stay informed with the latest AI trends and breakthroughs.";

// Categories
export const CATEGORIES = [
  { id: 1, name: "Machine Learning", slug: "machine-learning", icon: "🤖" },
  { id: 2, name: "Natural Language Processing", slug: "natural-language-processing", icon: "💬" },
  { id: 3, name: "Computer Vision", slug: "computer-vision", icon: "👁️" },
  { id: 4, name: "Robotics", slug: "robotics", icon: "🦾" },
  { id: 5, name: "Generative AI", slug: "generative-ai", icon: "✨" },
  { id: 6, name: "AI Applications", slug: "ai-applications", icon: "🚀" },
  { id: 7, name: "AI Research", slug: "ai-research", icon: "🔬" },
  { id: 8, name: "AI Ethics", slug: "ai-ethics", icon: "⚖️" },
];

// Pagination
export const ARTICLES_PER_PAGE = 12;
export const RELATED_ARTICLES_COUNT = 4;

// Article types
export const ARTICLE_TYPES = {
  TRENDING: "trending",
  EVERGREEN: "evergreen",
};

export const ARTICLE_TYPE_LABELS = {
  trending: "🔥 Trending",
  evergreen: "📖 Evergreen",
};

// SEO
export const SEO_KEYWORDS =
  "AI news, artificial intelligence, machine learning, deep learning, neural networks, AI trends, AI applications, AI research";

// Social sharing
export const SOCIAL_SHARE_PLATFORMS = {
  twitter: "https://twitter.com/intent/tweet",
  facebook: "https://www.facebook.com/sharer/sharer.php",
  linkedin: "https://www.linkedin.com/sharing/share-offsite/",
  reddit: "https://reddit.com/submit",
  email: "mailto:",
};

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
