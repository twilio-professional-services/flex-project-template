import * as Flex from "@twilio/flex-ui";
import ActivityHandler from "../../feature-library/activity-reservation-handler/flex-hooks/strings/ActivityReservationHandler";
import Conference from "../../feature-library/conference/flex-hooks/strings/Conference";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  manager.strings = {
    // -v- Add custom strings here -v-'
    ...ActivityHandler,
    ...Conference,
    // -^---------------------------^-

    ...manager.strings,

    // -v- Modify strings provided by flex here -v-
    //WorkerDirectoryAgentsTabLabel: '<span style="font-size: 10px;">Agents</span>',
    //WorkerDirectoryQueuesTabLabel: '<span style="font-size: 10px;">Queues</span>',
    // -^----------------------------------------^-
  } as any;
};
