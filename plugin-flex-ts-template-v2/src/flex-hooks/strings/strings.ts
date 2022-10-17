import ActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/strings/ActivityReservationHandler";
import ActivitySkillFilter from "../../feature-library/activity-skill-filter/flex-hooks/strings/ActivitySkillFilter";
import Conference from "../../feature-library/conference/flex-hooks/strings/Conference";
import ChatTransfer from "../../feature-library/chat-transfer/flex-hooks/strings/ChatTransferStrings";
import DualChannelRecording from "../../feature-library/dual-channel-recording/flex-hooks/strings/DualChannelRecording";
import PauseRecording from "../../feature-library/pause-recording/flex-hooks/strings/PauseRecording";
import TeamsViewFilters from "../../feature-library/teams-view-filters/flex-hooks/strings/TeamViewQueueFilter";

const customStrings = { ...ActivityReservationHandler, ...ActivitySkillFilter, ...Conference, ...ChatTransfer, ...DualChannelRecording, ...PauseRecording, ...TeamsViewFilters };

export default customStrings;
