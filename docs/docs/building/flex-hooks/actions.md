Use an actions hook to register actions in the [Flex Actions Framework](https://www.twilio.com/docs/flex/developer/ui/use-ui-actions).

```ts
import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.CompleteTask;
export const actionHook = function exampleCompleteTaskHook(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    // your code here
  });
};
```

Supported values for `actionEvent`:

```ts
enum FlexActionEvent {
  before = 'before',
  after = 'after',
  replace = 'replace',
}
```

Supported values for `actionName`:

```ts
enum FlexAction {
  AcceptTask = 'AcceptTask',
  ApplyTeamsViewFilters = 'ApplyTeamsViewFilters',
  ApplyTeamsViewSearch = 'ApplyTeamsViewSearch',
  AttachFiles = 'AttachFiles',
  CancelTransfer = 'CancelTransfer',
  CompleteTask = 'CompleteTask',
  DequeueTask = 'DequeueTask',
  DetachFile = 'DetachFile',
  DownloadMedia = 'DownloadMedia',
  EndConferenceForAll = 'EndConferenceForAll',
  EndVoiceTask = 'EndVoiceTask',
  GetPausedChannels = 'GetPausedChannels',
  GetPausedEmailConversations = 'GetPausedEmailConversations',
  HangupCall = 'HangupCall',
  HideDirectory = 'HideDirectory',
  HistoryGo = 'HistoryGo',
  HistoryGoBack = 'HistoryGoBack',
  HistoryGoForward = 'HistoryGoForward',
  HistoryPush = 'HistoryPush',
  HistoryReplace = 'HistoryReplace',
  HoldCall = 'HoldCall',
  HoldParticipant = 'HoldParticipant',
  InsightsPlayerHide = 'InsightsPlayerHide',
  InsightsPlayerInitialized = 'InsightsPlayerInitialized',
  InsightsPlayerPlay = 'InsightsPlayerPlay',
  InsightsPlayerShow = 'InsightsPlayerShow',
  IssueCallToWorker = 'IssueCallToWorker',
  KickParticipant = 'KickParticipant',
  LeaveChannel = 'LeaveChannel',
  Logout = 'Logout',
  MonitorCall = 'MonitorCall',
  NavigateToView = 'NavigateToView',
  PauseChannel = 'PauseChannel',
  RedirectCallTask = 'RedirectCallTask',
  ReloadWindow = 'ReloadWindow',
  RejectTask = 'RejectTask',
  ResumeChannel = 'ResumeChannel',
  SelectPausedConversation = 'SelectPausedConversation',
  SelectTask = 'SelectTask',
  SelectTaskInSupervisor = 'SelectTaskInSupervisor',
  SelectWorkerInSupervisor = 'SelectWorkerInSupervisor',
  SendDTMFDigits = 'SendDTMFDigits',
  SendMessage = 'SendMessage',
  SendRichContentMessage = 'SendRichContentMessage',
  SendTyping = 'SendTyping',
  SetActivity = 'SetActivity',
  SetComponentState = 'SetComponentState',
  SetDTMFDialpadDigits = 'SetDTMFDialpadDigits',
  SetInputText = 'SetInputText',
  SetTaskAttributes = 'SetTaskAttributes',
  SetWorkerActivity = 'SetWorkerActivity',
  SetWorkerAttributes = 'SetWorkerAttributes',
  ShowDirectory = 'ShowDirectory',
  StartExternalWarmTransfer = 'StartExternalWarmTransfer',
  StartOutboundCall = 'StartOutboundCall',
  StartOutboundEmailTask = 'StartOutboundEmailTask',
  StopMonitoringCall = 'StopMonitoringCall',
  ToggleDTMFDialpad = 'ToggleDTMFDialpad',
  ToggleMute = 'ToggleMute',
  ToggleOutboundDialer = 'ToggleOutboundDialer',
  ToggleSidebar = 'ToggleSidebar',
  TransferTask = 'TransferTask',
  UnholdCall = 'UnholdCall',
  UnholdParticipant = 'UnholdParticipant',
  UpdateCustomerParticipant = 'UpdateCustomerParticipant',
  UpdateWorkerParticipant = 'UpdateWorkerParticipant',
  UpdateWorkerToken = 'UpdateWorkerToken',
  WrapupTask = 'WrapupTask',
}
```