---
sidebar_label: inline-media
title: inline-media
---

## Feature summary

This feature embeds image, video, audio, and PDF attachments directly within message bubbles, eliminating the requirement to click a link to open them in a new tab.

## Flex User Experience

![inline-media screenshot](/img/features/inline-media/inline-media.png)

## Setup and dependencies

There are no additional dependencies for setup beyond ensuring the flag is enabled within the `flex-config` attributes.

To enable the feature, under the `flex-config` attributes set the `inline_media` `enabled` flag to `true`.

```json
"inline_media": {
  "enabled": true
}
```

## How does it work?

This feature works by conditionally rendering a component based on the conversation message containing any media. If media is present, a component will be rendered according to the media type. The following media types are recognized:

- Audio:
  - audio/mpeg
  - audio/ogg
  - audio/amr
- Image:
  - image/jpeg
  - image/png
- PDF:
  - application/pdf
- Video:
  - video/mp4
