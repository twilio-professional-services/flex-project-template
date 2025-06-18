#!/bin/bash

# ConnieRTC Docs Deployment Setup Script
# This script helps configure GitHub repository settings for docs deployment

echo "🚀 ConnieRTC Docs Deployment Setup"
echo "======================================="
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: This script must be run from the root of your git repository"
    exit 1
fi

# Check current remote origin
echo "📍 Current git remote origin:"
git remote get-url origin
echo ""

# Get repository info
REPO_URL=$(git remote get-url origin)
if [[ $REPO_URL == *"github.com"* ]]; then
    # Extract owner and repo name from GitHub URL
    if [[ $REPO_URL == *"git@github.com"* ]]; then
        # SSH format: git@github.com:owner/repo.git
        REPO_INFO=$(echo $REPO_URL | sed 's/git@github.com://' | sed 's/\.git$//')
    else
        # HTTPS format: https://github.com/owner/repo.git
        REPO_INFO=$(echo $REPO_URL | sed 's|https://github.com/||' | sed 's/\.git$//')
    fi
    
    OWNER=$(echo $REPO_INFO | cut -d'/' -f1)
    REPO_NAME=$(echo $REPO_INFO | cut -d'/' -f2)
    
    echo "✅ GitHub repository detected:"
    echo "   Owner: $OWNER"
    echo "   Repository: $REPO_NAME"
    echo ""
else
    echo "❌ Error: This doesn't appear to be a GitHub repository"
    exit 1
fi

echo "📋 Manual Setup Required:"
echo "========================="
echo ""
echo "1. 🔧 Enable GitHub Pages:"
echo "   • Go to: https://github.com/$OWNER/$REPO_NAME/settings/pages"
echo "   • Under 'Source', select 'GitHub Actions'"
echo ""
echo "2. 🔑 Set Repository Variable:"
echo "   • Go to: https://github.com/$OWNER/$REPO_NAME/settings/secrets/actions"
echo "   • Click 'Variables' tab"
echo "   • Click 'New repository variable'"
echo "   • Name: DEPLOY_DOCS"
echo "   • Value: true"
echo ""
echo "3. 🔐 Configure Workflow Permissions:"
echo "   • Go to: https://github.com/$OWNER/$REPO_NAME/settings/actions"
echo "   • Under 'Workflow permissions', select 'Read and write permissions'"
echo "   • Check 'Allow GitHub Actions to create and approve pull requests'"
echo ""
echo "4. 🚀 Deploy the docs:"
echo "   • Option A: Push changes to main branch:"
echo "     git add ."
echo "     git commit -m 'Configure docs deployment'"
echo "     git push origin main"
echo ""
echo "   • Option B: Manual trigger:"
echo "     - Go to: https://github.com/$OWNER/$REPO_NAME/actions"
echo "     - Click 'Deploy docs site to GH pages'"
echo "     - Click 'Run workflow'"
echo ""
echo "5. ✅ Access your deployed docs:"
echo "   • URL: https://$OWNER.github.io/$REPO_NAME/"
echo ""
echo "🔍 Need help? Check the detailed setup guide:"
echo "   📄 scripts/setup-docs-deployment.md"
echo ""
echo "Happy documenting! 📚"
