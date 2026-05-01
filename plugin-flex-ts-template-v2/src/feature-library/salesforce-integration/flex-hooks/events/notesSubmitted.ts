import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';
import { setChannelNote } from '../states';
import logger from '../../../../utils/logger';
import { isCopilotNotesEnabled } from '../../config';

export const eventName = FlexEvent.notesSubmitted;
export const eventHook = async function collectCopilotNotes(flex: typeof Flex, manager: Flex.Manager, notes: any) {
  if (!isCopilotNotesEnabled()) {
    return;
  }
  logger.log('[salesforce-integration] Received agent copilot wrapup summary', notes);
  manager.store.dispatch(
    setChannelNote({
      channelSid: notes.channelSid,
      dispositionCode: {
        disposition_code: notes.dispositionCode.disposition_code,
        topic_path: notes.dispositionCode.topic_path,
      },
      sentiment: notes.sentiment,
      summary: notes.summary,
    }),
  );
};
