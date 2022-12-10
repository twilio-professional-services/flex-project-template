import {
  IconButton,
  ITask,
} from '@twilio/flex-ui';
import { AlertDialog } from "@twilio-paste/core";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'
import { Actions } from '../../flex-hooks/states/SupervisorCompleteReservation';


export interface OwnProps {
  task: ITask
}

const SupervisorCompleteReservation = ({task}: OwnProps) => {

  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const { isProcessingRequest } = useSelector((state: AppState) => state[reduxNamespace].supervisorCompleteReservation);

  const { taskSid, sid: reservationSid } = task;
  const isTaskProcessingRequest = isProcessingRequest[taskSid];

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const completeReservation = async () => {
    setIsOpen(false);
    dispatch(Actions.updateReservation(taskSid, reservationSid, "completed"));
 };

  return (
    <div style={{ textAlign: 'center' }}>
      <IconButton
          icon={ 'CloseLarge' }
          disabled={isTaskProcessingRequest  || task.status != "wrapping" }
          onClick={handleOpen}
          title={ "close task" }
          variant="secondary"
          style={{width:'44px',height:'44px'}}
          css=''
        ></IconButton>
        <AlertDialog
          heading="Complete Task Reservation"
          isOpen={isOpen}
          onConfirm={completeReservation}
          onConfirmLabel="Submit"
          onDismiss={handleClose}
          onDismissLabel="Cancel"
        >
          Are you sure you want to force complete this reservation?
        </AlertDialog>
    </div>
  );
}

export default SupervisorCompleteReservation;
