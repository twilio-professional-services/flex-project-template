import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import ChatToVideoService from '../../utils/ChatToVideoService';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.WrapupTask;
export const actionHook = function completeVideoRoom(flex: typeof Flex) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload) => {
    if (!payload.task?.attributes?.videoRoomSid) return;

    await ChatToVideoService.completeRoom(payload.task.attributes.videoRoomSid);
  });
};
