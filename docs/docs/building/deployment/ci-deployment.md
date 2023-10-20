---
title: CI deployment
---

The template includes several GitHub Actions workflows, which provides a full deployment pipeline out-of-the-box. While these workflows as written are specific to GitHub, they could be adapted to other solutions.

## Deploy Flex

Location: `.github/workflows/flex_deploy.yaml`

This workflow encapsulates the logic for deploying the entire template. It can be invoked manually via GitHub, or by calling from another workflow. It performs the following:
1. Injects GitHub environment secrets and variables into the runner's environment, making them available to the setup script
1. Sets the `ENVIRONMENT` variable based on the selected environment
1. Deploys all serverless services
   - As part of this process, the setup script executes in order to generate the environment file used by the deployment. See [serverless configuration](/building/template-utilities/configuration#serverless-configuration) for details on how this works.
   - Within the serverless package(s), the `npm run deploy-env` command is executed to perform the deployment.
1. Deploys Terraform
   - If the option to deploy Terraform was selected, the [Terraform deploy](#terraform-deploy) workflow is executed to deploy resources using Terraform.
   - If this is the first time the template has been deployed, there is a chicken-egg problem with the serverless and Terraform deployments (Terraform wants the serverless service to exist, but the serverless service wants the dependencies deployed by Terraform to exist). To solve this, when the initial release option is selected, the serverless services are deployed twice: Once before Terraform (in a state where some dependencies are missing), then again after Terraform (once the dependencies have been deployed).
1. Deploys and releases the Flex plugin using the Twilio CLI

### Options

#### environment (Environment to use for deployment)

Selects the configured GitHub environment to deploy. The environment defines the account to deploy to, along with credentials and (optionally) some settings.

#### deploy_terraform (Deploy Terraform?)

Whether or not the Terraform configuration within the template should be deployed. The template includes supporting objects for features, such as TaskRouter workflows and Studio flows, that can be automatically deployed and managed via Terraform. However, any existing resources with the same name will be overwritten when the deployment occurs.

#### initial_release (Is this the first release to the environment?)

If the template has never been deployed to the target account, and "Deploy Terraform" is selected, you must also select this option. If this is the first time the template has been deployed, there is a chicken-egg problem with the serverless and Terraform deployments (Terraform wants the serverless service to exist, but the serverless service wants the dependencies deployed by Terraform to exist). To solve this, when the initial release option is selected, the serverless services are deployed twice: Once before Terraform (in a state where some dependencies are missing), then again after Terraform (once the dependencies have been deployed).

#### overwrite_config (Overwrite config set by Admin UI Panel?)

Determines whether the source of truth for configuration is the repository or the configuration made via the template's included admin UI. If the repository is the source of truth, select this option, so that any updates made via the repository are deployed. If the admin UI is the source of truth, deselect this option so that only net-new configuration options are added, and existing settings are not overwritten.

## Merge deploy example

Location: `.github/examples/merge_deploy.yaml`

This workflow is an example of how you can call the [Deploy Flex](#deploy-flex) workflow in response to events. This example will deploy whenever a commit is pushed to the `main` or `develop` branches, using the 'production' environment when pushing to the main branch, or 'dev' environment when pushing to the develop branch.

To use this workflow, move it to the `.github/workflows` directory and make the necessary adjustments for your use case.

## Terraform

### Terraform deploy

Location: `.github/workflows/terraform_deploy.yaml`

This workflow encapsulates the logic for deploying Terraform. It pulls the Terraform state from a serverless asset, imports it to the runner's Terraform instance, runs `terraform apply`, then updates the state serverless asset with the new state after apply.

### Terraform delete state

Location: `.github/workflows/terraform_delete.yaml`

This workflow removes the serverless asset containing the Terraform state.

## Docs deploy

Location: `.github/workflows/deploy_docs_gh_pages.yaml`

This workflow builds and deploys the Docusaurus site to GitHub Pages if the repository variable `DEPLOY_DOCS` is set to `true`.

## Checks

Location: `.github/workflows/checks.yaml`

This workflow executes whenever a pull request is opened. It performs two primary functions:
1. Runs [ESLint](/building/template-utilities/eslint) and posts a comment with results indicating any warnings or errors
1. Executes `npm run test:ci` to run unit tests, and publishes the results

:::tip Fork note
This workflow will fail when a pull request is opened from a fork. This is due to forks not having access to the GitHub token, preventing the lint results comment from posting. However, the checks will still run, and you can see their results in the action logs.
:::