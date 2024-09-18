import * as Flex from '@twilio/flex-ui';

import { initiateRecording } from '../../helpers/dualChannelHelper';
import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.taskAccepted;
export const eventHook = async (flex: typeof Flex, _manager: Flex.Manager, task: Flex.ITask) => {
  initiateRecording(task);
};
