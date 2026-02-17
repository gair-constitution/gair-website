# GAIR GitHub Setup Guide

This guide walks through setting up the GAIR repository on GitHub and configuring GitHub Pages for deployment.

## Prerequisites

- A GitHub account
- Git installed locally
- Access to create repositories

## Option 1: Create New Repository

### 1. Create Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `gair-constitution`
3. Description: "GAIR — Global Agreement on Intelligent Rights"
4. Set to **Public**
5. **Do NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### 2. Push Local Code to GitHub

```bash
cd "C:\Users\bvadr\OneDrive\Desktop\GAIR"

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: GAIR website with constitution, blog posts, and API"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/gair-constitution.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source":
   - Select **GitHub Actions** (recommended)
4. The workflow `.github/workflows/deploy.yml` will automatically run
5. Wait for the deployment to complete (~1-2 minutes)
6. Your site will be live at: `https://YOUR_USERNAME.github.io/gair-constitution/`

### 4. Update Website URLs

If you want the site at the root (`https://YOUR_USERNAME.github.io` instead of `/gair-constitution`), you'll need to:

1. Rename the repository to `YOUR_USERNAME.github.io`
2. Or configure a custom domain in Settings → Pages

## Option 2: Fork Existing Repository

If you want to contribute to an existing GAIR repository:

1. Go to the existing repository
2. Click **Fork** in the top-right corner
3. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/gair-constitution.git
   ```
4. Make changes and submit a Pull Request

## Verification Checklist

After setup, verify:

- [ ] Repository is public
- [ ] GitHub Actions workflow runs successfully
- [ ] Site loads at expected URL
- [ ] All pages accessible:
  - `/` (homepage)
  - `/constitution.html`
.html`
  -  - `/developers `/blog/` (blog index)
  - `/blog/*.html` (individual posts)
  - `/api/*.yaml` (machine-readable APIs)

## Troubleshooting

### "Remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/gair-constitution.git
```

### Workflow fails to deploy

1. Check the Actions tab for error details
2. Ensure workflow file is at `.github/workflows/deploy.yml`
3. Verify no syntax errors in YAML files

### Pages not updating

1. Check that you're pushing to the `main` branch
2. GitHub Pages can take 2-3 minutes to update
3. Try clearing your browser cache

## Custom Domain (Optional)

To use a custom domain:

1. Go to **Settings** → **Pages**
2. Enter your custom domain under "Custom domain"
3. Create appropriate DNS records:
   - For apex domain: A records pointing to GitHub IPs
   - For subdomain: CNAME record to `YOUR_USERNAME.github.io`
4. Enable "Enforce HTTPS" after DNS propagates

## Next Steps

After deployment:

1. Update repository description and topics
2. Add a pinned repository on your profile
3. Share the link in relevant communities
4. Start attracting Voluntary Adherents!

---

*GAIR — Building the legal foundation for autonomous AI*
