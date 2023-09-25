Use a JS client event listener hook to add your own handler for events from the various client SDKs within Flex.

```ts
import * as Flex from "@twilio/flex-ui";
import { Conversation } from "@twilio/conversations";

import {
  FlexJsClient,
  ConversationEvent,
} from "../../../../../types/feature-loader";

export const clientName = FlexJsClient.conversationsClient;
export const eventName = ConversationEvent.conversationJoined;
export const jsClientHook = function exampleConversationJoinedHandler(
  flex: typeof Flex,
  manager: Flex.Manager,
  conversation: Conversation
) {
  // your code here
};
```

Supported values for `clientName`:

```ts
enum FlexJsClient {
  conversationsClient = "conversationsClient",
  voiceClient = "voiceClient",
  workerClient = "workerClient",
}
```

Supported values for `eventName`:

```ts
enum ConversationEvent {
  conversationJoined = "conversationJoined",
}
enum VoiceEvent {
  incoming = "incoming",
}
enum WorkerEvent {
  reservationCreated = "reservationCreated",
}
```

Supported values for `eventName` depends on the value of `clientName`:

- FlexJsClient.conversationsClient:
  - ConversationEvent.conversationJoined
- FlexJsClient.voiceClient:
  - VoiceEvent.incoming
- FlexJsClient.workerClient:
  - WorkerEvent.reservationCreated

Support for additional events may be added to `src/utils/feature-loader/jsclient-event-listeners.ts`. PRs are welcome!