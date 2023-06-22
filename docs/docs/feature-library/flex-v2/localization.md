---
sidebar_label: localization
sidebar_position: 18
title: localization
---

## Feature summary

This feature provides a language selection dropdown in the Flex UI header, as well as several translations for built-in Flex UI strings. You may also extend this feature to support additional languages as needed.

## Flex User Experience

![Localization demo](/img/f2/localization/localization.gif)

## Setup and dependencies

To enable the localization feature, under your `flex-config` attributes set the `localization` `enabled` flag to `true`:

```json
"localization": {
    "enabled": true,
    "show_menu": true
}
```

If you would like to disable the ability for users to set their own language, set `show_menu` to `false`. Even if the menu is disabled, the language may be set by administrators via one of the following methods:

- Per-worker via SSO or API, by setting the `language` worker attribute
- Globally via the `language` top-level `flex-config` attribute

## How does it work?

This feature replaces the Flex UI strings by appending new strings of the same name to the `manager.strings` object. The language used is determined via a combination of factors:

1. If the global `language` attribute in `flex-config` is set to `default` (which it is by default), and there is no language set on the worker, then the browser language is used if possible.
2. If the global `language` attribute in `flex-config` is set to a specific language, and there is no language set on the worker, that language is used if supported.
3. If a language is set on the worker, it is used regardless of the global or browser settings.
4. As a default fallback, `en-US` is used.

Languages are defined in the `languages` directory of the feature. Each language is contained within a JSON file that lists all of the translated system strings for that language. The `index.ts` file contains an array of languages, mapping the JSON translations to a display name and key value. To add a new language, add its corresponding JSON file, then add it to the array in `index.ts`.
