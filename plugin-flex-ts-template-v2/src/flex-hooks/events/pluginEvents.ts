import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../types/manager/FlexEvent";
import pluginsLoadedActivityReservationHandler from "../../feature-library/activity-reservation-handler/flex-hooks/events/pluginsLoaded";

export default (flex: typeof Flex, manager: Flex.Manager) => {
  pluginsLoadedHandlers(manager);
};

const pluginsLoadedHandlers = (manager: Flex.Manager) => {
  manager.events.addListener(FlexEvent.pluginsLoaded, () =>
    pluginsLoadedActivityReservationHandler(FlexEvent.pluginsLoaded)
  );
};
