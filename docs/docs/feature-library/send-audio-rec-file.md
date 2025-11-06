---
sidebar_label: send-audio-rec-file
title: send-audio-rec-file
---

This is a feature that enables agents on Flex to record, listen and send audio messages on chat task. With this feature, agents can record and send audio messages to customers.

## flex-user-experience
The audio message feature provides a seamless user experience for agents on Flex. Agents can easily access the record panel feature by clicking on a button that enables them to record and listen the audio message. The feature is designed to work across chat channels, including WhatsApp and Web Chat, and admin can choose to enable or disable audio message sending feature based on their preferences.


To use the audio message feature, follow these steps:
1. Click on the audio recorder panel expand button in the Flex UI.
2. Click on the record button to start recording your message.
3. When you’re done recording, click on the stop button.
4. Preview your recorded message by clicking play and click on the send button to send the message to the customer, or click on the cancel button to discard the message.
5. When you receive an audio message from a customer, click on the play button to listen to the message.
* The audio message feature is designed to convert audio messages to an MP3 file format to reduce the file size and minimize bandwidth and storage issues. The feature also has a reasonable size limit of 16MB for audio messages to ensure that the messages can be transmitted and stored without any issues.

## setup and dependencies
To use the audio message feature, you need to have access to the Twilio Flex platform. You also need to ensure that your Flex account is set up correctly, and you have the necessary permissions as agent or supervisor.

The audio message feature has the following dependencies:

* A browser that supports audio recording and playback, such as Chrome, Firefox, or Safari.
* An internet connection with adequate bandwidth to transmit audio messages.


## how does it work?
The provided feature code includes a React component that enables users to record audio. 
Once the recording is completed, the audio is converted to an MP3 file and attached to a conversation using the invoke action 'AttachFiles'.
The audio file is then distributed to participants through the respective conversation channels, such as WhatsApp or web chat. 
The client application for each channel recognizes the uploaded binary file as an audio file, allowing users to play it within their interface.
