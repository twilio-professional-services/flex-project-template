---
sidebar_label: sip-support
title: sip-support
---

When on a SIP call the default Flex Mute and Hangup buttons will not operate correctly the Flex Worker. This feature replaces the Mute button and Hangup action for non-WebRTC calls (i.e. Calls via SIP or PSTN). 

The default mute _button_ requires the Voice SDK to be used as it calls the local method to mute, this plugin introduces a replacement UI button with a companion serverless function to mute the Flex worker by modifying the conference participants

Similarly, the default Hang Up _action_ completes the task but does not tear down the established call. This plugin removes the worker from the conference, and assuming that the EndCallOnExit parameter has been passed, the conference will end. If this parameter has not be passed and a call made to the Conference Participants API, then the worker will be removed from the conference and the SIP leg torn down.

This feature is based on [Flex 1.0 station selector](https://github.com/jlafer/plugin-station-selector/tree/master/src).

# flex-user-experience

![SIP Support demo](/img/features/sip-support/demo.gif)

# setup and dependencies

## flex-config

Within your `ui_attributes` file, the `sip-support` feature has a single setting you may modify:

- `true` - whether any functionality from this feature is enabled
- `false` - default flex behaviour


# how does it work?
This plugin calls the Conference Participants API via a serverless function (in this project). Passing through the `muted` state to mute the call, or removing the participant to end the worker leg of the conference.