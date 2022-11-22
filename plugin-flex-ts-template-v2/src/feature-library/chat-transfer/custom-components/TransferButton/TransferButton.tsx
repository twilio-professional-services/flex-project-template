import { useState, useEffect } from 'react'
import { IconButton, ITask, Actions, styled, ConversationState } from "@twilio/flex-ui"
import { countOfOutstandingInvitesForConversation} from "../../helpers/inviteTracker"

const IconContainer = styled.div`
  margin: auto;
  padding-right: 0.8em;
`
interface TransferButtonProps {
    task: ITask
    conversation: ConversationState.ConversationState
}


const TransferButton = ({ task, conversation }: TransferButtonProps) => {
     // All we are doing here is making sure we disable the transfer button after it is clicked
    // There is additional complexity as we only want to disable it for the task they click transfer on
    const [transferForTaskClicked, setTransferForTaskClicked] = useState(false);
    const [outstandingInvitesForConversation, setOutstandingInvitesForConversation]=useState(false)
    const [taskSidsTransfered, setTaskSidsTransfered] = useState<string[]>([]);
    
    // if there is a transfer task event for this chat disable the transfer button
    const handleTransferInitiated = (payload: any) => {
        setTaskSidsTransfered([...taskSidsTransfered, task.sid])
    }

    // only listen for transfer task events when mounted and make sure we clean up the listener
    useEffect(() => {
        Actions.addListener('beforeTransferTask', handleTransferInitiated);
        return () => {
            Actions.removeListener('beforeTransferTask', handleTransferInitiated)
        }
    }, [])

    useEffect(() => {
        if (conversation)
            if (countOfOutstandingInvitesForConversation(conversation) === 0)
                setOutstandingInvitesForConversation(false)
            else 
                setOutstandingInvitesForConversation(true)
        
    }, [conversation])

    // if the selected task changes or we update the list of transferred tasks check if should disable buttons
    useEffect(() => { setTransferForTaskClicked(taskSidsTransfered.includes(task.sid)) },
        [task.sid, taskSidsTransfered])

    const onShowDirectory = () => {
        Actions.invokeAction("ShowDirectory")
    }

    const title = outstandingInvitesForConversation ?
        "Transfer disabled whilst there are outstanding invites" :
        "Transfer Chat";

    return (
        <IconContainer>
            <IconButton
                icon="TransferLarge"
                key="worker-directory-open"
                disabled={transferForTaskClicked || outstandingInvitesForConversation}
                onClick={onShowDirectory}
                variant="secondary"
                title={title}
                css='' />
        </IconContainer>
    )
}

export default TransferButton;