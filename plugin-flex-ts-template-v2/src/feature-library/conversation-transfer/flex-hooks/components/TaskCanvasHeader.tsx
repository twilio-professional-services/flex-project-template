import * as Flex from '@twilio/flex-ui';
import { ITask, TaskHelper } from '@twilio/flex-ui';

import { isColdTransferEnabled, isMultiParticipantEnabled } from '../../config';
import TransferButton from '../../custom-components/TransferButton';
import LeaveChatButton from '../../custom-components/LeaveChatButton';
import { ConversationsHelper } from '../../../../utils/helpers';
import { FlexComponent } from '../../../../types/feature-loader';

interface Props {
  task: ITask;
}

export const componentName = FlexComponent.TaskCanvasHeader;
export const componentHook = function addConvTransferButtons(flex: typeof Flex) {
  if (!isColdTransferEnabled() && !isMultiParticipantEnabled()) return;

  flex.TaskCanvasHeader.Content.add(<TransferButton key="conversation-transfer-button" />, {
    sortOrder: 1,
    if: ({ task }) => TaskHelper.isCBMTask(task) && task.taskStatus === 'assigned',
  });

  if (!isMultiParticipantEnabled()) return;

  const replaceEndTaskButton = (task: ITask) => {
    if (TaskHelper.isCBMTask(task) && task.taskStatus === 'assigned') {
      return ConversationsHelper.allowLeave(task);
    }
    return false;
  };

  flex.TaskCanvasHeader.Content.add(<LeaveChatButton key="leave-chat" />, {
    if: ({ task }: Props) => replaceEndTaskButton(task),
  });

  flex.TaskCanvasHeader.Content.remove('actions', { if: ({ task }: Props) => replaceEndTaskButton(task) });
};
