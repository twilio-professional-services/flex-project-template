---
sidebar_label: ring-notification
title: ring-notification
---
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

## Overview

Ring notification feature allows application to play ringtone sound on incoming voice and chat task on Agent's flex

---

## Business Details

### context
Currenly Flex does not play ring notification to agent on incoming task out of the box. Because of which sometimes agent miss the task if they are focusing on some other screen than Flex agent desktop.

### objective
This `ring-notification` feature will allow application to play a ringtone on agent's side on incoming tasks (voice and chat) until the task is `accepted`, `canceled`, `rejected`, `timeout` 

### configuration options

Within your `ui_attributes` file, there are several settings for the `ring-notification` feature:

- `enable` - set this to true to enable the feature

Ringtone mp3 file with name `phone_ringtone.mp3` is stored as serverless asset at `serverless-functions/assets/features/ring-notification`

Once your updated flex-config is deployed, the feature is enabled and ready to use.

## Technical Details

This feature adds a ring notification on `created` event of reservation and it stops playing on reservation `accepted`, `canceled`, `rejected`, `timeout` events.
