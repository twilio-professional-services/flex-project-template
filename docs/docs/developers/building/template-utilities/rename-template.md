---
sidebar_label: Rename template
title: Renaming the template
---

**NOTE** _renaming the template will make it a little more challenging to merge future template updates later_

You may want to rename the plugin and the serverless dependencies if you are creating a standalone plugin and it needs to run side by side with other plugins using the template.

There is a convenience script available to do this. After cloning the template, simply run the following command from the repository root dir.

```bash
npm install
npm run rename-template My-Feature-Name
```

It will:

- rename the plugin to `ps-template-my-feature-name`
  - update the plugin filenames and code references to `MyFeatureName`
  - _the prefix ps-template is used to easily identify plugins using the template format_
- rename the serverless-functions deployment name to `serverless-my-feature-name`
- reset the versions of these packages to `0.0.1`
- rename the variable used in flex-config to identify the serverless domain to `serverless_functions_domain_my_feature_name`
- rename references to the serverless domain within the plugin to match `serverless_functions_domain_my_feature_name`