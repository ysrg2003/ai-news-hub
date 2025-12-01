# Daily AI Hub - Deployment Guide

## Cloudflare Pages Deployment

### Prerequisites
- Cloudflare Account
- GitHub Account (connected to Cloudflare)
- API Token from Cloudflare

### Deployment Steps

#### Option 1: Using Cloudflare UI (Recommended for First Time)
1. Go to https://dash.cloudflare.com/
2. Navigate to "Pages" in the left sidebar
3. Click "Create a project"
4. Select "Connect to Git"
5. Authorize GitHub and select `ysrg2003/ai-news-hub`
6. Configure build settings:
   - Framework: None
   - Build command: `pnpm build`
   - Build output directory: `dist/public`
   - Environment variables: Add all required secrets
7. Click "Save and Deploy"

#### Option 2: Using Wrangler CLI
```bash
# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy dist/public --project-name=daily-ai-hub
```

#### Option 3: Using GitHub Actions (Automated)
1. Add Cloudflare API Token to GitHub Secrets:
   - Go to Settings → Secrets and variables → Actions
   - Add `CLOUDFLARE_API_TOKEN`
   - Add `CLOUDFLARE_ACCOUNT_ID`

2. The workflow will automatically deploy on every push to main

### Environment Variables Required
```
DATABASE_URL
GEMINI_API_KEY
JWT_SECRET
VITE_APP_ID
OAUTH_SERVER_URL
VITE_OAUTH_PORTAL_URL
OWNER_OPEN_ID
OWNER_NAME
VITE_APP_TITLE
VITE_APP_LOGO
BUILT_IN_FORGE_API_URL
BUILT_IN_FORGE_API_KEY
VITE_FRONTEND_FORGE_API_KEY
VITE_FRONTEND_FORGE_API_URL
```

### Verification
After deployment:
1. Visit your Cloudflare Pages URL
2. Test all features:
   - Homepage loads correctly
   - Search functionality works
   - Category filtering works
   - Articles display properly
   - Admin dashboard accessible

### Custom Domain Setup (After Verification)
1. In Cloudflare Pages project settings
2. Go to "Custom domains"
3. Add your domain
4. Update DNS records as instructed

## Troubleshooting

### Build Fails
- Check that all dependencies are installed: `pnpm install`
- Verify build command works locally: `pnpm build`
- Check environment variables are set correctly

### Site Not Loading
- Check Cloudflare Pages deployment logs
- Verify `dist/public` directory exists and contains `index.html`
- Check for TypeScript errors: `pnpm check`

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check network connectivity from Cloudflare
- Ensure database user has proper permissions
