---
sidebar_label: pause-recording
title: Pause & Resume Call Recording
---

This feature adds a Pause/Resume Recording button and keyboard shortcuts to the call canvas to allow the agent to temporarily pause the call recording before the customer provides sensitive information (such as credit card details, bank account, etc.) to the agent and to resume regular call recording afterwards.

## flex-user-experience

![Pause recording demo](/img/features/pause-recording/pause-recording.gif)

## setup and dependencies

Recording must be enabled either via the dual channel recording feature in this repository, or via the "Call Recording" setting in Twilio Console > Flex > Manage > Voice.

There are no additional setup steps required, only enabling the feature in the flex-config asset for your environment.

There are some additional configuration properties you may change if desired:

- `include_silence` - whether the paused portion of the call recording should be included as silence
- `indicator_banner` - whether recording indicator is displayed temporarily in a notification banner
- `indicator_permanent` - whether a permanent 'Call Recording Paused' indicator is shown while paused

## keyboard shortcuts

Default keyboard shortcuts have been created but may be remapped using the keyboard shortcut feature. By default, the following keys are mapped:

| Key | Full Command     | Action                                     |
| --- | ---------------- | ------------------------------------------ |
| 2   | Ctrl + Shift + 2 | Toggle call recording state (pause/resume) |
| 3   | Ctrl + Shift + 3 | Pause call recording (if started)          |
| 4   | Ctrl + Shift + 4 | Resume call recording (if paused)          |

## how it works

This plugin leverages Twilio Functions to perform the actual Pause and Resume action on the call or conference resource. When using the dual channel recording feature, the recording is on the call resource; when using the out-of-box recording feature, the recording is on the conference resource.

Additionally this plugin registers additional Flex Actions that may be invoked by other plugins or features:

| Action                | Payload           |
| --------------------- | ----------------- |
| `ToggleCallRecording` | `{ task: ITask }` |
| `PauseCallRecording`  | `{ task: ITask }` |
| `ResumeCallRecording` | `{ task: ITask }` |
