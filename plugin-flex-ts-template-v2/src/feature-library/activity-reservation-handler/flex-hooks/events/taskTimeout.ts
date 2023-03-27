import * as Flex from '@twilio/flex-ui';

import taskEndedHandler from '../../helpers/taskEndedHandler';
import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.taskTimeout;
export const eventHook = (_flex: typeof Flex, _manager: Flex.Manager, task: Flex.ITask) => {
  taskEndedHandler(task, eventName);
};
