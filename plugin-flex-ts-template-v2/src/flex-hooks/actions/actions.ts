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
import { handleInternalAcceptTask } from "../../feature-library/internal-call/flex-hooks/actions/AcceptTask";
import { handleInternalRejectTask } from "../../feature-library/internal-call/flex-hooks/actions/RejectTask";
import { handleChatTransferShowDirectory } from "../../feature-library/chat-transfer/flex-hooks/actions/ShowDirectory";
import { handleChatTransfer } from "../../feature-library/chat-transfer/flex-hooks/actions/TransferTask";
import { handleDualChannelCompleteTask } from "../../feature-library/dual-channel-recording/flex-hooks/actions/CompleteTask";
import { handleDualChannelHangupCall } from "../../feature-library/dual-channel-recording/flex-hooks/actions/HangupCall";
import { interceptQueueFilter, logApplyListFilters } from "../../feature-library/teams-view-filters/flex-hooks/actions/ApplyTeamsViewFilters";
import { handleMultiCallSelectTask } from "../../feature-library/multi-call/flex-hooks/actions/SelectTask";
import { handleMultiCallUnholdCall } from "../../feature-library/multi-call/flex-hooks/actions/UnholdCall";
import { handleMultiCallUnholdParticipant } from "../../feature-library/multi-call/flex-hooks/actions/UnholdParticipant";
import { reportHangUpByCompleteTask } from "../../feature-library/hang-up-by/flex-hooks/actions/CompleteTask";
import { reportHangUpByHangupCall } from "../../feature-library/hang-up-by/flex-hooks/actions/HangupCall";
import { reportHangUpByKickParticipant } from "../../feature-library/hang-up-by/flex-hooks/actions/KickParticipant";
import { reportHangUpByStartExternalWarmTransfer } from "../../feature-library/hang-up-by/flex-hooks/actions/StartExternalWarmTransfer";
import { reportHangUpByTransferTask } from "../../feature-library/hang-up-by/flex-hooks/actions/TransferTask";

const actionsToRegister: Actions = {
  AcceptTask: {
    before: [handleInternalAcceptTask],
    after: [omniChannelChatCapacityManager],
    replace: [],
  },
  ApplyTeamsViewFilters: {
    before: [interceptQueueFilter],
    after: [logApplyListFilters],
    replace: [],
  },
  CompleteTask: {
    before: [
      beforeCompleteWorkerTask,
      beforeCompleteVideoEscalatedChatTask,
      handleDualChannelCompleteTask,
      reportHangUpByCompleteTask
    ],
    after: [],
    replace: [],
  },
  HangupCall: {
    before: [
      handleConferenceHangup,
      handleDualChannelHangupCall,
      reportHangUpByHangupCall
    ],
    after: [],
    replace: [],
  },
  HoldCall: {
    before: [],
    after: [],
    replace: [],
  },
  UnholdCall: {
    before: [
      handleMultiCallUnholdCall
    ],
    after: [],
    replace: []
  },
  HoldParticipant: {
    before: [handleHoldConferenceParticipant],
    after: [],
    replace: [],
  },
  KickParticipant: {
    before: [
      handleKickConferenceParticipant,
      reportHangUpByKickParticipant
    ],
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
    before: [handleMultiCallSelectTask],
    after: [autoSelectCallbackTaskWhenEndingCall],
    replace: [],
  },
  SetWorkerActivity: {
    before: [beforeSetActivity],
    after: [],
    replace: [],
  },
  ShowDirectory: {
    before: [handleChatTransferShowDirectory],
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
  ToggleMute: {
    before: [],
    after: [],
    replace: [],
  },
  UnHoldParticipant: {
    before: [
      handleUnholdConferenceParticipant,
      handleMultiCallUnholdParticipant
    ],
    after: [],
    replace: [],
  },
  RejectTask: { before: [handleInternalRejectTask], after: [], replace: [] },
  NavigateToView: {},
  SetActivity: {},
  StartExternalWarmTransfer: {
    before: [reportHangUpByStartExternalWarmTransfer],
    after: [],
    replace: [],
  },
  TransferTask: {
    before: [
      handleChatTransfer,
      reportHangUpByTransferTask
    ],
    after: [],
    replace: []
  },
  WrapUpTask: {},
};

export default actionsToRegister;
