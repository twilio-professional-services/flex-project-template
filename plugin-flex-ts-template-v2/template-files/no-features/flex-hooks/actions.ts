import { Actions } from "../../types/flex-hooks/Actions";

// Replace the action that your plugin wants to register.
// For example asuming you have added a feature to the template plugin called customPlugin that listens on the beforeAcceptTask action

// import {customPluginAcceptTask} from "../../feature-library/customPlugin/flex-hooks/actions/AcceptTask";
// actions_template = { AcceptTask: {before: [customPluginAcceptTask], replace: [], after: []}}

// where before: is an array of methods that will call Actions.addListener("beforeAcceptTask", {})

const actionsToRegister: Actions = {
  AcceptTask: { before: [], replace: [], after: [] },
  ApplyTeamsViewFilters: {},
  CompleteTask: {},
  HangupCall: {},
  HoldCall: {},
  UnholdCall: {},
  HoldParticipant: {},
  KickParticipant: {},
  MonitorCall: {},
  StopMonitorCall: {},
  SelectTask: {},
  SetWorkerActivity: {},
  StartOutboundCall: {},
  UnHoldParticipant: {},
  NavigateToView: {},
  RejectTask: {},
  SetActivity: {},
  TransferTask: {},
  WrapUpTask: {},
};

export default actionsToRegister;
