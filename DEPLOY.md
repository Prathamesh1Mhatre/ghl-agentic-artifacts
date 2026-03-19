# Deployment Guide - GHL Agentic Artifacts Registry

## Quick Deploy (5 minutes)

### Step 1: Create GitHub Repository

1. Go to: https://github.com/organizations/GoHighLevel/repositories/new
2. Repository name: `ghl-agentic-artifacts`
3. Visibility: **Private**
4. Click "Create repository"

### Step 2: Push Code

```bash
cd /Users/prathamesh.mhatre/Documents/GitHub/GHL-Agentic-Workspace-V1/ghl-agentic-artifacts
git remote add origin git@github.com:GoHighLevel/ghl-agentic-artifacts.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to repository: https://github.com/GoHighLevel/ghl-agentic-artifacts
2. Click **Settings** → **Pages** (left sidebar)
3. Under "Build and deployment":
   - Source: **GitHub Actions**
4. Click **Save**

### Step 4: Wait for Deployment

- GitHub Actions will automatically run
- Check progress: https://github.com/GoHighLevel/ghl-agentic-artifacts/actions
- Deployment takes ~1-2 minutes

### Step 5: Access Your Site

**URL:** https://gohighlevel.github.io/ghl-agentic-artifacts/

---

## Troubleshooting

### "404 - There isn't a GitHub Pages site here"

**Cause:** GitHub Actions hasn't deployed yet or Pages isn't enabled

**Fix:**
1. Check Actions tab for deployment status
2. Verify Pages is enabled in Settings → Pages
3. Make sure source is set to "GitHub Actions"
4. Wait 2-3 minutes after first push

### Build Fails

**Check:**
1. GitHub Actions logs: https://github.com/GoHighLevel/ghl-agentic-artifacts/actions
2. Look for Ruby/Jekyll errors
3. Verify Gemfile has correct dependencies

### Site Shows Old Content

**Fix:**
```bash
# Force rebuild
git commit --allow-empty -m "trigger rebuild"
git push
```

---

## Alternative: Netlify Deploy (No GitHub Required)

If you want to deploy without creating GitHub repo:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd /Users/prathamesh.mhatre/Documents/GitHub/GHL-Agentic-Workspace-V1/ghl-agentic-artifacts/docs
netlify deploy --prod

# You'll get a URL like: https://ghl-agentic-artifacts.netlify.app
```

---

## Current Status

- ✅ Repository code ready
- ✅ Jekyll site configured
- ✅ Test artifact created
- ⏳ Waiting for GitHub repo creation
- ⏳ Waiting for Pages enablement
- ⏳ Waiting for first deployment

**Next:** Create the GitHub repository following Step 1 above.
