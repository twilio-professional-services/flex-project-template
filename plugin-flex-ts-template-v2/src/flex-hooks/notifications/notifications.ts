import * as Flex from "@twilio/flex-ui";
import ActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/notifications/ActivityReservationHandler";
import ActivitySkillFilter from "../../feature-library/activity-skill-filter/flex-hooks/notifications/ActivitySkillFilter";
import Conference from "../../feature-library/conference/flex-hooks/notifications/Conference";
import ChatTransfer from "../../feature-library/chat-transfer/flex-hooks/notifications/TransferResult";
import DualChannelRecording from "../../feature-library/dual-channel-recording/flex-hooks/notifications/DualChannelRecording";
import PauseRecording from "../../feature-library/pause-recording/flex-hooks/notifications/PauseRecording";
import TeamsViewFilters from "../../feature-library/teams-view-filters/flex-hooks/notifications/TeamViewQueueFilter";
import ScheduleManager from "../../feature-library/schedule-manager/flex-hooks/notifications/ScheduleManager";
import MultiCall from "../../feature-library/multi-call/flex-hooks/notifications/MultiCall";
import InternalCall from "../../feature-library/internal-call/flex-hooks/notifications/InternalCall";
import Callback from "../../feature-library/callback-and-voicemail/flex-hooks/notifications/Callback";
import ChatToVideo from "../../feature-library/chat-to-video-escalation/flex-hooks/notifications/ChatToVideo";

const notificationsToRegister: ((
  flex: typeof Flex,
  manager: Flex.Manager
) => void)[] = [ActivityReservationHandler, ActivitySkillFilter, Conference, ChatTransfer, DualChannelRecording, PauseRecording, TeamsViewFilters, ScheduleManager, MultiCall, InternalCall, Callback, ChatToVideo];

export default notificationsToRegister;
