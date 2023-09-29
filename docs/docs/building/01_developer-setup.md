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

When running the plugin locally, this template has been set up to pair the plugin with the serverless functions also running locally on localhost:3001. The serverless functions can be debugged by attaching your debugger to the node instance.

### Debugging with VSCode

Follow these steps to set up VSCode for serverless debugging:

1. In the root directory of the repository, create a `.vscode/launch.json` file with the following contents:
    ```json title=".vscode/launch.json"
    {
      "version": "0.2.0",
      "configurations": [
        {
          "address": "localhost",
          "localRoot": "${workspaceFolder}/serverless-functions",
          "name": "Attach to Serverless Remote",
          "port": 9229,
          "remoteRoot": "${workspaceFolder}/serverless-functions",
          "request": "attach",
          "skipFiles": ["<node_internals>/**"],
          "type": "node"
        }
      ]
    }
    ```
1. At the bottom of the VSCode interface, ensure "Auto Attach" is set to "With Flag"
1. Set your breakpoint(s)
1. Start the template using `npm start`
1. Once the template is running, open the "Run and Debug" sidebar in VSCode and click the "play" button for "Attach to Serverless Remote"
1. That's all, you may now trigger your breakpoints!