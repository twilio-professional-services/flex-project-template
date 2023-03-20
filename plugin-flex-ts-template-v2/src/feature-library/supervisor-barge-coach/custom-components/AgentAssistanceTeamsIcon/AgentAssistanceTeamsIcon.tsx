import { Tooltip, Flex } from "@twilio-paste/core";
import { ErrorIcon } from "@twilio-paste/icons/esm/ErrorIcon"
import { useSelector } from 'react-redux';
import { reduxNamespace } from '../../../../utils/state';
import { AppState } from '../../../../types/manager';

type AgentAssistanceTeamsIcon = {
  worker: string;
}

export const AgentAssistanceTeamsIcon = ({worker}: AgentAssistanceTeamsIcon) => {

  const {
    agentAssistanceArray, 
  } = useSelector((state: AppState) => state[reduxNamespace].supervisorBargeCoach);

  let agentIndex = agentAssistanceArray?.findIndex((a: any) => a.agentWorkerSID === worker);
  if(agentIndex > -1) {
    return (
      <Tooltip text="Agent Seeking Assistance" placement="left" >
        <ErrorIcon decorative={true} title="Asking for Assistance"></ErrorIcon>
      </Tooltip>
    );
  } else {
    return <></>
  }
}