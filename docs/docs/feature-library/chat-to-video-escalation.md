---
sidebar_label: chat-to-video
title: chat-to-video-escalation
---

This feature shows how an agent can initiate a video room from a messaging conversation within Flex.

:::caution Deprecated
This feature uses Twilio Programmable Video, which has an announced End of Life date of December 5, 2024. Therefore, this feature should not be used as the basis for any new deployment. [More information is available here.](https://www.twilio.com/en-us/changelog/programmable-video-eol-notice)
:::

---

1. [Functionality Overview](#functionality-overview)
   1. [Feature Structure](#feature-structure)
   1. [Technical Components](#technical-components)
   1. [Example Walkthrough](#example-walkthrough)
   1. [Escalating Chat to Video](#escalating-chat-to-video)
2. [Local Development](#local-development)
3. [Changelog](#changelog)
4. [Reference](#reference)
5. [Disclaimer](#disclaimer)

---

## Functionality Overview

### Feature Structure

This feature is broken down into three main sections:

- **Flex Plugin** - starting at the root of the directory:
  - The `./custom-components` folder contains the components to initiate and join the video room
- **Twilio Serverless** - within the `/serverless-functions/src/functions/features/chat-to-video-escalation` directory:
  - This houses the Twilio Function paths which orchestrate the facilitation of access token generation, video room creation, and video room completion
  - The assets are utilized to host the build output of the [video web application](https://github.com/twilio-professional-services/flex-project-template/tree/main/web-app-examples/twilio-video-demo-app) that joins the agent and customer into the video session; for further details on how this application works & setup, see the [application folder](https://github.com/twilio-professional-services/flex-project-template/tree/main/web-app-examples/twilio-video-demo-app) within the `/web-app-examples` folder at the root of this template
- **Video App** - within the `/web-app-examples/twilio-video-demo-app` directory:
  - A Next JS application built with React, TypeScript, and Twilio Paste design system
  - This application is used by the agent (embedded into Flex) and the customer (via invite link) to connect to the video session

### Technical Components

- **Twilio Serverless Functions** - used to orchestrate the API requests to generate access tokens
- **Twilio Serverless Assets** - used to host the customer-side video room UI
- **Twilio Video JS** - used for connecting and monitoring the video rooms on the client side

### Example Walkthrough

1. The video session can only be initiated by the Agent within Flex. Once determined a video session would be appropriate to resolve the customer's use case, the Agent clicks the `Video Icon` button in the `Task Canvas Header`:

   ![Agent switch to video button](/img/features/chat-to-video/video-button.png)

2. After clicking the button, a request is sent to the Twilio function to generate a unique code, which serves as the video room name. Upon success, the unique code and full url to join the video session are returned to the Flex UI, which then auto-sends a message to the conversation with the customer:

   ![Join video message](/img/features/chat-to-video/join-video-message.png)

3. Within the Flex UI, a new tab is visible to the Agent within the `Task Canvas Tabs`, labeled `Video Room`:

   ![Agent join video room button](/img/features/chat-to-video/join-room-button.png)

4. After clicking `Join Video Room`, the agent is connected to the video room and can interact with the customer:

   ![Agent in video room](/img/features/chat-to-video/agent-video-room.png)

5. On the customer's end, they would click the link included in the message, which would open a new browser tab to join the video room:

   ![Customer join video room button](/img/features/chat-to-video/customer-video-join.png)

6. After clicking `Join Video Room`, the customer will connect to the room and interact with the Agent. The buttons below the video allow the customer to toggle their microphone and camera to on/off, share their screen, and disconnect from the video session:

   ![Customer in video room](/img/features/chat-to-video/customer-video-room.png)

7. Once the video session is complete and the customer disconnects from the room, there is a _Post Video UI_ where you could optionally collect a CSAT or feedback:

   ![Disconnect message](/img/features/chat-to-video/post-video-room.png)

**Note:** An agent will only be able to participate in one video session at a time. Additionally, the agent will be automatically disconnected from the video session when wrapping up the task.

## Local Development

To test this feature locally:

1. Create an [API Key and Secret](https://support.twilio.com/hc/en-us/articles/9318455807771-API-Keys-and-How-to-Change-Them)

2. Ensure the API key and secret are populated in the `.env` file within `<root-folder>/serverless-functions` along with the other following variables

   ```
   TWILIO_FLEX_SYNC_SID=ISxxxxxxxxxxxxxxxxxx

   TWILIO_API_KEY=<YOUR_API_KEY>
   TWILIO_API_SECRET=<YOUR_API_SECRET>
   VIDEO_CODE_LENGTH=7
   VIDEO_CODE_TTL=60
   VIDEO_ROOM_ALLOW_CREATE=false
   VIDEO_ROOM_TYPE=group
   VIDEO_RECORD_BY_DEFAULT=false
   ```

## Reference

This diagram explains the flow of events within the Video JS SDK:

![Video JS SDK flow of events](/img/features/chat-to-video/VideoRoom-JS-SDK-Flow-Events.png)

## Disclaimer

This software is to be considered "sample code", a Type B Deliverable, and is delivered "as-is" to the user. Twilio bears no responsibility to support the use or implementation of this software.
