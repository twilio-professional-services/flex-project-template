# Flex Project Template Documentation Site

This website is built using [Docusaurus 2](https://docusaurus.io/), in hopes of building better organized documentation around what the Flex Project Template is, how to get started with it, and how to build on top of it.

For adding on to the documentation site, please see the [Adding Content](#adding-content--documentation) section.

---

## Adding Content & Documentation

The documentation that encompasses this site is found within the [docs folder](/docs/docs/). Within this folder there are five distinct sections:

- `intro.mdx` - the landing page (`/`) or home page of the documentation site
- `how-it-works/` - a folder containing nested `markdown` files outlining the organization structure of the template
- `feature-library/` - a folder containing nested `markdown` files outlining the features in the template
- `setup-guides/` - a folder containing nested `markdown` files outlining various instructions
- `changelog.md` - the changelog

### Example: adding a new feature to the site

1. Navigate to the `docs/feature-library/` folder.
2. Create a new file with the following naming structure: `name-of-feature.md` (there is an example template located at [`_example-feature-page.md`](_example-feature-page.md)).
3. Populate the information for the various sections.
4. If screenshots or images are embedded, you can add them to the `static/img/features/*` folder (create a new folder for your new feature), then reference them in the `.md` file as such:
   ```
   ![alt text](/img/features/name-of-feature/name-of-screenshot.png)
   ```
5. You can run the documentation site locally to see how your new documentation will display within the site by following the [Local Development](#local-development) section.

---

## Local Development

### Installation

```
$ npm i
```

### Running the site locally

```
$ npm start
```

This command starts a local development server at `http://localhost:3010` and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build & Release

Build & deployment of the site is automatically handled via Github Actions when a pull request is merged into the `main` branch of the template. The live documentation site can be found [here](https://twilio-professional-services.github.io/flex-project-template/).
