import { Tooltip } from '@twilio-paste/core';
import { ErrorIcon } from '@twilio-paste/icons/esm/ErrorIcon';
import { useSelector } from 'react-redux';
import { templates } from '@twilio/flex-ui';

import { reduxNamespace } from '../../../../utils/state';
import { AppState } from '../../../../types/manager';
import { StringTemplates } from '../../flex-hooks/strings/BargeCoachAssist';

type AgentAssistanceTeamsIconProps = {
  worker: string;
};

export const AgentAssistanceTeamsIcon = ({ worker }: AgentAssistanceTeamsIconProps) => {
  const { agentAssistanceArray } = useSelector((state: AppState) => state[reduxNamespace].supervisorBargeCoach);

  const agentIndex = agentAssistanceArray?.findIndex((a: any) => a.agentWorkerSID === worker);
  if (agentIndex > -1) {
    return (
      <Tooltip text={templates[StringTemplates.AgentSeekingAssistance]()} placement="left">
        <ErrorIcon decorative />
      </Tooltip>
    );
  }
  return <></>;
};
