import * as Flex from "@twilio/flex-ui";
import { Actions as BargeCoachStatusAction, SupervisorBargeCoachState } from "../../flex-hooks/states/SupervisorBargeCoach";
import { isSupervisorMonitorPanelEnabled } from '../..';
import { reduxNamespace } from "../../../../utils/state";
// Import to get Sync Doc updates
import { SyncDoc } from "../../utils/sync/Sync";
import { FlexActionEvent, FlexAction } from "../../../../types/feature-loader";

export const actionEvent = FlexActionEvent.after;
export const actionName = FlexAction.MonitorCall;
export const actionHook = async function enableBargeCoachButtonsUponMonitor(
  flex: typeof Flex,
  manager: any
) {
  // Listening for supervisor to monitor the call to enable the
  // barge and coach buttons, as well as reset their muted/coaching states
  flex.Actions.addListener("afterMonitorCall", (payload) => {
    console.log(
      `Monitor button triggered, enable the Coach and Barge-In Buttons`
    );
    manager.store.dispatch(
      BargeCoachStatusAction.setBargeCoachStatus({
        enableCoachButton: true,
        coaching: false,
        enableBargeinButton: true,
        muted: true,
      })
    );

    // If the Supervisor Monitor Panel feature is enabled, we want to update the Sync Doc that we are monitoring
    // However we do not want to if privateMode is enabled by the Supervisor
    if (!isSupervisorMonitorPanelEnabled()) return;
    const { privateMode } =
      manager.store.getState()[reduxNamespace].supervisorBargeCoach as SupervisorBargeCoachState;
    if (privateMode) return;

    const myWorkerSID = manager.store.getState().flex?.worker?.worker?.sid;
    const agentWorkerSID =
      manager.store.getState().flex?.supervisor?.stickyWorker?.worker?.sid;
    const supervisorFN =
      manager.store.getState().flex?.worker?.attributes?.full_name;
    const conferenceSID = payload.task?.conference?.conferenceSid;

    SyncDoc.initSyncDoc(
      agentWorkerSID,
      conferenceSID,
      myWorkerSID,
      supervisorFN,
      "is Monitoring",
      "add"
    );
  });
};
