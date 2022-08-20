import * as Flex from '@twilio/flex-ui';
import WorkerState from '../../helpers/workerActivityHelper';
import FlexState from '../../helpers/flexHelper';
import { UIAttributes } from 'types/manager/ServiceConfiguration';
import { setWorkerActivity } from '../../utils/WorkerActivities';

const { custom_data } = Flex.Manager.getInstance().serviceConfiguration.ui_attributes as UIAttributes;
const { enabled } = custom_data.features.activity_reservation_handler;

export function beforeCompleteWorkerTask(flex: typeof Flex, manager: Flex.Manager) {
  if (!enabled) return;

  flex.Actions.addListener('beforeCompleteTask', async () => {
    const pendingActivity = FlexState.pendingActivity;

    if (pendingActivity) {
      console.debug('beforeCompleteTask, Setting worker to pending activity', pendingActivity.name);
      setWorkerActivity(pendingActivity.sid, true);
      await WorkerState.waitForWorkerActivityChange(pendingActivity.sid);
    }
  });
}
