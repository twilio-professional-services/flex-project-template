import * as Flex from '@twilio/flex-ui';
import { TaskHelper } from "@twilio/flex-ui";
import { isColdTransferEnabled } from '../../index'
import TransferButton from "../../custom-components/TransferButton"

export function addChatTransferButton(flex: typeof Flex) {
    if (!isColdTransferEnabled()) return;
  
    flex.TaskCanvasHeader.Content.add(
        <TransferButton key='conversation-transfer-button' />,
        {
            sortOrder: 1,
            if: ({ task }) =>
                TaskHelper.isCBMTask(task) &&
                task.taskStatus === 'assigned'
        }
    )
}
