import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { canShowScheduleManager } from '../../utils/schedule-manager';

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!canShowScheduleManager(Flex.Manager.getInstance())) {
    return;
  }

  console.log(`Feature enabled: schedule-manager`);
};

export default pluginsLoadedHandler;
