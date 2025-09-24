---
sidebar_label: recording-status-callback
title: Recording Status Callback
---

## Feature Summary

This feature allows you to specify a `recordingStatusCallback` URL for call recordings initiated within Flex. This applies to both native conference recordings and recordings started by the **dual-channel-recording** feature.

When a recording's status changes (e.g., from `in-progress` to `completed`), Twilio will send a request with details about the recording to your configured callback URL. This enables a wide range of post-call processing workflows, such as sending recordings for transcription, performing sentiment analysis, or archiving them in a long-term storage solution.

## Setup and Dependencies

To enable this feature, configure the following settings in your `flex-config` ui_attributes file:

-   **`enabled`**: Set to `true` to enable the feature.
-   **`callback_url`**: The URL that Twilio will send recording status updates to. This defaults to the serverless function included with the feature but can be pointed to any endpoint. You can use template strings here (e.g., `{{task.TaskSid}}`) to include task attributes in the URL.
-   **`notify_absent`**: Set to `true` to be notified if a recording is absent.
-   **`notify_completed`**: Set to `true` to be notified when a recording is complete.
-   **`notify_inprogress`**: Set to `true` to be notified when a recording is in progress.

Here is an example configuration:

```json
"recording_status_callback": {
  "enabled": true,
  "callback_url": "{{url}}/recording-status-handler",
  "notify_absent": false,
  "notify_completed": true,
  "notify_inprogress": false
}
```

## How it Works

The feature hooks into the AcceptTask action. Before a call task is accepted, it checks if the feature is enabled and injects the conferenceRecordingStatusCallback and conferenceRecordingStatusCallbackMethod options into the conference instructions. This tells Twilio where to send status updates for the conference recording.