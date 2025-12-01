# Daily AI Hub - Automated AI News Platform

**A sophisticated, production-ready platform for automated AI news content generation, curation, and distribution.**

## 🚀 Features

### Core Features
- ✅ **Automated Content Generation** - 4-step Gemini API pipeline (Discovery → Draft → SEO Optimization → Review)
- ✅ **8 AI Categories** - Machine Learning, NLP, Computer Vision, Robotics, Generative AI, AI Applications, AI Research, AI Ethics
- ✅ **Advanced Search** - Full-text search with Gemini-powered recommendations
- ✅ **Smart Image Generation** - Category-specific visual identities with SVG cover images
- ✅ **Admin Dashboard** - Content management, job queue monitoring, analytics
- ✅ **SEO Optimized** - Dynamic sitemap, robots.txt, JSON-LD schemas, meta tags
- ✅ **Responsive Design** - Mobile-first, dark/light mode support
- ✅ **User Engagement** - Tags, recommendations, social sharing

### Technical Features
- ✅ **Database** - MySQL with Drizzle ORM
- ✅ **Authentication** - Manus OAuth integration
- ✅ **Caching** - In-memory cache with TTL for performance
- ✅ **File Storage** - S3 integration for images and assets
- ✅ **API** - tRPC for type-safe backend procedures
- ✅ **Testing** - 75+ comprehensive Vitest tests
- ✅ **CI/CD** - GitHub Actions workflows

## 📊 Project Statistics

- **12 Sample Articles** - Ready for immediate testing
- **75 Passing Tests** - Complete test coverage
- **8 Categories** - Pre-configured with sample data
- **4-Prompt Pipeline** - Advanced content generation system
- **100% TypeScript** - Full type safety across the stack

## 🛠️ Tech Stack

### Frontend
- React 19 + TypeScript
- Tailwind CSS 4
- tRPC for API calls
- Wouter for routing
- Shadcn/ui components

### Backend
- Express 4
- tRPC 11
- Drizzle ORM
- Zod for validation
- Gemini API for AI

### Infrastructure
- MySQL/TiDB Database
- S3 File Storage
- Cloudflare Pages (Deployment)
- GitHub Actions (Automation)

## 📦 Installation & Setup

### Prerequisites
- Node.js 22+
- pnpm
- MySQL database
- Gemini API key
- Cloudflare account

### Local Development

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm db:push

# Seed sample data
node scripts/seed-articles.mjs

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## 🚀 Deployment

### Cloudflare Pages Deployment

**Option 1: Using Cloudflare UI (Recommended)**
1. Go to https://dash.cloudflare.com/
2. Navigate to Pages → Create project
3. Connect GitHub repository: `ysrg2003/ai-news-hub`
4. Build settings:
   - Build command: `pnpm build`
   - Build output: `dist/public`
5. Add environment variables
6. Deploy!

**Option 2: Using Wrangler CLI**
```bash
wrangler login
wrangler pages deploy dist/public --project-name=daily-ai-hub
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📝 Content Generation Pipeline

### 4-Step Process
1. **Prompt A: Story Discovery** - Identifies trending AI topics and relevant sources
2. **Prompt B: Draft Generation** - Creates comprehensive article draft with sections
3. **Prompt C: SEO Optimization** - Enhances for search engines and readability
4. **Prompt D: Human Review** - Final quality check and adjustments

### Free Tier Compliance
- **Rate Limiting**: 1-2 seconds between API calls (15 RPM limit)
- **Batch Processing**: 16 articles per day (2 per category)
- **Error Handling**: Automatic retry with exponential backoff
- **Queue Management**: Failed jobs stored in pending-jobs.json

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/fourPromptPipeline.test.ts

# Watch mode
pnpm test --watch
```

## 📚 Project Structure

```
daily-ai-hub/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   └── public/            # Static assets
├── server/                # Backend Express app
│   ├── _core/            # Framework plumbing
│   ├── routers.ts        # tRPC procedures
│   ├── db.ts             # Database queries
│   └── fourPromptPipeline.ts  # Content generation
├── drizzle/              # Database schema & migrations
├── scripts/              # Automation scripts
└── docs/                 # Documentation
```

## 🔐 Security

- ✅ OAuth authentication (Manus)
- ✅ Environment variable protection
- ✅ Database connection encryption
- ✅ API rate limiting
- ✅ Input validation with Zod
- ✅ CORS configuration
- ✅ SQL injection prevention (Drizzle ORM)

## 📈 Performance

- **Build Size**: ~800KB (minified)
- **Gzip Size**: ~210KB
- **Database Queries**: Optimized with indexes
- **Caching**: In-memory with TTL
- **Image Optimization**: SVG generation for covers
- **CDN**: Cloudflare global distribution

## 🎯 Roadmap

- [ ] Newsletter subscription (SendGrid integration)
- [ ] Google Analytics 4 integration
- [ ] Advanced personalization engine
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations

---

**Status**: Production Ready ✅
**Version**: 1.0.0
**Last Updated**: December 2025
