import React, { useState, useEffect } from 'react'
import {ITask, TaskHelper } from "@twilio/flex-ui"

// at the time of writing the worker directory is not a Flex UI component that is programmable down to the level of customizing existing tabs or tab items
// rather than rewrite the component just to hide the warm transfer/consult button lets remove it using css
// alternatively could display it and popup notificaiton saying only supported for voice tasks
const doCSSHack = () => {
    // // hide the consult transfer icon from the directory - it is the first icon in the container.....
   Array.from(document.getElementsByClassName('Twilio-WorkerDirectory-ButtonContainer'), (element) => {
        if (element?.firstChild) {
            (element.firstChild as HTMLElement).style.display = "none"
        }
   })
}

interface WorkerDirectoryCustomizationProps {
    task: ITask
    isOpen: boolean
}
export const WorkerDirectoryCustomization = ( { task, isOpen } : WorkerDirectoryCustomizationProps | any) =>{
    const [timerId, updateTimerId] = useState<NodeJS.Timeout | null>(null);

    // this supports starting and stopping a timer that runs the above cssHack when a cbm task is selected and directory is open
    useEffect(() => {
        if (!timerId && isOpen && task && TaskHelper.isCBMTask(task))
        { 
            updateTimerId(setTimeout(() => doCSSHack(), 1000))
        }
        else
        {
            if (timerId) {
                clearTimeout(timerId);
                updateTimerId(null)
            }
        }

        return () => {
            if (timerId) { clearTimeout(timerId) }
        }
    }, [task, isOpen]) 
    
    // this is a renderless component and is just here to handle css updates to the sibling tab components 
    return null;
}