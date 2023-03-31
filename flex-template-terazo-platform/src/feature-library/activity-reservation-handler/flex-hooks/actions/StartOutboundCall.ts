import * as Flex from '@twilio/flex-ui';

import WorkerState from '../../helpers/workerActivityHelper';
import { storeCurrentActivitySidIfNeeded } from '../../helpers/pendingActivity';
import { onTaskActivity, onTaskNoAcdActivity } from '../../helpers/systemActivities';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.StartOutboundCall;
export const actionHook = function changeWorkerActivityBeforeOutboundCall(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (_payload, _abortFunction) => {
    storeCurrentActivitySidIfNeeded();

    const targetActivity = WorkerState.activity?.available ? onTaskActivity : onTaskNoAcdActivity;

    WorkerState.setWorkerActivity(targetActivity?.sid);
    await WorkerState.waitForWorkerActivityChange(targetActivity?.sid);
  });
};
