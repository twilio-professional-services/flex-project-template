import { FlexEvent } from "../../types/manager/FlexEvent";
// add-feature-script: pluginsLoaded imports
import ActivityReservationHandlerLoaded from "../../feature-library/activity-reservation-handler/flex-hooks/events/pluginsLoaded";
import ActivitySkillFilterLoaded from "../../feature-library/activity-skill-filter/flex-hooks/events/pluginsLoaded";
import CallbackAndVoicemailLoaded from "../../feature-library/callback-and-voicemail/flex-hooks/events/pluginsLoaded";
import CallerIdLoaded from "../../feature-library/caller-id/flex-hooks/events/pluginsLoaded";
import ConferenceLoaded from "../../feature-library/conference/flex-hooks/events/pluginsLoaded";
import OmniChannelCapacityManagementLoaded from "../../feature-library/omni-channel-capacity-management/flex-hooks/events/pluginsLoaded";
import ScrollableActivitiesLoaded from "../../feature-library/scrollable-activities/flex-hooks/events/pluginsLoaded";
import EnhancedCRMContainerLoaded from "../../feature-library/enhanced-crm-container/flex-hooks/events/pluginsLoaded";
import ConversationTransferLoaded from "../../feature-library/conversation-transfer/flex-hooks/events/pluginsLoaded";
import DualChannelRecordingLoaded from "../../feature-library/dual-channel-recording/flex-hooks/events/pluginsLoaded";
import PauseRecordingLoaded from "../../feature-library/pause-recording/flex-hooks/events/pluginsLoaded";
import TeamsViewFiltersLoaded from "../../feature-library/teams-view-filters/flex-hooks/events/pluginsLoaded";
import SupervisorCapacityLoaded from "../../feature-library/supervisor-capacity/flex-hooks/events/pluginsLoaded";
import ScheduleManagerLoaded from "../../feature-library/schedule-manager/flex-hooks/events/pluginsLoaded";
import MultiCallLoaded from "../../feature-library/multi-call/flex-hooks/events/pluginsLoaded";
import ChatTransferLoaded from "../../feature-library/chat-transfer/flex-hooks/events/pluginsLoaded";
import InternalCallLoaded from "../../feature-library/internal-call/flex-hooks/events/pluginsLoaded";
import HangUpByLoaded from "../../feature-library/hang-up-by/flex-hooks/events/pluginsLoaded";
import AgentAutomationLoaded from "../../feature-library/agent-automation/flex-hooks/events/pluginsLoaded";
import SupervisorCompleteReservationLoaded from "../../feature-library/supervisor-complete-reservation/flex-hooks/events/pluginsLoaded";

// tokenUpdated imports
import MultiCallTokenUpdated from "../../feature-library/multi-call/flex-hooks/events/tokenUpdated";

// task event imports
import autoSelectAndAcceptTask from "../../feature-library/agent-automation/flex-hooks/events/taskReceived";
import taskAcceptedHandlerActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/events/taskAccepted";
import taskEndedHandlerActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/events/taskEnded";
import taskReceivedActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/events/taskReceived";
import taskWrapupHandlerActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/events/taskWrapup";
import taskAcceptedHandlerDualChannelRecording from "../../feature-library/dual-channel-recording/flex-hooks/events/taskAccepted";
import HangUpByTaskCompleted from "../../feature-library/hang-up-by/flex-hooks/events/taskCompleted";
import HangUpByTaskWrapup from "../../feature-library/hang-up-by/flex-hooks/events/taskWrapup";

const eventHandlers: Record<FlexEvent, ((...args: any[]) => void)[]> = {
  pluginsLoaded: [
    ActivityReservationHandlerLoaded,
    ActivitySkillFilterLoaded,
    CallbackAndVoicemailLoaded,
    CallerIdLoaded,
    ConferenceLoaded,
    OmniChannelCapacityManagementLoaded,
    ScrollableActivitiesLoaded,
    EnhancedCRMContainerLoaded,
    ConversationTransferLoaded,
    DualChannelRecordingLoaded,
    PauseRecordingLoaded,
    TeamsViewFiltersLoaded,
    SupervisorCapacityLoaded,
    ScheduleManagerLoaded,
    MultiCallLoaded,
    ChatTransferLoaded,
    InternalCallLoaded,
    HangUpByLoaded,
    AgentAutomationLoaded,
    SupervisorCompleteReservationLoaded,
    // add-feature-script: add pluginsLoaded handlers above this line
  ],
  taskAccepted: [
    taskAcceptedHandlerActivityReservationHandler,
    taskAcceptedHandlerDualChannelRecording
  ],
  taskCanceled: [taskEndedHandlerActivityReservationHandler],
  taskCompleted: [
    taskEndedHandlerActivityReservationHandler,
    HangUpByTaskCompleted
  ],
  taskReceived: [taskReceivedActivityReservationHandler, autoSelectAndAcceptTask],
  taskRejected: [taskEndedHandlerActivityReservationHandler],
  taskRescinded: [taskEndedHandlerActivityReservationHandler],
  taskTimeout: [taskEndedHandlerActivityReservationHandler],
  taskUpdated: [],
  taskWrapup: [
    taskWrapupHandlerActivityReservationHandler,
    HangUpByTaskWrapup
  ],
  tokenUpdated: [MultiCallTokenUpdated]
};

export default eventHandlers;
