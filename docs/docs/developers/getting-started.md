---
sidebar_label: Getting Started
sidebar_position: 1
title: "Developer - Getting Started"
---

# Getting Started for Developers

Welcome to ConnieRTC development! Whether you're contributing to the platform or customizing it for your organization, this guide will get you up and running.

## Development Environment Setup

### Prerequisites
- ✅ **Node.js 18+** - [Download here](https://nodejs.org)
- ✅ **Twilio Account** - [Sign up free](https://www.twilio.com/try-twilio)
- ✅ **Twilio CLI** - [Install guide](https://www.twilio.com/docs/twilio-cli/quickstart)
- ✅ **Git** - For version control

### Quick Setup

```bash
# 1. Fork the repository on GitHub (click "Fork" button)
# 2. Clone YOUR fork (not the main repository)
git clone https://github.com/YOUR-USERNAME/connieRTC-flex
cd connieRTC-flex

# 3. Add the main repository as upstream
git remote add upstream https://github.com/ConnieML/connieRTC-flex

# 4. Install dependencies
npm install

# 5. Set up environment
npm run generate-env

# 6. Start development server
npm start
```

## Architecture Overview

ConnieRTC follows a modular architecture:

```
├── plugin-flex-ts-template-v2/   # Frontend (React/TypeScript)
├── serverless-functions/         # Backend (Node.js/Twilio)
├── docs/                        # Documentation (Docusaurus)
├── infra-as-code/               # Infrastructure (Terraform)
└── addons/                      # Additional features
```

## Development Workflow

### 1. Set Up Your Environment
Follow the [Quick Setup](#quick-setup) above to get your development environment ready.

### 2. Create a Feature Branch
Always work on a separate branch for each contribution:

```bash
# Make sure you're on main and up to date
git checkout main
git pull upstream main

# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/describe-the-fix
# or  
git checkout -b docs/update-section-name
```

### 3. Make Your Changes
- **Code changes** - Follow our coding standards
- **Documentation** - Test locally first (`cd docs && npm start`)
- **Tests** - Add tests for new features

### 4. Test Thoroughly
```bash
# Run all tests
npm test

# For documentation changes, test locally
cd docs
npm start  # Check http://localhost:3010
```

### 5. Commit Your Changes
Use clear, descriptive commit messages:

```bash
git add .
git commit -m "Add CBO admin troubleshooting guide

- Add common setup issues and solutions
- Include screenshots for complex steps  
- Update navigation to include new guide"
```

### 6. Submit a Pull Request
```bash
# Push your branch to your fork
git push origin feature/your-feature-name

# Go to GitHub and create a Pull Request:
# 1. Navigate to your fork on GitHub
# 2. Click "Compare & pull request" 
# 3. Fill out the PR template
# 4. Wait for review and approval
```

## Key Developer Resources

### Frontend Development
- **React Components** - UI component library
- **Flex Hooks** - Integration with Twilio Flex
- **Styling Guide** - CSS and theming

### Backend Development  
- **Serverless Functions** - API and business logic
- **Database Integration** - Data access patterns
- **Security Best Practices** - Secure coding

### Documentation
- **[Updating Documentation](./updating-docs)** - How to update these docs
- **Writing Guidelines** - Documentation standards
- **Local Development** - Running docs locally

## Pull Request Guidelines

### What Makes a Good PR?
- **Single focus** - One feature/fix per PR
- **Clear description** - Explain what and why
- **Tests included** - Especially for new features
- **Documentation updated** - If you change functionality
- **Small and reviewable** - Easier to review = faster merge

### PR Review Process
1. **Automated checks** - CI runs tests and linting
2. **Code review** - Team member reviews your changes
3. **Discussion** - Address any feedback or questions
4. **Approval** - Maintainer approves the PR
5. **Merge** - Changes go live automatically

### Getting Your PR Merged Faster
- **Follow the templates** - Use our PR template
- **Respond quickly** - Address feedback promptly
- **Be patient** - Reviews take time, especially for large changes
- **Ask questions** - Don't hesitate to ask for clarification

## Community & Support

- **[GitHub Repository](https://github.com/ConnieML/connieRTC-flex)** - Source code and issues
- **[Create an Issue](https://github.com/ConnieML/connieRTC-flex/issues/new)** - Report bugs or request features
- **[Developer Discord](https://discord.gg/connie-dev)** - Real-time developer chat
- **Contributing Guide** - How to contribute code (coming soon)
- **Code of Conduct** - Community standards (coming soon)

## Common Questions

### "I'm new to open source. Where do I start?"
1. **Read the documentation** - Understand what ConnieRTC does
2. **Set up locally** - Get the project running on your machine
3. **Find a good first issue** - Look for issues labeled "good first issue"
4. **Ask questions** - Join our Discord and don't be afraid to ask!

### "Can I work on documentation?"
**Absolutely!** Documentation contributions are incredibly valuable:
- Fix typos or unclear instructions
- Add missing setup steps
- Create guides for your use case
- Improve accessibility and readability

### "I found a bug. What do I do?"
1. **Check existing issues** - Maybe it's already reported
2. **Create a detailed issue** - Steps to reproduce, expected vs actual behavior
3. **Consider fixing it yourself** - Great way to contribute!

### "My PR was rejected. What now?"
- **Read the feedback carefully** - Reviewers want to help you succeed
- **Ask questions** - If feedback is unclear, ask for clarification  
- **Make the requested changes** - Address each point raised
- **Learn and improve** - Every rejection makes you a better contributor

## Next Steps

1. **[Fork the repository](https://github.com/ConnieML/connieRTC-flex/fork)** and set up locally
2. **Explore the codebase** - Look around and understand the structure
3. **Find your first contribution** - Documentation, bug fixes, or features
4. **[Join the developer community](https://discord.gg/connie-dev)** - Get help and connect with other contributors

---

*Ready to build something amazing? Let's get started!*