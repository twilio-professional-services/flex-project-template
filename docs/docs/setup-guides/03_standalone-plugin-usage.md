---
sidebar_label: Standalone Plugin Usage
sidebar_position: 4
title: Using template for a standalone plugin
---

# Creating a standalone feature

You may want to use the template just to host your own features without any of the existing ones.  The template offers a lot of value in managing the assets around it to make the plugin a lot easier to consume.

Standardizing how we build plugins has a lot of benefits too, by following the template structure and **standardizing** the approach, it reduces the overhead for development teams to utilize the sample code and accelerates their ability to harden it for their own needs.

It also makes reuse of the serverless work that often gets re-written over and over again between plugins, minimizing overhead.

---

## Usage Instructions

1. [Generate a new repository from the template](https://github.com/twilio-professional-services/flex-project-template/generate) and give it a name
2. clone your new repository
```bash
git clone <repo-path>
```
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
8. You can follow the instructions for [local development setup](/setup-guides/local-setup-and-use) and then [adding a feature](/how-it-works/building-with-template#adding-a-feature)
