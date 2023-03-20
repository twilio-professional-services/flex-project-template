import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';
import { initialize } from '../../config';

export const eventName = FlexEvent.pluginsLoaded;
export const eventHook = (flex: typeof Flex, manager: Flex.Manager) => {
  initialize();
};
