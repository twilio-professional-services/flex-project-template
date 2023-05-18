---
sidebar_label: Changelog
sidebar_position: 5
title: Changelog
---

- 1.0.6
  - Removed plugin-flex-ts-template-v1 and all v1 references.
- 1.0.5
  - Removed plugin versioning from repo, instead relying on automatic versioning by the Flex Plugins CLI.
- 1.0.4
  - Added `add-feature` script for creating new features
  - Modified v2 plugin to load features dynamically
  - Modified v2 plugin to use Twilio linter rules
  - Updated GitHub Actions to auto bump plugin package version
  - Updated GitHub Actions to run linter on pull requests
- 1.0.3
  - _BREAKING CHANGE_ renamed plugin packages to plugin-flex-ts-template-v1 and plugin-flex-ts-template-v2 to explicitly separate plugins
  - updated README to account for v1 plugins in scripts
- 1.0.2

  - README updates
  - improved reliability of github actions scripts
  - update rename-template and remove-features to account for github actions scripts
  - defaulting plugin folder name for github action scripts to be the plugin-flex-ts-template-v2 plugin

- 1.0.1
  - Updated readmes with instructions for various use cases
  - Updated remove-features scripts to account for schedule manager
  - Modified plugin API structure to leverage use of appConfig for easier local configuration
  - Updated github actions release scripts to attempt to infer environment variables if placeholders still in place
  - Updated github actions release scripts to break into multiple jobs decreasing the time taken to perform a release
