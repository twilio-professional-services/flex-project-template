import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function registerAction(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.registerAction('OpenFeatureSettings', async () => {
    // Do nothing! The FeatureModal component adds a listener to afterOpenFeatureSettings to handle the payload.
  });
};
