---
sidebar_label: Use for a specific feature
sidebar_position: 2
title: Use the template for a specific feature
---

You may wish to deploy only a single feature from the template. There are two ways to remove features from the template:

- The `remove-features` script, which allows you to remove all features from the template, keeping only the features you specify. This script also removes those feature references from GitHub Actions workflows and from flex-config JSON if necessary.
- Delete the individual feature directories from the plugin and serverless packages manually.

## Using the `remove-features` script

Let's say, for example, I only want to deploy the template for the `caller-id` feature. The following command will remove all features _except_ `caller-id`:

```bash
npm run remove-features except caller-id
```

Multiple features can be specified in case you wish to deploy multiple select features. The following example will remove all features _except_ `admin-ui`, `attribute-viewer`, and `dual-channel-recording`:

```bash
npm run remove-features except admin-ui attribute-viewer dual-channel-recording
```

:::info Note
If you have already deployed to the environment before removing features, the configuration for removed features will remain in the environment. This will result in them appearing in the admin-ui panel unless the configuration is adjusted manually via API.
:::