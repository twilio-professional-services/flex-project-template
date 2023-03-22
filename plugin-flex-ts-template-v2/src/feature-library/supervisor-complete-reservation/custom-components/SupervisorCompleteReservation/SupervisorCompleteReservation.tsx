import { ITask } from '@twilio/flex-ui';
import { AlertDialog, Button, Box } from '@twilio-paste/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '../../../../types/manager';
import { reduxNamespace } from '../../../../utils/state';
import { Actions } from '../../flex-hooks/states/SupervisorCompleteReservation';

export interface OwnProps {
  task: ITask;
}

const SupervisorCompleteReservation = ({ task }: OwnProps) => {
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const { isProcessingRequest } = useSelector((state: AppState) => state[reduxNamespace].supervisorCompleteReservation);

  const { taskSid, sid: reservationSid } = task;
  const isTaskProcessingRequest = isProcessingRequest[taskSid];

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const completeReservation = async () => {
    setIsOpen(false);
    dispatch(Actions.updateReservation(taskSid, reservationSid, 'completed'));
  };

  return (
    <Box padding="space20" paddingBottom="space0">
      <Button
        disabled={isTaskProcessingRequest || task.status !== 'wrapping'}
        onClick={handleOpen}
        title={'Remotely complete the task reservation on behalf of the agent'}
        variant="destructive"
        size="small"
      >
        Complete
      </Button>
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
    </Box>
  );
};

export default SupervisorCompleteReservation;
