---
sidebar_label: device-manager
title: device-manager
---

This feature is intended to demonstrate how to use web APIs to select audio devices and apply them for use within Flex, specifically with the Flex Voice Client. This plugin was built for **Flex 2.0**.

---

## Flex User Experience

The Device Manager currently provides options related to audio device selection. Utilizing Twilio Paste components, a list of audio device options is presented to the agent upon clicking the `Icon Button` in the `Main Header` of Flex.

![alt text](/img/features/device-manager/DeviceManagerMenu.gif)

After selecting an audio device, a `Toast notification` is shown to indicate the audio device has been set successfully.

---

## Setup and Dependencies

There are no additional dependencies for setup beyond ensuring the flag is enabled within the `flex-config` attributes.

To enable the `Device Manager` feature, under the `flex-config` attributes set the `device_manager` `enabled` flag to `true`. You may also separate the output and input device selection by setting `input_select` to `true`.

```json
"device_manager": {
    "enabled": true,
    "input_select": true
}
```
