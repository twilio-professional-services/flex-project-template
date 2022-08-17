import * as Flex from '@twilio/flex-ui';

import { UIAttributes } from 'types/manager/ServiceConfiguration';

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled } = custom_data.features.scrollable_activities;

export default async () => {
  if( !enabled ) return;

  /***
   * This is one of the worst ways to accomplish this, given Paste and <CustomizationProvider> features.
   * However, Flex 2 as of the time of writing this code, does not uniguely identify the Activities MENU
   * element.  Should Flex 2 wrap the generic MENU in a custom element (perhaps ACTIVITY_MENU), then
   * we could leverage something like this:
   * <CustomizationProvider baseTheme="default" elements={{
   *   "ACTIVITY_MENU": {
   *     overflowY: 'scroll',
   *     maxHeight: '90vh',
   *   }
   * }}>
   */
  
  let unmodified = true;
  while(unmodified) {
    try {
     (document.querySelectorAll("div.Twilio-MainHeader-end")[0].querySelectorAll("div[data-paste-element='MENU']")[0] as HTMLDivElement).style.cssText += 'overflow-y: scroll;max-height: 90vh;';

      unmodified = false;
    }
    catch(e) {
      await new Promise(f => setTimeout(f, 1000));
    }
  }
};
