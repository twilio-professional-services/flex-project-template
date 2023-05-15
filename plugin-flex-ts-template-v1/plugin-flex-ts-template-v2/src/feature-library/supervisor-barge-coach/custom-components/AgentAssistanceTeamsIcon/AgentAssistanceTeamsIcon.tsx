import { Tooltip } from '@twilio-paste/core';
import { ErrorIcon } from '@twilio-paste/icons/esm/ErrorIcon';
import { useSelector } from 'react-redux';

import { reduxNamespace } from '../../../../utils/state';
import { AppState } from '../../../../types/manager';

type AgentAssistanceTeamsIconProps = {
  worker: string;
};

export const AgentAssistanceTeamsIcon = ({ worker }: AgentAssistanceTeamsIconProps) => {
  const { agentAssistanceArray } = useSelector((state: AppState) => state[reduxNamespace].supervisorBargeCoach);

  const agentIndex = agentAssistanceArray?.findIndex((a: any) => a.agentWorkerSID === worker);
  if (agentIndex > -1) {
    return (
      <Tooltip text="Agent Seeking Assistance" placement="left">
        <ErrorIcon decorative={true} title="Asking for Assistance"></ErrorIcon>
      </Tooltip>
    );
  }
  return <></>;
};
