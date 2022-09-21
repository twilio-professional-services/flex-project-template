import * as Flex from "@twilio/flex-ui";
import { Components } from "../../types/flex-hooks/Components";
import { sampleFeatureCustomTaskListToPanel1 } from "../../feature-library/myPlugin/flex-hooks/components/AgentDesktopView";
import { addConferenceToCallCanvas } from "../../feature-library/conference/flex-hooks/components/CallCanvas";
import { addSupervisorCoachingPanelToAgent } from "../../feature-library/supervisor-barge-coach/flex-hooks/components/CallCanvas";
import { addConferenceToCallCanvasActions } from "../../feature-library/conference/flex-hooks/components/CallCanvasActions";
import { addPendingActivityComponent } from "../../feature-library/activity-reservation-handler/flex-hooks/components/MainHeader";
import { addOutboundCallerIdSelectorToMainHeader } from "../../feature-library/caller-id/flex-hooks/components/OutboundDialerPanel";
import { addConferenceToParticipantCanvas } from "../../feature-library/conference/flex-hooks/components/ParticipantCanvas";
import { addSwitchToVideoToTaskCanvasHeader } from "../../feature-library/chat-to-video-escalation/flex-hooks/components/TaskCanvasHeader";
import { addVideoRoomTabToTaskCanvasTabs } from "../../feature-library/chat-to-video-escalation/flex-hooks/components/TaskCanvasTabs";
import { addSupervisorMonitorPanel } from "../../feature-library/supervisor-barge-coach/flex-hooks/components/TaskCanvasTabs";
import { replaceViewForCallbackAndVoicemail } from "../../feature-library/callback-and-voicemail/flex-hooks/components/TaskInfoPanel";
import { addSupervisorBargeCoachButtons } from "../../feature-library/supervisor-barge-coach/flex-hooks/components/TaskOverviewCanvas";

const componentHandlers: Components = {
  AgentDesktopView: [sampleFeatureCustomTaskListToPanel1],
  CallCanvas: [addConferenceToCallCanvas, addSupervisorCoachingPanelToAgent],
  CallCanvasActions: [addConferenceToCallCanvasActions],
  CRMContainer: [],
  MainHeader: [addPendingActivityComponent],
  MessageListItem: [],
  NoTasksCanvas: [],
  OutboundDialerPanel: [addOutboundCallerIdSelectorToMainHeader],
  ParticipantCanvas: [addConferenceToParticipantCanvas],
  SideNav: [],
  TaskCanvasHeader: [addSwitchToVideoToTaskCanvasHeader],
  TaskCanvasTabs: [addVideoRoomTabToTaskCanvasTabs, addSupervisorMonitorPanel],
  TaskInfoPanel: [replaceViewForCallbackAndVoicemail],
  TaskListButtons: [],
  TaskOverviewCanvas: [addSupervisorBargeCoachButtons],
  TeamsView: [],
  ViewCollection: [],
  WorkerCanvas: [],
  WorkerDirectory: [],
  WorkersDataTable: [],
};

export default componentHandlers;
