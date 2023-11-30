---
sidebar_label: emoji-picker
title: emoji-picker
---

This feature adds an [EmojiMart emoji picker](https://missiveapp.com/open/emoji-mart/) to Flex messaging.

## flex-user-experience

![Emoji picker demo](/img/features/emoji-picker/emoji-picker.gif)

## setup and dependencies

There are no additional dependencies for setup beyond ensuring the feature is enabled within the `flex-config` attributes.

To enable the emoji picker feature, under your `flex-config` attributes set the `emoji_picker` `enabled` flag to `true`:

```json
"emoji_picker": {
    "enabled": true
}
```

## how does it work?

This feature embeds the [EmojiMart emoji picker](https://missiveapp.com/open/emoji-mart/). Emoji data is fetched dynamically when the picker loads, to prevent bloating the plugin size. When an emoji is selected, the Flex UI `SetInputText` action is invoked to append the emoji to the message input field.
