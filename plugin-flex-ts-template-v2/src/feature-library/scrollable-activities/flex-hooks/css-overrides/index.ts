import * as Flex from "@twilio/flex-ui";
import { isFeatureEnabled } from '../..';

export default (flex: typeof Flex, manager: Flex.Manager) => {
  if (!isFeatureEnabled()) return;

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
  manager.updateConfig({
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
