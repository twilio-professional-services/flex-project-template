import { useState, useEffect } from 'react'
import { IconButton, ITask, Actions, styled} from "@twilio/flex-ui"

const IconContainer = styled.div`
  margin: auto;
  padding-right: 0.8em;
`
interface TransferButtonProps {
    task: ITask
}


const TransferButton = ({ task }: TransferButtonProps) => {
     // All we are doing here is making sure we disable the transfer button after it is clicked
    // There is additional complexity as we only want to disable it for the task they click transfer on
    const [disableTransferButtonForTask, setDisableTransferButtonForTask] = useState(false);
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

    // if the selected task changes or we update the list of transferred tasks check if should disable buttons
    useEffect(() => { setDisableTransferButtonForTask(taskSidsTransfered.includes(task.sid)) },
        [task.sid, taskSidsTransfered])

    const onShowDirectory = () => {
        Actions.invokeAction("ShowDirectory")
    }

    return (
        <IconContainer>
            <IconButton
                icon="TransferLarge"
                key="worker-directory-open"
                disabled={disableTransferButtonForTask}
                onClick={onShowDirectory}
                variant="secondary"
                title="Transfer Chat" />
        </IconContainer>
    )
}

export default TransferButton;