import { ActionPayload } from '@twilio/flex-ui';

import ChatTransferService from '../../utils/serverless/ChatTransferService';

export const chatTransferTaskAction = async (payload: ActionPayload) => {
  if (!payload) {
    return;
  }

  await ChatTransferService.executeChatTransfer(payload.task, payload.targetSid, payload.options);
};
