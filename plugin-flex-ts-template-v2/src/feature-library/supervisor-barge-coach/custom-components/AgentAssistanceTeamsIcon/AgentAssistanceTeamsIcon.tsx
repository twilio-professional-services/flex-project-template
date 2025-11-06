import React, { useState } from 'react';
import { Button } from '@twilio-paste/core/button';
import { AlertDialog } from '@twilio-paste/core/alert-dialog';
import { Tooltip } from '@twilio-paste/core/tooltip';
import { ErrorIcon } from '@twilio-paste/icons/esm/ErrorIcon';
import { useSelector } from 'react-redux';
import { templates, Template, IWorker } from '@twilio/flex-ui';

import { reduxNamespace } from '../../../../utils/state';
import { AppState } from '../../../../types/manager';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';
import { SyncDoc } from '../../utils/sync/Sync';

type AgentAssistanceTeamsIconProps = {
  worker: IWorker;
};

export const AgentAssistanceTeamsIcon = ({ worker }: AgentAssistanceTeamsIconProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { agentAssistanceArray } = useSelector((state: AppState) => state[reduxNamespace].supervisorBargeCoach);

  const agentIndex = agentAssistanceArray?.findIndex((a: any) => a.agentWorkerSID === worker.sid);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleResetAgentAssistance = () => {
    // Updating the Sync Doc to remove the agent from the assistance array
    SyncDoc.initSyncDocAgentAssistance(worker.sid, '', '', '', 'remove');
  };

  if (agentIndex > -1) {
    return (
      <>
        <Tooltip text={templates[StringTemplates.AgentSeekingAssistance]()} placement="left">
          <Button variant="reset" onClick={handleOpen} element="ASSISTANCE_ICON_BUTTON">
            <ErrorIcon decorative />
          </Button>
        </Tooltip>
        <AlertDialog
          heading={templates[StringTemplates.TurnOffAssistance]()}
          isOpen={isOpen}
          onConfirm={handleResetAgentAssistance}
          onConfirmLabel={templates.ConfirmableDialogConfirmButton()}
          onDismiss={handleClose}
          onDismissLabel={templates.ConfirmableDialogCancelButton()}
        >
          <Template
            source={templates[StringTemplates.TurnOffAssistanceConfirmation]}
            agentFN={worker.fullName || worker.name}
          />
        </AlertDialog>
      </>
    );
  }
  return <></>;
};
