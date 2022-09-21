import * as Flex from "@twilio/flex-ui";

import { UIAttributes } from "types/manager/ServiceConfiguration";

const { custom_data } =
  (Flex.Manager.getInstance().serviceConfiguration
    .ui_attributes as UIAttributes) || {};
const { enabled = false } = custom_data?.features?.scrollable_activities || {};

export default async () => {
  if (!enabled) return;

  /***
   * This is a temporary way to accomplish this, given Paste and <CustomizationProvider> features.
   * However, Flex 2 as of the time of writing this code, does not uniguely identify the Activities MENU
   * element.  Should Flex 2 wrap the generic MENU in a custom element (perhaps ACTIVITY_MENU), then
   * we could leverage something like this:
   * <CustomizationProvider baseTheme="default" elements={{
   *   "ACTIVITY_MENU": {
   *     overflowY: 'scroll',
   *     maxHeight: '90vh',
   *   }
   * }}>
   *
   */
  Flex.Manager.getInstance().updateConfig({
    theme: {
      componentThemeOverrides: {
        MainHeader: {
          Container: {
            ".Twilio-MainHeader-end": {
              "[data-paste-element='MENU']": {
                overflowY: "scroll",
                maxHeight: "90vh",
              },
            },
          },
        },
      },
    },
  });
};
