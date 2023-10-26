Use a chat orchestrator hook to modify chat orchestration via `ChatOrchestrator.setOrchestrations`.

```ts
import * as Flex from "@twilio/flex-ui";

import { FlexOrchestrationEvent } from "../../../../types/feature-loader";

export const chatOrchestratorHook = (
  flex: typeof Flex,
  manager: Flex.Manager
) => ({
  event: FlexOrchestrationEvent.completed,
  handler: handleChatComplete,
});

const handleChatComplete = (task: Flex.ITask): any => {
  return [
    Flex.ChatOrchestratorEvent.DeactivateConversation,
    Flex.ChatOrchestratorEvent.LeaveConversation,
  ];
};
```

Supported values for `event`:

```ts
enum FlexOrchestrationEvent {
  accepted = "accepted",
  wrapup = "wrapup",
  completed = "completed",
}
```