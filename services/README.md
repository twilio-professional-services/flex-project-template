# services

Packages within this folder will be automatically deployed using the included workflows, and automatically installed when developing locally.

## Package requirements

Packages (which are sub-directories of this directory) must adhere to a few basic requirements:

- Must include an npm-compatible `package.json` within its root directory
- For automatic environment variable population, an `.env.example` file must be included within its root directory, with placeholder values in the `<YOUR_ENVVARNAME>` format
- A `deploy` script defined within `package.json` for deployment
- A `postinstall` script may optionally be defined within `package.json` for steps that should occur after installation but prior to deploy