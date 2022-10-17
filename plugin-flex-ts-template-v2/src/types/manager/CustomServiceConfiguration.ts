import ActivityReservationHandlerConfig from "../../feature-library/activity-reservation-handler/types/ServiceConfiguration";
import ActivitySkillFilterConfig from "../../feature-library/activity-skill-filter/types/ServiceConfiguration";
import CallbackAndVoicemailConfig from "../../feature-library/callback-and-voicemail/types/ServiceConfigudation";
import CallerIdConfig from "../../feature-library/caller-id/types/ServiceConfigudation";
import ChatToVideoEscalationConfig from "../../feature-library/chat-to-video-escalation/types/ServiceConfiguration";
import ConferenceConfig from "../../feature-library/conference/types/ServiceConfiguration";
import ScrollableActivitiesConfig from "../../feature-library/scrollable-activities/types/ServiceConfiguration";
import SupervisorBargeCoachConfig from "../../feature-library/supervisor-barge-coach/types/ServiceConfiguration";
import OmniChannelCapacityManagementConfig from "../../feature-library/omni-channel-capacity-management/types/ServiceConfiguration";
import InternalCallConfig from "../../feature-library/internal-call/types/ServiceConfiguration";
import EnhancedCRMContainerConfig from "../../feature-library/enhanced-crm-container/types/ServiceConfiguration";
import DeviceManagerConfig from "../../feature-library/device-manager/types/ServiceConfiguration";
import ChatTransferConfiguration from "../../feature-library/chat-transfer/types/ServiceConfiguration";

export default interface FeatureServiceConfiguratoin {
  activity_reservation_handler: ActivityReservationHandlerConfig;
  activity_skill_filter: ActivitySkillFilterConfig;
  callbacks: CallbackAndVoicemailConfig;
  caller_id: CallerIdConfig;
  chat_to_video_escalation: ChatToVideoEscalationConfig;
  conference: ConferenceConfig;
  device_manager: DeviceManagerConfig;
  scrollable_activities: ScrollableActivitiesConfig;
  supervisor_barge_coach: SupervisorBargeCoachConfig;
  omni_channel_capacity_management: OmniChannelCapacityManagementConfig;
  internal_call: InternalCallConfig;
  enhanced_crm_container: EnhancedCRMContainerConfig;
  chat_transfer: ChatTransferConfiguration;
}
