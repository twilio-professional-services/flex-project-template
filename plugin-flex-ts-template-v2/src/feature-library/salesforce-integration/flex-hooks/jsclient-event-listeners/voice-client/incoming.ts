import * as Flex from '@twilio/flex-ui';
import { Call } from '@twilio/voice-sdk';

import { FlexJsClient, VoiceEvent } from '../../../../../types/feature-loader';
import { getConsole } from '../../../utils/SfdcHelper';
import logger from '../../../../../utils/logger';
import { isPreventPopoutEnabled } from '../../../config';

export const clientName = FlexJsClient.voiceClient;
export const eventName = VoiceEvent.incoming;
export const jsClientHook = (_flex: typeof Flex, manager: Flex.Manager, call: Call) => {
  if (!isPreventPopoutEnabled() || !getConsole()) {
    // We cannot do anything if the console API has not been loaded or if this functionality is disabled
    return;
  }

  getConsole().setCustomConsoleComponentPopoutable(false, (result: any) => {
    logger.log(`[salesforce-integration] Disable popoutable ${result.success ? 'successful' : 'failed'}`);
  });

  for (const event of ['cancel', 'disconnect', 'error', 'reject']) {
    call.on(event, () => {
      getConsole().setCustomConsoleComponentPopoutable(true, (result: any) => {
        logger.log(`[salesforce-integration] Enable popoutable ${result.success ? 'successful' : 'failed'}`);
      });
    });
  }
};
