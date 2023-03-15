import { Flex, Tooltip } from "@twilio-paste/core";
import { ErrorIcon } from "@twilio-paste/icons/esm/ErrorIcon"
import {useSelector } from 'react-redux';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states'

type AgentAssistanceTeamsIcon = {
  worker: string;
}

export const AgentAssistanceTeamsIcon = ({worker}: AgentAssistanceTeamsIcon) => {

  const {
    agentAssistanceArray, 
  } = useSelector((state: AppState) => state[reduxNamespace].supervisorBargeCoach);

  let agentIndex = agentAssistanceArray?.findIndex((a) => a.agentWorkerSID === worker);
  if(agentIndex > -1) {
    return (
      <>
        <Tooltip text="Agent Seeking Assistance" placement="left">
          <Flex vAlignContent="center">
            <ErrorIcon decorative={true} title="Asking for Assistance"></ErrorIcon>
          </Flex>
         </Tooltip>
      </>
    );
  } else {
    return <></>
  }
}