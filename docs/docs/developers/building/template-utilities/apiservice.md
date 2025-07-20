---
title: ApiService
---

Location: `plugin-flex-ts-template-v2/src/utils/serverless/ApiService/index.ts`

This is the abstract class that implements serverless function calls; all utilities that act as interfaces to serverless functions should extend this. This class provides the following functionality:

1. Determines the base URL for serverless calls based on the current configuration
2. Implements retry logic using an exponential back-off algorithm, substantially increasing the robustness of making serverless function calls
3. Provides reusable functions for building and executing a request

If you need assistance extending this abstract class, several features included in the template do just that and are great examples! One example is available in the `admin-ui` feature, in the file `feature-library/admin-ui/utils/AdminUiService.ts`.