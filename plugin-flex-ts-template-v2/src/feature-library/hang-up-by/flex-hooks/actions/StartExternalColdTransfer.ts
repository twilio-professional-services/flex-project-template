import * as Flex from '@twilio/flex-ui';

import { HangUpBy } from '../../enums/hangUpBy';
import { FlexActionEvent } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = 'StartExternalColdTransfer';
export const actionHook = function reportHangUpByStartExternalColdTransfer(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, _abortFunction) => {
    let { task } = payload;
    const { sid, phoneNumber } = payload;

    const newHangUpBy = HangUpBy.ExternalColdTransfer;

    if (!task) {
      task = Flex.TaskHelper.getTaskByTaskSid(sid);
    }

    await flex.Actions.invokeAction('SetHangUpBy', {
      reservationSid: task.sid,
      hangupby: newHangUpBy,
      setAttributes: { taskSid: task.taskSid, taskAttributes: task.attributes, destination: phoneNumber },
    });
  });
};
