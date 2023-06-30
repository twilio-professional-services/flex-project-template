---
sidebar_label: Add new feature
sidebar_position: 6
title: Add new feature
---


If you want to add a new feature, then after followiing the steps to [run flex locally](/setup-guides/local-setup-and-use) from the root of the repository you can run

```bash
npm run add-feature <my-new-feature-name>
```

this will create a new feature folder under `plugin-flex-ts-template-v2/src/feature-library` and it will apply the boilerplate code so you can easily add in your functionality.  

if you are just getting started
- You can think of the components folder as where your UI goes.
- you can think of the helpers or utils folder as where your operations to backend services go
- and you can think of flex-hooks as where you declare how your components extend or get triggered by actions.
- the template discovers any folder in the feature library and identifies the hooks in flex-hooks to add it in

A simple example to get startd with is the [caller-id](feature-library/caller-id) feature that simply adds a component to the dialpad view for selecting your caller-id.  There is not a lot of code there so its easy to see whats going on.

For more details on any of these concepts see the information page over on the [plugin-flex-ts-template-v2](/how-it-works/plugin-flex-ts-template-v2)
