import * as React from 'react';
import {
  templates,
  Template,
  styled,
  ConferenceParticipant,
  useFlexSelector
} from '@twilio/flex-ui';
import { AppState } from '../../../../flex-hooks/states';

const Status = styled('div')`
  font-size: 12px;
`;

const StatusListItem = styled('div')`
  font-size: 10px;
`;

export interface OwnProps {
  listMode?: boolean,
  participant?: ConferenceParticipant,
}

const ParticipantStatus = (props: OwnProps) => {
  const { participant } = props;
  const componentViewState = useFlexSelector((state: AppState) => state.flex.view.componentViewStates.customParticipants);
  
  let statusTemplate = templates.CallParticipantStatusLive;
  
  if (participant && participant.onHold) {
    statusTemplate = templates.CallParticipantStatusOnHold;
  }
  if (participant && participant.status === 'recently_left') {
    statusTemplate = templates.CallParticipantStatusLeft;
  }
  if (participant && participant.connecting) {
    statusTemplate = templates.CallParticipantStatusConnecting;
  }
  if (componentViewState && participant && componentViewState[participant.callSid] && componentViewState[participant.callSid].showKickConfirmation) {
    statusTemplate = templates.CallParticipantStatusKickConfirmation;
  }
  
  return props.listMode
  ? (
    <StatusListItem className="ParticipantCanvas-Status">
      <Template source={statusTemplate} />
    </StatusListItem>
  ) : (
    <Status className="ParticipantCanvas-Status">
      <Template source={statusTemplate} />
    </Status>
  );
}

export default ParticipantStatus;
