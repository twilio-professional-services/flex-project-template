---
title: Developer setup
---

Once you have pulled down the template, you will want to set up your development environment to maximize productivity. The following steps assume you use [Visual Studio Code](https://code.visualstudio.com/), but you may adapt these steps to other similar editors.

## `eslint` and `prettier` setup

The template uses an `eslint` and `prettier` configuration based on [twilio-style](https://github.com/twilio-labs/twilio-style). This enforces certain code quality and formatting rules, and is part of the checks that are run when a pull request is opened. By installing the following extensions, you can enjoy automatic highlighting of `eslint` issues as well as automatic `prettier` formatting upon save:

- [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier ESLint extension](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint)

To enable automatic formatting upon save:

1. Open VSCode preferences (`cmd/ctrl` + `,`)
1. Search `Editor: Format On Save`
1. Check the box to enable `Editor: Format On Save`.

Now, when you open the `flex-project-template` directory in VSCode, you will have automatic issue highlighting and code formatting.

You may also see ESLint errors and warnings from the command line, rather than from your editor. See [ESLint](/building/template-utilities/eslint) for details.

## Serverless debugging

When running the plugin locally, this template has been set up to pair the plugin with the serverless functions also running locally on localhost:3001. The serverless functions can be debugged by attaching your debugger to the node instance. The following is a sample entry for `.vscode/launch.json` to connect vscode for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "address": "localhost",
      "localRoot": "${workspaceFolder}/serverless-functions",
      "name": "Attach To Serverless Remote",
      "port": 9229,
      "remoteRoot": "${workspaceFolder}/serverless-functions",
      "request": "attach",
      "skipFiles": ["<node_internals>/**"],
      "type": "node"
    }
  ]
}
```