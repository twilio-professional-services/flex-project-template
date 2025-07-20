---
title: ESLint
---

ESLint is configured for the plugin, the serverless-functions package, and the serverless-schedule-manager package, using [Twilio Style](https://github.com/twilio-labs/twilio-style) as a base with some relaxations. When opening a pull request, the included GitHub workflows will run the linter, preventing merge if errors are present. Therefore, it is convenient to run the linter locally to identify any errors that you may need to fix ahead of time.

Before pushing changes, run the following command from the repository root dir to see the linter results across all packages.

```bash
npm run lint
```

Many linter issues can be fixed automatically. To do that, run this command:

```bash
npm run lint:fix
```

It can be useful to set up your text editor to integrate with ESLint so that you can see errors as you type. See [Developer Setup](/building/developer-setup) for details.