---
sidebar_label: Updating Documentation
sidebar_position: 10
title: "Updating Documentation"
---

# Updating Documentation

This guide explains how to update the ConnieRTC documentation site. Perfect for developers who need to add new features, fix content, or improve the documentation.

## Quick Reference

**For urgent updates:**
```bash
# 1. Edit files in docs/docs/ folder
# 2. Commit and push
git add docs/docs/your-file.md
git commit -m "Update documentation: describe your changes"
git push origin main
```

**Site updates automatically** via GitHub Pages in ~2-3 minutes.

## Documentation Structure

Our documentation is organized by audience:

```
docs/docs/
├── 00_introduction.md           # Landing page with audience selection
├── end-users/                   # End-user documentation
│   ├── cbo-admins/             # CBO administrators  
│   ├── supervisors/            # Team supervisors
│   └── staff-agents/           # Call center agents
├── developers/                  # Developer documentation
│   ├── general/                # Cross-cutting developer topics
│   ├── frontend/               # Frontend-specific docs
│   └── backend/                # Backend-specific docs
├── feature-library/            # Feature documentation
└── building/                   # Build and deployment guides
```

## Local Development

### Prerequisites
- Node.js 18+ (Node.js 20+ recommended)
- This repository cloned locally

### Running Docs Locally

```bash
# Navigate to docs directory
cd docs

# Install dependencies (first time only)
npm install

# Start development server
npm start
```

The docs will be available at `http://localhost:3010` with live reload.

### Testing Your Changes Locally

**Always test locally before deploying!** Here's what to check:

1. **Landing Page** - Verify the audience selection boxes work and look correct
2. **Navigation** - Test clicking through different sidebar sections
3. **Links** - Check that internal links work (some may 404 if pages don't exist yet - that's expected)
4. **Content Formatting** - Ensure Markdown renders correctly
5. **Responsive Design** - Check how it looks on different screen sizes
6. **Live Reload** - Make a small edit and verify changes appear immediately

### Expected Behavior
- **Existing pages** should load correctly and show proper sidebar navigation
- **Missing pages** will show 404 errors (expected during development)
- **Changes** appear instantly thanks to live reload
- **Sidebar labels** should show "Connie End User" and "Connie Developer" branding

If everything looks good locally, you're ready to deploy!

## Making Changes

### 1. Edit Content

Edit Markdown files in `docs/docs/` using your preferred editor:

```bash
# Example: Update CBO admin getting started guide
vim docs/docs/end-users/cbo-admins/getting-started.md
```

### 2. Preview Changes

If running locally:
- Changes appear instantly at `http://localhost:3010`
- Check formatting and links work correctly

### 3. Commit Changes

```bash
# Stage your changes
git add docs/docs/your-modified-file.md

# Commit with descriptive message
git commit -m "Update CBO admin setup guide with new screenshots"

# Push to trigger deployment
git push origin main
```

### 4. Verify Deployment

- **GitHub Pages** automatically rebuilds the site
- Check https://connieml.github.io/connieRTC-flex/ in ~2-3 minutes
- Look for your changes to confirm deployment

## Content Guidelines

### Writing Style
- **Clear and concise** - Users are often under pressure
- **Action-oriented** - Tell users what to do, not just what things are
- **Audience-specific** - CBO admins need different info than developers

### Markdown Best Practices
- Use **descriptive headings** for easy navigation
- Include **code blocks** with syntax highlighting
- Add **links** to related documentation
- Use **callouts** for important information

### Example Content Structure
```markdown
---
sidebar_label: Short Name
sidebar_position: 1
title: "Full Page Title"
---

# Main Heading

Brief introduction paragraph explaining what this page covers.

## Prerequisites

What the user needs before starting:
- ✅ Required item 1
- ✅ Required item 2

## Step-by-Step Guide

### Step 1: Do This First
Instructions with code examples:

```bash
command to run
```

### Step 2: Then This
More instructions...

## Troubleshooting

Common issues and solutions.

## Next Steps

What to do after completing this guide.
```

## Sidebar Configuration

The sidebar is configured in `docs/sidebars.js`:

```javascript
module.exports = {
  // End-user documentation
  endUserCBOAdmins: [
    'end-users/cbo-admins/getting-started',
    'end-users/cbo-admins/manual-setup',
    // ... more pages
  ],
  
  // Developer documentation
  developerGeneral: [
    'developers/general/getting-started',
    'developers/general/updating-docs',
    // ... more pages
  ],
};
```

## Adding New Pages

### 1. Create the File
```bash
# Example: Add new troubleshooting guide
touch docs/docs/end-users/cbo-admins/troubleshooting.md
```

### 2. Add Front Matter
```markdown
---
sidebar_label: Troubleshooting
sidebar_position: 5
title: "CBO Admin Troubleshooting"
---

# Content goes here...
```

### 3. Update Sidebar
Edit `docs/sidebars.js` to include your new page:

```javascript
endUserCBOAdmins: [
  'end-users/cbo-admins/getting-started',
  'end-users/cbo-admins/manual-setup',
  'end-users/cbo-admins/troubleshooting',  // ← Add this line
],
```

## Advanced Features

### Interactive Components
Use MDX for interactive elements:

```jsx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="google-sheets" label="Google Sheets">
    Instructions for Google Sheets setup...
  </TabItem>
  <TabItem value="mysql" label="MySQL">
    Instructions for MySQL setup...
  </TabItem>
</Tabs>
```

### Images and Assets
Place images in `docs/static/img/`:

```markdown
![ConnieRTC Dashboard](../../../static/img/dashboard-screenshot.png)
```

### Code Blocks with Highlighting
```javascript title="serverless-functions/src/lookup-customer.js"
exports.handler = async (context, event, callback) => {
  // Your code here
};
```

## Deployment Process

### Automatic Deployment
1. **Push to main branch** triggers GitHub Actions
2. **GitHub Pages** rebuilds the site automatically
3. **Live site** updates in ~2-3 minutes

### Manual Deployment (if needed)
```bash
# Build the site locally
cd docs
npm run build

# Deploy to GitHub Pages (rarely needed)
npm run deploy
```

## Common Issues

### **Links Don't Work**
- Check that file paths match exactly
- Use relative paths: `../other-page.md`
- Verify sidebar configuration

### **Images Not Loading**
- Ensure images are in `docs/static/img/`
- Use correct path: `![Alt text](../../../static/img/image.png)`

### **Build Fails**
- Check Markdown syntax
- Verify front matter is valid YAML
- Look for broken links

### **Changes Not Appearing**
- Check GitHub Actions for build errors
- Clear browser cache
- Verify you pushed to `main` branch

## Getting Help

- **GitHub Issues**: Report documentation bugs
- **Developer Discord**: Real-time help from the team
- **Pull Requests**: Submit improvements directly

---

*Questions about updating documentation? Ask in our developer Discord or open a GitHub issue!*