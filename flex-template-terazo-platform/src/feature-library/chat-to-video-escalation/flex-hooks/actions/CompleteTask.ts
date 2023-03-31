import * as Flex from '@twilio/flex-ui';

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.CompleteTask;
export const actionHook = function beforeCompleteVideoEscalatedChatTask(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {
    const { videoRoom } = payload.task.attributes;

    if (!Flex.TaskHelper.isChatBasedTask(payload.task) || !videoRoom) {
      return payload;
    }

    if (videoRoom === 'connected') {
      alert('You are still connected to a video room. Please disconnect before completing the task.');
      abortFunction();
    }

    return payload;
  });
};
