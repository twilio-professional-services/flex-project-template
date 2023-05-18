---
sidebar_label: Standalone Plugin Usage
sidebar_position: 4
title: Using template for a standalone plugin
---

# Okay, but why a template for a standalone feature?

We often see development teams that want to use solutions that are developed and publicly shared. Typically these solutions are `Type B` deliverables. As a result, consumers of these solutions often look to take ownership by rewriting the code and they typically start that by organizing the code into the package structure for a single plugin solution. By following the template structure and **standardizing** the approach, it reduces the overhead for development teams to utilize the sample code and accelerates their ability to harden it for their own needs.

It also makes reuse of the serverless work that often gets re-written over and over again between plugins, minimizing overhead.

---

## Usage Instructions

1. Fork the template and give it a name
2. Install dependencies - you can skip when prompted to enter auth token

```bash
npm install
```

3. Remove the features; from the root folder of a checkout of your new repository run

```bash
npm run remove-features
```

4. Rename the template; from the root folder of a checkout of your new repository run

```bash
npm run rename-template <template-name>
```

5. ensure the dependencies are updated - this will also generate appConfig.js

```bash
npm install
```

6. test everything works

```bash
npm start
```

7. Push your changes to your repository - this is your new baseline
8. You can follow the instructions for [local development setup](/setup-guides/local-setup-and-use) and then [adding a feature](/setup-guides/building-with-template#adding-a-feature)
