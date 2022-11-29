import { Components } from "../../types/flex-hooks/Components";
import { addConferenceToCallCanvas } from "../../feature-library/conference/flex-hooks/components/CallCanvas";
import { addSupervisorCoachingPanelToAgent } from "../../feature-library/supervisor-barge-coach/flex-hooks/components/CallCanvas";
import { addConferenceToCallCanvasActions } from "../../feature-library/conference/flex-hooks/components/CallCanvasActions";
import { addPendingActivityComponent } from "../../feature-library/activity-reservation-handler/flex-hooks/components/MainHeader";
import { replaceActivityComponent } from "../../feature-library/activity-skill-filter/flex-hooks/components/MainHeader";
import { addOutboundCallerIdSelectorToMainHeader } from "../../feature-library/caller-id/flex-hooks/components/OutboundDialerPanel";
import { addConferenceToParticipantCanvas } from "../../feature-library/conference/flex-hooks/components/ParticipantCanvas";
import { addSwitchToVideoToTaskCanvasHeader } from "../../feature-library/chat-to-video-escalation/flex-hooks/components/TaskCanvasHeader";
import { addVideoRoomTabToTaskCanvasTabs } from "../../feature-library/chat-to-video-escalation/flex-hooks/components/TaskCanvasTabs";
import { addSupervisorMonitorPanel } from "../../feature-library/supervisor-barge-coach/flex-hooks/components/TaskCanvasTabs";
import { replaceViewForCallbackAndVoicemail } from "../../feature-library/callback-and-voicemail/flex-hooks/components/TaskInfoPanel";
import { addSupervisorBargeCoachButtons } from "../../feature-library/supervisor-barge-coach/flex-hooks/components/TaskOverviewCanvas";
import { addInternalCallToDialerPanel } from "../../feature-library/internal-call/flex-hooks/components/OutboundDialerPanel";
import { removeFromCanvasForInternalCall } from "../../feature-library/internal-call/flex-hooks/components/ParticipantCanvas";
import { replaceAndSetCustomCRMContainer } from "../../feature-library/enhanced-crm-container/flex-hooks/components/CRMContainer";
import { addDeviceManagerToMainHeader } from "../../feature-library/device-manager/flex-hooks/components/MainHeader";
import { addChatTransferButton } from "../../feature-library/chat-transfer/flex-hooks/components/TaskCanvasHeader";
import { replaceWorkerProfileInfo } from "../../feature-library/activity-skill-filter/flex-hooks/components/WorkerProfile";
import { addCapacityToWorkerCanvas } from "../../feature-library/supervisor-capacity/flex-hooks/components/WorkerCanvas";
import { addPauseRecordingButton } from "../../feature-library/pause-recording/flex-hooks/components/CallCanvasActions";
import { addPauseStatusPanel } from "../../feature-library/pause-recording/flex-hooks/components/CallCanvas";
import { addScheduleManagerToSideNav } from "../../feature-library/schedule-manager/flex-hooks/components/SideNav";
import { addScheduleManagerView } from "../../feature-library/schedule-manager/flex-hooks/components/ViewCollection";
import { replaceWorkerDataTableCallsColumnMultiCall } from "../../feature-library/multi-call/flex-hooks/components/WorkersDataTable";

const componentHandlers: Components = {
  AgentDesktopView: [],
  CallCanvas: [
    addConferenceToCallCanvas,
    addSupervisorCoachingPanelToAgent,
    addPauseStatusPanel
  ],
  CallCanvasActions: [
    addConferenceToCallCanvasActions,
    addPauseRecordingButton
  ],
  CRMContainer: [replaceAndSetCustomCRMContainer],
  MainHeader: [
    addPendingActivityComponent,
    addDeviceManagerToMainHeader,
    replaceActivityComponent
  ],
  MessageListItem: [],
  NoTasksCanvas: [],
  OutboundDialerPanel: [
    addOutboundCallerIdSelectorToMainHeader,
    addInternalCallToDialerPanel,
  ],
  ParticipantCanvas: [
    addConferenceToParticipantCanvas,
    removeFromCanvasForInternalCall
  ],
  SideNav: [addScheduleManagerToSideNav],
  TaskCanvasHeader: [addSwitchToVideoToTaskCanvasHeader, addChatTransferButton],
  TaskCanvasTabs: [addVideoRoomTabToTaskCanvasTabs, addSupervisorMonitorPanel],
  TaskInfoPanel: [replaceViewForCallbackAndVoicemail],
  TaskListButtons: [],
  TaskOverviewCanvas: [addSupervisorBargeCoachButtons],
  TeamsView: [],
  ViewCollection: [addScheduleManagerView],
  WorkerCanvas: [addCapacityToWorkerCanvas],
  WorkerDirectory: [],
  WorkerProfile: [replaceWorkerProfileInfo],
  WorkersDataTable: [replaceWorkerDataTableCallsColumnMultiCall],
};

export default componentHandlers;
