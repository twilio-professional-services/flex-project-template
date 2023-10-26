Use an actions hook to register actions in the [Flex Actions Framework](https://www.twilio.com/docs/flex/developer/ui/use-ui-actions).

```ts
import * as Flex from "@twilio/flex-ui";

import { FlexActionEvent, FlexAction } from "../../../../types/feature-loader";

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.CompleteTask;
export const actionHook = function exampleCompleteTaskHook(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  flex.Actions.addListener(
    `${actionEvent}${actionName}`,
    async (payload, abortFunction) => {
      // your code here
    }
  );
};
```

Supported values for `actionEvent`:

```ts
enum FlexActionEvent {
  before = "before",
  after = "after",
  replace = "replace",
}
```

Supported values for `actionName`:

```ts
enum FlexAction {
  AcceptTask = "AcceptTask",
  ApplyTeamsViewFilters = "ApplyTeamsViewFilters",
  CompleteTask = "CompleteTask",
  HangupCall = "HangupCall",
  HoldCall = "HoldCall",
  UnholdCall = "UnholdCall",
  HoldParticipant = "HoldParticipant",
  KickParticipant = "KickParticipant",
  MonitorCall = "MonitorCall",
  StopMonitoringCall = "StopMonitoringCall",
  SelectTask = "SelectTask",
  SetWorkerActivity = "SetWorkerActivity",
  StartOutboundCall = "StartOutboundCall",
  ToggleMute = "ToggleMute",
  UnholdParticipant = "UnholdParticipant",
  NavigateToView = "NavigateToView",
  RejectTask = "RejectTask",
  SetActivity = "SetActivity",
  StartExternalWarmTransfer = "StartExternalWarmTransfer",
  ShowDirectory = "ShowDirectory",
  TransferTask = "TransferTask",
  WrapupTask = "WrapupTask",
}
```