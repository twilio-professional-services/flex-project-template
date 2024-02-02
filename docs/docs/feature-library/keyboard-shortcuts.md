---
sidebar_label: keyboard-shortcuts
title: keyboard-shortcuts
---

The _Keyboard Shortcuts Manager_ Twilio Flex plugin empowers contact center users to configure default and custom keyboards shortcuts in their day-to-day activities to increase efficiency and enjoyment when using Twilio Flex.

## Flex User Experience

The plugin is available to both agents and supervisors alike and it allows the following functionalities:

**View default Flex keyboard shortcuts:**

![Default keyboard shortcuts](/img/features/keyboard-shortcuts/default-keyboard-shortcuts.png)

This view allows users to see the default Flex keyboard shortcuts and their current mappings.

**View custom Flex keyboard shortcuts**

![Custom keyboard shortcuts](/img/features/keyboard-shortcuts/custom-keyboard-shortcuts.png)

This view allows users to see custom added keyboard shortcuts and their current mappings.

**A settings screen for easy management**

![Setting screen](/img/features/keyboard-shortcuts/settings.gif)

**Delete shortcuts**

![Delete shortcuts](/img/features/keyboard-shortcuts/delete-shortcuts.gif)

**Remap a shortcut**

![Remap shortcuts](/img/features/keyboard-shortcuts/remap-shortcut.gif)

**Adjust key throttling**

![Key Thorottling](/img/features/keyboard-shortcuts/key-throttling.gif)

**Disable keyboard shortcuts**

![Disable shortcuts](/img/features/keyboard-shortcuts/disable-shortcuts.gif)

**Reset keyboard shortcuts to default values**

![Reset shortcuts](/img/features/keyboard-shortcuts/reset-shortcuts.gif)

## Setup and dependencies

This plugin only supports Twilio Flex 2.1 and above because support for keyboard shortcuts has been introduced with Flex 2.1.

Other than that, there are no other specific dependencies or setup steps required.

## How does it work?

With the release of Flex 2.1, Flex now supports keyboards shortcuts for the most common actions performed by agents. The official documentation can be found [here](https://www.twilio.com/docs/flex/end-user-guide/keyboard-shortcuts).

The 2.1 Flex UI exposes various APIs to interact with the default keyboard shortcuts, as well as adding custom ones. The official documentation can be found [here](https://www.twilio.com/docs/flex/developer/ui/modify-keyboard-shortcuts).

### How are you persisting changes between refreshes?

User modification to both default and custom keyboard shortcuts are stored into browser local storage and read during plugin initialization.

### Default keyboard shortcuts

Twilio Flex comes with a list of default shortcuts which can be found [here](https://www.twilio.com/docs/flex/end-user-guide/keyboard-shortcuts).

| Action                          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Shortcut                                                      |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Toggle status menu              | Opens and closes the agent Activity menu                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `CTRL` + `SHIFT` + `S`                                        |
| Accept task                     | Accepts incoming tasks. Call tasks will always be accepted first. If there are multiple tasks, they will be accepted one at a time in the order they came in (with the oldest first). _If there are no incoming tasks, this shortcut will do nothing._                                                                                                                                                                                                                                                                                                                                    | `CTRL` + `SHIFT` + `A`                                        |
| Reject task                     | Rejects incoming tasks. Call tasks will always be rejected first. If there are multiple tasks they will be rejected one at a time in the order they came to the user (oldest first)._If there are no incoming tasks, this shortcut will do nothing._                                                                                                                                                                                                                                                                                                                                      | `CTRL` + `SHIFT` + `R`                                        |
| Navigate down/up the task list  | Navigates up and down from the currently selected task in the task list. If no task is selected, the top task is selected. Repeated presses will go down and up the list to the next task, looping round to the other end when you reach the top or bottom of the list.                                                                                                                                                                                                                                                                                                                   | `CTRL` + `SHIFT` + `T` (up) and `CTRL` + `SHIFT` + `Y` (down) |
| Toggle mute on active call      | Places yourself on and off mute.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `CTRL` + `SHIFT` + `M`                                        |
| Toggle hold on active call      | Places the other participant of a call on and off hold. _If there are more than two participants in the call, this shortcut will do nothing and a notification will appear._                                                                                                                                                                                                                                                                                                                                                                                                              | `CTRL` + `SHIFT` + `H`                                        |
| Logout                          | Will log out the user out of Flex UI._If the user has an active call or pending tasks, this shortcut will do nothing._                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `CTRL` + `SHIFT` + `0`                                        |
| End the currently selected task | This shortcut has two behaviors based on the channel type and status of the selected task. The first keypress of this shortcut will close the channel and move the task to "wrap up". Ongoing calls will hang up and chats will be ended. If the call has multiple participants, the conference will end for everyone. The second keypress (or if the task is already in "wrap up" mode) will complete the task._There is a 1-second timeout to prevent accidental repeat keypresses. If the shortcut is used a second time too quickly, it will do nothing. A notification will appear._ | `CTRL` + `SHIFT` + `1`                                        |
| Return to active call           | Will navigate back to the call view if the agent is not on this view.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `CTRL` + `SHIFT` + `C`                                        |

### Custom keyboard shortcuts

With the help of new Flex APIs, it is possible to add custom shortcuts like described [here](https://www.twilio.com/docs/flex/developer/ui/modify-keyboard-shortcuts#add-custom-shortcuts). The following list of custom shortcuts are all custom values preconfigured as a part of this [plugin](https://github.com/twilio-professional-services/flex-project-template/blob/main/plugin-flex-ts-template-v2/src/feature-library/keyboard-shortcuts/utils/CustomKeyboardShortcuts.ts).

| Action                            | Description                                                                                                                                                                                                                | Shortcut               |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| Toggle dialpad                    | Open and close the dialpad                                                                                                                                                                                                 | `CTRL` + `SHIFT` + `D` |
| Toggle sidebar                    | Open and close the sidebar                                                                                                                                                                                                 | `CTRL` + `SHIFT` + `Q` |
| Navigate to tasks                 | Navigate to the Tasks view                                                                                                                                                                                                 | `CTRL` + `SHIFT` + `K` |
| Debugging assistance              | A debugging assistenance shortcut that looks various Agent information into the browser console for easy assistance. Currently logged information includes: account SID, worker SID, workspace SID, and worker attributes. | `CTRL` + `SHIFT` + `9` |
| Navigate to keyboard shortcuts    | Navigate to the Keyboard Shortcuts manager                                                                                                                                                                                 | `CTRL` + `SHIFT` + `L` |
| Navigate to Teams View            | Open the Teams View                                                                                                                                                                                                        | `CTRL` + `SHIFT` + `I` |
| Navigate to Real-time Queues View | Open Real-time Queues View                                                                                                                                                                                                 | `CTRL` + `SHIFT` + `O` |
