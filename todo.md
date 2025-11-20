# AI News Hub - Project TODO

## Core Infrastructure & Database
- [x] Design and implement database schema (articles, categories, tags, users, jobs queue)
- [x] Create articles data storage system (articles-data.json)
- [x] Implement pending jobs queue system (pending-jobs.json)
- [x] Set up Drizzle ORM migrations

## Content Generation System
- [x] Implement 3-step Gemini API article generation pipeline
  - [x] Step 1: Story Discovery (trending) / Topic Selection (evergreen)
  - [x] Step 2: Article Draft Generation
  - [x] Step 3: Final Editing & SEO Optimization
- [x] Implement job queue processing with retry mechanism
- [x] Add response validation using Zod
- [x] Implement rate limiting (1-2 seconds between jobs)
- [x] Remove fallback article generation (quality-first approach)

## Image Generation
- [x] Create smart cover image generation engine
- [x] Build visual identity dictionary (colors & patterns per category)
- [x] Create conceptual icon library (SVG functions)
- [x] Implement image assembly and Base64 encoding

## Site Structure & Pages
- [x] Create 8 main categories (Machine Learning, NLP, Computer Vision, Robotics, Generative AI, AI Applications, AI Research, AI Ethics)
- [x] Build homepage with article listing and pagination
- [x] Create category pages with descriptions
- [x] Build individual article pages with Table of Contents
- [x] Create Privacy Policy page
- [x] Create Terms of Service page
- [x] Create Contact page
- [x] Create About Us page
- [x] Create Archive page
- [x] Create search results page

## Frontend Features
- [x] Implement responsive navigation
- [x] Add article metadata display (Author, Date, Read Time)
- [x] Implement Table of Contents with anchor links
- [x] Add social media sharing buttons
- [x] Create "About the Author" section
- [ ] Implement site-wide search feature (Gemini + Google Search)
- [x] Add pagination system for homepage
- [ ] Implement tag system with clickable links
- [x] Add article type badges (🔥 trending, 📖 evergreen)
- [ ] Create "Recommended for You" personalization section
- [ ] Implement user interest tracking (localStorage)

## Technical Enhancements
- [x] Automatic sitemap generation and updates
- [x] Dynamic sitemap.xml in public folder
- [x] Implement robots.txt for SEO
- [ ] Create monthly archiving script for old articles
- [ ] Implement archive file loading for old articles
- [ ] Add Google AdSense integration areas
- [ ] Implement internal linking strategy
- [ ] Add schema markup for SEO

## GitHub Actions & Automation
- [x] Set up daily article generation workflow
- [ ] Create weekly performance analysis script (Google Analytics integration)
- [ ] Implement strategic insights generation
- [ ] Set up monthly archiving job
- [ ] Create GitHub Actions workflows for CI/CD

## SEO & Metadata
- [ ] Implement meta tags generation
- [ ] Create SEO package for each article
- [ ] Add canonical URLs
- [ ] Implement breadcrumb navigation
- [ ] Create XML sitemap with auto-updates
- [ ] Add structured data (JSON-LD)

## Testing & Quality Assurance
- [ ] Write Vitest tests for article generation pipeline
- [ ] Test Gemini API integration
- [ ] Test job queue system
- [ ] Test image generation
- [ ] Test search functionality
- [ ] Test pagination
- [ ] Test responsive design

## Deployment & Integration
- [ ] Connect GitHub repository
- [ ] Set up Cloudflare integration
- [ ] Configure Cloudflare Workers (if needed)
- [ ] Set up environment variables
- [ ] Configure Gemini API key
- [ ] Test production deployment
- [ ] Set up monitoring and analytics

## Design & Styling
- [ ] Choose professional color palette
- [ ] Implement Tailwind CSS theming
- [ ] Create responsive layouts
- [ ] Design article cards
- [ ] Create category page designs
- [ ] Implement dark/light theme support
- [ ] Optimize typography and readability

## Performance Optimization
- [ ] Implement image optimization
- [ ] Add lazy loading for images
- [ ] Optimize bundle size
- [ ] Implement caching strategies
- [ ] Add performance monitoring

## Content Quality
- [ ] Implement editorial guidelines
- [ ] Add content validation
- [ ] Create quality scoring system
- [ ] Implement plagiarism checks
- [ ] Add fact-checking mechanisms
