import React, { useEffect, useState } from 'react';
import { styled, ConferenceParticipant, ITask, templates } from '@twilio/flex-ui';

import ConferenceService from '../../utils/ConferenceService';
import { FetchedCall } from '../../../../types/serverless/twilio-api';
import { StringTemplates } from '../../flex-hooks/strings/Conference';

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
  listMode?: boolean;
  participant?: ConferenceParticipant;
  task?: ITask;
}

const ParticipantName = (props: OwnProps) => {
  const unknown = templates[StringTemplates.Unknown]();
  const [name, setName] = useState(unknown);

  useEffect(() => {
    const { participant, task } = props;

    if (!participant || !task) return;

    if (participant.participantType === 'customer') {
      setName(task.attributes.outbound_to || task.attributes.name || task.attributes.from);
      return;
    }

    if (participant.callSid && participant.participantType === 'unknown') {
      ConferenceService.getCallProperties(participant.callSid)
        .then((response: FetchedCall) => {
          if (response) {
            setName(response.to || unknown);
          }
        })
        .catch((_error) => {
          setName(unknown);
        });
    } else {
      setName(participant.worker ? participant.worker.fullName : unknown);
    }
  }, []);

  return props.listMode === true ? (
    <NameListItem className="ParticipantCanvas-Name">{name}</NameListItem>
  ) : (
    <Name className="ParticipantCanvas-Name">{name}</Name>
  );
};

export default ParticipantName;
