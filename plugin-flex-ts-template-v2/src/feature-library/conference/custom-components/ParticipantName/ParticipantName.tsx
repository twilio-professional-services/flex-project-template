import React, { useEffect, useState } from 'react';
import { styled, ConferenceParticipant, ITask } from '@twilio/flex-ui';
import ConferenceService from '../../utils/ConferenceService';
import { FetchedCall } from '../../../../types/serverless/twilio-api';

const Name = styled('div')`
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
  margin-top: 0.75rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NameListItem = styled('div')`
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export interface OwnProps {
  listMode?: boolean,
  participant?: ConferenceParticipant,
  task?: ITask
}

const ParticipantName = (props: OwnProps) => {
  const [name, setName] = useState('Unknown');
  
  useEffect(() => {
    const { participant, task } = props;
    
    if (!participant || !task) return;
    
    if (participant.participantType === 'customer') {
      setName(task.attributes.outbound_to || task.attributes.name || task.attributes.from );
      return;
    }
    
    if (participant.callSid && participant.participantType === 'unknown') {
      ConferenceService.getCallProperties(participant.callSid)
      .then((response: FetchedCall) => {
        if (response) {
          setName((response && response.to) || 'Unknown');
        }
      })
      .catch(_error => {
        setName('Unknown');
      });
    } else {
      setName(participant.worker ? participant.worker.fullName : 'Unknown');
    }
  }, []);
  
  return props.listMode === true
  ? (
    <NameListItem className="ParticipantCanvas-Name">
      {name}
    </NameListItem>
  ) : (
    <Name className="ParticipantCanvas-Name">
      {name}
    </Name>
  );
}

export default ParticipantName;
