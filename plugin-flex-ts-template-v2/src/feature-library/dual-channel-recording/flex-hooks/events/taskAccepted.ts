import * as Flex from '@twilio/flex-ui';

import { recordExternalCall, recordInternalCall } from '../../helpers/dualChannelHelper';
import { getChannelToRecord } from '../../config';
import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.taskAccepted;
export const eventHook = async (flex: typeof Flex, _manager: Flex.Manager, task: Flex.ITask) => {
  if (!flex.TaskHelper.isCallTask(task)) {
    return;
  }

  const { attributes } = task;
  const { client_call, direction, conversations } = attributes;

  if (conversations && conversations.media && getChannelToRecord() === 'customer') {
    // This indicates a recording has already been started for this call
    // and all relevant metadata should already be on task attributes
    return;
  }

  if (client_call && direction === 'outbound') {
    // internal call - always record based on call SID, as conference state is unknown by Flex
    // Record only the outbound leg to prevent duplicate recordings
    // Do not await so that event processing is not blocked
    recordInternalCall(task);
  } else if (client_call) {
    // internal call, inbound leg - skip recording this leg
    console.debug('Skipping recording for inbound internal call', task.sid);
  } else {
    // External call
    // Do not await so that event processing is not blocked
    recordExternalCall(task);
  }
};
