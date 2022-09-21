import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../types/manager/FlexEvent";
import taskAcceptedHandlerActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/events/taskAccepted";
import taskEndedHandlerActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/events/taskEnded";
import taskReceivedActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/events/taskReceived";
import taskWrapupHandlerActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/events/taskWrapup";

import ActivityReservationHandlerLoaded from "../../feature-library/activity-reservation-handler/flex-hooks/events/pluginsLoaded";
import CallbackAndVoicemailLoaded from "../../feature-library/callback-and-voicemail/flex-hooks/events/pluginsLoaded";
import CallerIdLoaded from "../../feature-library/caller-id/flex-hooks/events/pluginsLoaded";
import ConferenceLoaded from "../../feature-library/conference/flex-hooks/events/pluginsLoaded";
import OmniChannelCapacityManagementLoaded from "../../feature-library/omni-channel-capacity-management/flex-hooks/events/pluginsLoaded";
import ScrollableActivitiesLoaded from "../../feature-library/scrollable-activities/flex-hooks/events/pluginsLoaded";

const eventHandlers: Record<FlexEvent, ((...args: any[]) => void)[]> = {
  pluginsLoaded: [
    ActivityReservationHandlerLoaded,
    CallbackAndVoicemailLoaded,
    CallerIdLoaded,
    ConferenceLoaded,
    OmniChannelCapacityManagementLoaded,
    ScrollableActivitiesLoaded,
  ],
  taskAccepted: [taskAcceptedHandlerActivityReservationHandler],
  taskCanceled: [taskEndedHandlerActivityReservationHandler],
  taskCompleted: [taskEndedHandlerActivityReservationHandler],
  taskReceived: [taskReceivedActivityReservationHandler],
  taskRejected: [taskEndedHandlerActivityReservationHandler],
  taskRescinded: [taskEndedHandlerActivityReservationHandler],
  taskTimeout: [taskEndedHandlerActivityReservationHandler],
  taskUpdated: [],
  taskWrapup: [taskWrapupHandlerActivityReservationHandler],
};

export default eventHandlers;
