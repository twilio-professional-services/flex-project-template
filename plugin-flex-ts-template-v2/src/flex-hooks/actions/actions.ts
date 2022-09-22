import { Actions } from "../../types/flex-hooks/Actions";

import { omniChannelChatCapacityManager } from "../../feature-library/omni-channel-capacity-management/flex-hooks/actions/AcceptTask";
import { beforeCompleteWorkerTask } from "../../feature-library/activity-reservation-handler/flex-hooks/actions/CompleteTask";
import { beforeCompleteVideoEscalatedChatTask } from "../../feature-library/chat-to-video-escalation/flex-hooks/actions/CompleteTask";
import { handleConferenceHangup } from "../../feature-library/conference/flex-hooks/actions/HangupCall";
import { handleHoldConferenceParticipant } from "../../feature-library/conference/flex-hooks/actions/HoldParticipant";
import { handleKickConferenceParticipant } from "../../feature-library/conference/flex-hooks/actions/KickParticipant";
import {
  enableBargeCoachButtonsUponMonitor,
  disableBargeCoachButtonsUponMonitor,
} from "../../feature-library/supervisor-barge-coach/flex-hooks/actions/MonitorCall";
import { autoSelectCallbackTaskWhenEndingCall } from "../../feature-library/callback-and-voicemail/flex-hooks/actions/SelectTask";
import { beforeSetActivity } from "../../feature-library/activity-reservation-handler/flex-hooks/actions/SetWorkerActivity";
import { applySelectedCallerIdForDialedNumbers } from "../../feature-library/caller-id/flex-hooks/actions/StartOutboundCall";
import { changeWorkerActivityBeforeOutboundCall } from "../../feature-library/activity-reservation-handler/flex-hooks/actions/StartOutboundCall";
import { handleUnholdConferenceParticipant } from "../../feature-library/conference/flex-hooks/actions/UnholdParticipant";

const actionsToRegister: Actions = {
  AcceptTask: {
    before: [omniChannelChatCapacityManager],
    after: [],
    replace: [],
  },
  CompleteTask: {
    before: [beforeCompleteWorkerTask, beforeCompleteVideoEscalatedChatTask],
    after: [],
    replace: [],
  },
  HangupCall: {
    before: [handleConferenceHangup],
    after: [],
    replace: [],
  },
  HoldParticipant: {
    before: [handleHoldConferenceParticipant],
    after: [],
    replace: [],
  },
  KickParticipant: {
    before: [handleKickConferenceParticipant],
    after: [],
    replace: [],
  },
  MonitorCall: {
    before: [enableBargeCoachButtonsUponMonitor],
    after: [],
    replace: [],
  },
  StopMonitorCall: {
    before: [],
    after: [disableBargeCoachButtonsUponMonitor],
    replace: [],
  },
  SelectTask: {
    before: [],
    after: [autoSelectCallbackTaskWhenEndingCall],
    replace: [],
  },
  SetWorkerActivity: {
    before: [beforeSetActivity],
    after: [],
    replace: [],
  },
  StartOutboundCall: {
    before: [
      applySelectedCallerIdForDialedNumbers,
      changeWorkerActivityBeforeOutboundCall,
    ],
    after: [],
    replace: [],
  },
  UnHoldParticipant: {
    before: [handleUnholdConferenceParticipant],
    after: [],
    replace: [],
  },
  NavigateToView: {},
  RejectTask: {},
  SetActivity: {},
  TransferTask: {},
  WrapUpTask: {},
};

export default actionsToRegister;
