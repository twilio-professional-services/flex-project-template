import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = function registerAction(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.registerAction('CRMContainerLoaded', async () => {
    // Do nothing! The TabbedCRMTask component adds a listener to afterCRMContainerLoaded to handle the payload.
  });
};
