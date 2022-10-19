import * as Flex from '@twilio/flex-ui';
import { ITask, TaskHelper, StateHelper } from "@twilio/flex-ui";
import { isColdTransferEnabled, isMultiParticipantEnabled } from '../../index'
import TransferButton from "../../custom-components/TransferButton"
import LeaveChatButton from "../../custom-components/LeaveChatButton"

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

export function replaceEndTaskButton(flex: typeof Flex) {
    if (!isMultiParticipantEnabled()) return;

    const replaceEndTaskButton = (task: ITask) => {
        if (TaskHelper.isCBMTask(task) &&
            task.taskStatus === 'assigned')
        {
            // more than two participants or invites sent?
            const conversationState = StateHelper.getConversationStateForTask(task);
            if (conversationState) {
                if (conversationState.participants.size > 2 ||
                    Object.keys(conversationState.source?.attributes?.invites || {}).length)
                return true;
            }
        }       
        return false;
    }
  
    flex.TaskCanvasHeader.Content.add(
        <LeaveChatButton key='leave-chat' />,
        { if: ({ task }) => replaceEndTaskButton(task) }
    )

    flex.TaskCanvasHeader.Content.remove("actions",
        { if: ({ task }) => replaceEndTaskButton(task) }
    )
}
