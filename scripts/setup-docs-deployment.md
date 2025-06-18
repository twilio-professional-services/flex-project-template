# ConnieRTC Docs Deployment Setup

## Prerequisites
1. Your repository should be pushed to GitHub
2. You should have admin access to the repository

## GitHub Repository Setup Steps

### 1. Enable GitHub Pages
1. Go to your GitHub repository: `https://github.com/cjberno/connieRTC-flex`
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **GitHub Actions** (not Deploy from a branch)

### 2. Set Repository Variable
1. In your repository settings, go to **Settings** > **Secrets and variables** > **Actions**
2. Click on the **Variables** tab
3. Click **New repository variable**
4. Set:
   - **Name**: `DEPLOY_DOCS`
   - **Value**: `true`
5. Click **Add variable**

### 3. Enable Workflow Permissions
1. Go to **Settings** > **Actions** > **General**
2. Under **Workflow permissions**, select **Read and write permissions**
3. Check **Allow GitHub Actions to create and approve pull requests**
4. Click **Save**

### 4. Trigger Deployment
Once the above steps are complete, you can deploy the docs by:

**Option A: Push changes to main branch**
```bash
git add .
git commit -m "Configure docs deployment"
git push origin main
```

**Option B: Manual trigger**
1. Go to **Actions** tab in your repository
2. Click on "Deploy docs site to GH pages" workflow
3. Click **Run workflow** button
4. Click **Run workflow** to confirm

### 5. Access Your Deployed Docs
After successful deployment, your docs will be available at:
`https://cjberno.github.io/connieRTC-flex/`

## Local Testing
Before deploying, you can test the build locally:

```bash
cd docs
npm install
npm run build
npm run serve
```

## Troubleshooting

### Build Fails
- Check that all dependencies are installed: `npm install` in the docs folder
- Ensure all markdown files are properly formatted
- Check for broken links in your documentation

### Pages Not Loading
- Verify the `url` and `baseUrl` in `docusaurus.config.js` match your GitHub Pages URL
- Check that GitHub Pages is enabled and set to "GitHub Actions" source
- Verify the `DEPLOY_DOCS` variable is set to `true`

### Workflow Not Running
- Ensure the repository variable `DEPLOY_DOCS` is set to `true`
- Check that workflow permissions are set correctly
- Verify you're pushing to the `main` branch
