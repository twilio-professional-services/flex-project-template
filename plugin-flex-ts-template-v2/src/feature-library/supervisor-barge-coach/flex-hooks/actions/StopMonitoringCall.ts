import * as Flex from "@twilio/flex-ui";
import { Actions as BargeCoachStatusAction } from "../../flex-hooks/states/SupervisorBargeCoach";
import { isAgentCoachingPanelEnabled, isSupervisorMonitorPanelEnabled } from '../..';
// Import to get Sync Doc updates
import { SyncDoc } from "../../utils/sync/Sync";
import { FlexActionEvent, FlexAction } from "../../../../types/feature-loader/FlexAction";

export const actionEvent = FlexActionEvent.after;
export const actionName = FlexAction.StopMonitoringCall;
export const actionHook = async function disableBargeCoachButtonsUponMonitor(
  flex: typeof Flex,
  manager: Flex.Manager
) {
  // Listening for supervisor to click to unmonitor the call to disable the
  // barge and coach buttons, as well as reset their muted/coaching states
  flex.Actions.addListener("afterStopMonitoringCall", (payload) => {
    console.log(
      `Unmonitor button triggered, disable the Coach and Barge-In Buttons`
    );
    manager.store.dispatch(
      BargeCoachStatusAction.setBargeCoachStatus({
        enableCoachButton: false,
        coaching: false,
        enableBargeinButton: false,
        muted: true,
        barge: false,
      })
    );

    // If the Agent Coaching Panel and Supervisor Monitor Panel are disabled, we can skip otherwise
    // We need to update the Sync Doc to remove the Supervisor after they unmonitor the call
    if (!isAgentCoachingPanelEnabled() && !isSupervisorMonitorPanelEnabled()) return;

    const myWorkerSID = manager.store.getState().flex?.worker?.worker?.sid;
    const agentWorkerSID =
      manager.store.getState().flex?.supervisor?.stickyWorker?.worker?.sid;
    const supervisorFN =
      manager.store.getState().flex?.worker?.attributes?.full_name;
    SyncDoc.initSyncDoc(
      agentWorkerSID,
      "",
      myWorkerSID,
      supervisorFN,
      "",
      "remove"
    );
  });
};
