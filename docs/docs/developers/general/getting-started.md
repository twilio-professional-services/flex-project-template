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
# Clone the repository
git clone https://github.com/ConnieML/connieRTC-flex
cd connieRTC-flex

# Install dependencies
npm install

# Set up environment
npm run generate-env

# Start development server
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

1. **Set up your environment** with all required tools
2. **Understand the architecture** and codebase structure  
3. **Follow coding standards** for consistent code
4. **Run tests** to ensure quality
5. **Submit contributions** via pull requests

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

## Community & Support

- **[GitHub Repository](https://github.com/ConnieML/connieRTC-flex)** - Source code and issues
- **[Developer Discord](https://discord.gg/connie-dev)** - Real-time developer chat
- **Contributing Guide** - How to contribute code (coming soon)
- **Code of Conduct** - Community standards (coming soon)

## Next Steps

1. **Complete environment setup** (guide coming soon)
2. **Explore the codebase** (architecture docs coming soon)
3. **Make your first contribution** (contributing guide coming soon)
4. **[Join the developer community](https://discord.gg/connie-dev)**

---

*Ready to build something amazing? Let's get started!*