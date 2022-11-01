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
  font-size: 0.75rem;
  line-height: 1rem;
`;

export interface OwnProps {
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
  if (componentViewState && participant && participant.callSid && componentViewState[participant.callSid] && componentViewState[participant.callSid].showKickConfirmation) {
    statusTemplate = templates.CallParticipantStatusKickConfirmation;
  }
  
  return (
    <Status className="ParticipantCanvas-Status">
      <Template source={statusTemplate} />
    </Status>
  );
}

export default ParticipantStatus;
