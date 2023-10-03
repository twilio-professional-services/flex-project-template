import { ITask, Template, templates } from '@twilio/flex-ui';
import { AlertDialog } from '@twilio-paste/core/alert-dialog';
import { Button } from '@twilio-paste/core/button';
import { Box } from '@twilio-paste/core/box';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getOutcome } from '../../config';
import { AppState } from '../../../../types/manager';
import { reduxNamespace } from '../../../../utils/state';
import { Actions } from '../../flex-hooks/states/SupervisorCompleteReservation';
import TaskRouterService from '../../../../utils/serverless/TaskRouter/TaskRouterService';
import { StringTemplates } from '../../flex-hooks/strings';

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
    await TaskRouterService.updateTaskAttributes(
      taskSid,
      {
        conversations: {
          outcome: getOutcome(),
        },
      },
      false,
    );
    dispatch(Actions.updateReservation(taskSid, reservationSid, 'completed'));
  };

  return (
    <Box padding="space20" paddingBottom="space0">
      <Button
        disabled={isTaskProcessingRequest || task.status !== 'wrapping'}
        onClick={handleOpen}
        title={templates[StringTemplates.CompleteTooltip]()}
        variant="destructive"
        size="small"
      >
        <Template source={templates.TaskHeaderComplete} />
      </Button>
      <AlertDialog
        heading={templates[StringTemplates.ConfirmationHeader]()}
        isOpen={isOpen}
        onConfirm={completeReservation}
        onConfirmLabel={templates.ConfirmableDialogConfirmButton()}
        onDismiss={handleClose}
        onDismissLabel={templates.ConfirmableDialogCancelButton()}
      >
        <Template source={templates[StringTemplates.ConfirmationDescription]} />
      </AlertDialog>
    </Box>
  );
};

export default SupervisorCompleteReservation;
