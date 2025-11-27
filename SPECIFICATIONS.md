# Daily AI Hub - Technical Specifications Implementation

## Project Overview
Daily AI Hub is an automated AI news platform that generates high-quality, SEO-optimized articles using a sophisticated 4-step Gemini API pipeline. The system operates entirely within free tier limits while maintaining professional quality standards.

## Implementation Status

### Phase 1: Core Infrastructure ✅
- [x] Database schema with articles, categories, tags, users
- [x] Job queue system for content generation
- [x] Pending jobs tracking and retry mechanism
- [x] 16 sample articles seeded across all 8 categories

### Phase 2: Advanced Content Generation (4 Prompts)
- [ ] **Prompt A**: Story Discovery & Source Identification
  - Trend detection from Google Trends
  - Academic paper discovery
  - Industry news aggregation
  
- [ ] **Prompt B**: Article Draft Generation
  - Comprehensive outline creation
  - Evidence-based writing
  - Proper citation formatting
  
- [ ] **Prompt C**: Strategic Editing & SEO Optimization
  - Keyword integration
  - Meta description generation
  - Internal linking strategy
  
- [ ] **Prompt D**: Human-Level Final Review
  - Fact verification
  - Plagiarism detection
  - Quality scoring

### Phase 3: Queue Management & Retry Logic
- [ ] Exponential backoff retry mechanism
- [ ] Failed job tracking in pending-jobs.json
- [ ] Rate limiting (1-2 seconds between jobs)
- [ ] Error categorization and handling

### Phase 4: Archive & Analytics
- [ ] Monthly archiving system
- [ ] Performance metrics tracking
- [ ] Strategic insights generation
- [ ] Trend analysis

### Phase 5: SEO & Metadata
- [ ] Dynamic Sitemap generation
- [ ] RSS Feed generation
- [ ] JSON Feed generation
- [ ] robots.txt optimization
- [ ] JSON-LD structured data
- [ ] Canonical URLs

### Phase 6: GitHub Actions Automation
- [ ] Daily generation workflow (2 articles per category)
- [ ] Weekly analytics workflow
- [ ] Monthly archiving workflow
- [ ] Automated Sitemap updates

### Phase 7: Testing & Quality
- [ ] Vitest unit tests for all modules
- [ ] Integration tests
- [ ] Performance benchmarks
- [ ] SEO validation

### Phase 8: Deployment
- [ ] Cloudflare deployment
- [ ] Custom domain configuration
- [ ] SSL/TLS setup
- [ ] Monitoring and analytics

## Free Tier Constraints
- **Gemini API**: 15 requests per minute (RPM)
- **Database**: MySQL with reasonable query limits
- **Storage**: S3 for images and archives
- **Bandwidth**: Cloudflare free tier limits

## Key Files
- `server/advancedContentGenerator.ts` - 4-prompt pipeline
- `server/jobQueueManager.ts` - Queue and retry logic
- `server/smartImageGenerator.ts` - Cover image generation
- `server/archiveManager.ts` - Monthly archiving
- `server/sitemapGenerator.ts` - SEO feeds
- `.github/workflows/` - Automation workflows

## Decision Log
- Using Gemini API for all cognitive tasks (writing, analysis, reasoning)
- Using Manus agent for execution tasks (git, file system, deployment)
- Implementing 2-second rate limiting between jobs to respect free tier
- Storing failed jobs in JSON files for manual review and retry
