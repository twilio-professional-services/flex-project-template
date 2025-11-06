import * as Flex from '@twilio/flex-ui';
import { SSOTokenPayload } from '@twilio/flex-ui/src/core/TokenStorage';

import { MultiCallDevices } from '../../helpers/MultiCallHelper';
import { FlexEvent } from '../../../../types/feature-loader';
import logger from '../../../../utils/logger';

export const eventName = FlexEvent.tokenUpdated;
export const eventHook = (flex: typeof Flex, manager: Flex.Manager, tokenPayload: SSOTokenPayload) => {
  MultiCallDevices.forEach((device) => {
    device.updateToken(tokenPayload.token);
  });

  logger.info('[multi-call] Token updated');
};
