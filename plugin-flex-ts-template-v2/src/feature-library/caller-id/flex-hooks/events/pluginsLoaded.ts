import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../../../types/manager/FlexEvent";

import { UIAttributes } from "types/manager/ServiceConfiguration";

const { custom_data } =
  (Flex.Manager.getInstance().configuration as UIAttributes) || {};
const { enabled = false } = custom_data?.features?.caller_id || {};

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!enabled) return;

  console.log(`Feature enabled: caller-id`);
};

export default pluginsLoadedHandler;
