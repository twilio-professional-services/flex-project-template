import * as Flex from '@twilio/flex-ui';
import WorkerState from '../states/WorkerState';
import { UIAttributes } from 'types/manager/ServiceConfiguration';
import {
  onTaskActivity,
  onTaskNoAcdActivity,
  setWorkerActivity,
  storeCurrentActivitySidIfNeeded,
} from '../../utils/WorkerActivities';

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled } = custom_data.features.activity_reservation_handler;

export function changeWorkerActivityBeforeOutboundCall(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;

  flex.Actions.addListener('beforeStartOutboundCall', async (payload, abortFunction) => {
    storeCurrentActivitySidIfNeeded();

    const targetActivity = WorkerState.workerActivity.available ? onTaskActivity : onTaskNoAcdActivity;

    setWorkerActivity(flex, targetActivity?.sid);
    await WorkerState.waitForWorkerActivityChange(targetActivity?.sid);
  });
}
