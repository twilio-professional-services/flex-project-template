import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { initialize } from "../../index";
import { isFeatureEnabled } from '../..';

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!isFeatureEnabled()) return;

  console.log(`Feature enabled: activity-reservation-handler`);
  initialize();
};

export default pluginsLoadedHandler;
