---
sidebar_label: Add new feature
title: Adding a new feature
---


If you want to add a new feature, after following the steps to [run Flex locally](/getting-started/run-locally), from the root of the repository you can run the following:

```bash
npm run add-feature <my-new-feature-name>
```

This will create a new feature folder under `plugin-flex-ts-template-v2/src/feature-library` and it will apply the boilerplate code so you can easily add in your functionality:
- Creates a feature directory under `feature-library`
- Adds an interface for feature configuration
- Adds a feature readme file
- Adds the feature to the `ui_attributes.common.json` config file
  - By default, the feature is added to the config with `enabled` set to `false`

Within the feature folder, there is a standard structure in place:
- You can think of the `custom-components` folder as where your UI goes.
- You can think of the `helpers` or `utils` folder as where your operations to backend services go
- You can think of `flex-hooks` as where you declare how your components extend or get triggered by actions.
- The template discovers any folder in the feature library and identifies the hooks in `flex-hooks` to add it in.
