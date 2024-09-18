import * as Flex from '@twilio/flex-ui';

import ParticipantMonitor from '../../custom-components/ParticipantMonitor';
import { FlexComponent } from '../../../../types/feature-loader';
import { getChannelToRecord } from '../../config';

export const componentName = FlexComponent.TaskCanvasHeader;
export const componentHook = function addParticipantMonitor(flex: typeof Flex) {
  if (getChannelToRecord() !== 'worker') {
    return;
  }
  flex.TaskCanvasHeader.Content.add(<ParticipantMonitor key="participant-monitor" />, {
    if: ({ task }) => Flex.TaskHelper.isCallTask(task) && task?.taskStatus === 'assigned',
  });
};
