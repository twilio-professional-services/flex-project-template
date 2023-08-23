---
sidebar_label: ring-notification
title: Ring-Notification
---

Ring notification feature allows application to play ringtone sound on incoming voice and chat task on Agent's flex


# flex-user-experience

Agents will be notified with ringtone on incoming task

# setup and dependencies

Within your `ui_attributes` file, there are several settings for the `ring-notification` feature:

- `enable` - set this to true to enable the feature

Ringtone mp3 file with name `phone_ringtone.mp3` is stored as serverless asset at `serverless-functions/assets/features/ring-notification`

Once your updated flex-config is deployed, the feature is enabled and ready to use.

# how does it work?

This feature adds a ring notification on `created` event of reservation and it stops playing on reservation `accepted`, `canceled`, `rejected`, `timeout` events.
