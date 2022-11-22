import * as Flex from "@twilio/flex-ui";

type ActionNames =
  | "AcceptTask"
  | "ApplyTeamsViewFilters"
  | "CompleteTask"
  | "HangupCall"
  | "HoldCall"
  | "UnholdCall"
  | "HoldParticipant"
  | "KickParticipant"
  | "MonitorCall"
  | "StopMonitorCall"
  | "SelectTask"
  | "SetWorkerActivity"
  | "StartOutboundCall"
  | "ToggleMute"
  | "UnHoldParticipant"
  | "NavigateToView"
  | "RejectTask"
  | "SetActivity"
  | "StartExternalWarmTransfer"
  | "ShowDirectory"
  | "TransferTask"
  | "WrapUpTask";

type ActionEvents = "before" | "after" | "replace";

type ActionHandler = (flex: typeof Flex, manager: Flex.Manager) => void;

export type Actions = Partial<
  Record<ActionNames, Partial<Record<ActionEvents, ActionHandler[]>>>
>;
