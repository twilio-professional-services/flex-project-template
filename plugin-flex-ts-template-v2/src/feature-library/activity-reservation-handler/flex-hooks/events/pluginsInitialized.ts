import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';
import { initialize } from '../../config';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = (_flex: typeof Flex, _manager: Flex.Manager) => {
  initialize();
};
