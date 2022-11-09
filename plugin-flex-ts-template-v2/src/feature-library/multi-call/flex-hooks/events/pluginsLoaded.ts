import * as Flex from "@twilio/flex-ui";
import { FlexEvent } from "../../../../types/manager/FlexEvent";
import { NotificationIds } from "../notifications/MultiCall";
import { UIAttributes } from "types/manager/ServiceConfiguration";
const { custom_data } =
  (Flex.Manager.getInstance().configuration as UIAttributes) || {};
const { enabled = false } =
  custom_data?.features?.multi_call || {};

const pluginsLoadedHandler = (flexEvent: FlexEvent) => {
  if (!enabled) return;

  console.log(`Feature enabled: multi-call`);
  
  // Test to make sure the sdkOptions property has been
  // configured correctly. If it has not, throw errors and notifications.
  const { allowIncomingWhileBusy } = Flex.Manager.getInstance().configuration.sdkOptions?.voice ?? {};
  
  if (allowIncomingWhileBusy) {
    Flex.Notifications.showNotification(NotificationIds.MultiCallBroken);
    console.error(
      'ERROR: allowIncomingWhileBusy is enabled, so the multi-call feature will not work properly.'
    );
  }
  
  //
};

export default pluginsLoadedHandler;
