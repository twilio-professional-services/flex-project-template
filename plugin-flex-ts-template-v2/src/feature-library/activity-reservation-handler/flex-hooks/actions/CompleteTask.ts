import * as Flex from '@twilio/flex-ui';

import FlexHelper from '../../helpers/flexHelper';
import WorkerState from '../../helpers/workerActivityHelper';
import { getPendingActivity } from '../../helpers/pendingActivity';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.CompleteTask;
export const actionHook = function beforeCompleteWorkerTask(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async () => {
    if (FlexHelper.activeTaskCount > 1) {
      return;
    }

    const pendingActivity = getPendingActivity();

    if (pendingActivity) {
      console.debug('beforeCompleteTask, Setting worker to pending activity', pendingActivity.name);
      WorkerState.setWorkerActivity(pendingActivity.sid, true);
      await WorkerState.waitForWorkerActivityChange(pendingActivity.sid);
    }
  });
};
