import React, { useEffect, useState } from 'react';
import * as Flex from '@twilio/flex-ui';
import { ConferenceState as FlexConferenceState } from '@twilio/flex-ui/src/state/Conferences';
import { useDispatch, useSelector } from 'react-redux';

import AppState from '../../../../types/manager/AppState';
import { reduxNamespace } from '../../../../utils/state';
import { removeConnectingParticipant, ConferenceState } from '../../flex-hooks/states/ConferenceSlice';
import ConferenceService from '../../utils/ConferenceService';
import { FetchedCall } from '../../../../types/serverless/twilio-api';

export interface OwnProps {
  conference?: FlexConferenceState;
  task?: Flex.ITask;
}

const ConnectingParticipants = (props: OwnProps) => {
  const [clock, setClock] = useState(true);

  const dispatch = useDispatch();
  const { connectingParticipants } = useSelector(
    (state: AppState) => state[reduxNamespace].conference as ConferenceState,
  );

  useEffect(() => {
    // set up interval for cleaning up disconnected participants
    const interval = setInterval(() => {
      setClock((clock) => !clock);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    connectingParticipants
      .filter((p) => p.conferenceSid === props.task?.conference?.conferenceSid)
      .forEach((participant) => {
        // if this call is no longer active, remove it
        ConferenceService.getCallProperties(participant.callSid)
          .then((response: FetchedCall) => {
            if (
              response &&
              response.status !== 'ringing' &&
              response.status !== 'queued' &&
              response.status !== 'in-progress'
            ) {
              dispatch(removeConnectingParticipant(participant.callSid));
            }
          })
          .catch((error) => {
            console.log('ConnectingParticipant unable to check call status', error);
          });
      });
  }, [clock]);

  useEffect(() => {
    connectingParticipants
      .filter((p) => p.conferenceSid === props.task?.conference?.conferenceSid)
      .forEach((participant) => {
        const connected = props.conference?.source.participants.filter((p) => p.callSid === participant.callSid);

        // remove connecting participant once connected
        if (connected && connected.length > 0) {
          dispatch(removeConnectingParticipant(participant.callSid));
        }
      });
  }, [props.conference]);

  return (
    <>
      {connectingParticipants
        .filter((p) => p.conferenceSid === props.task?.conference?.conferenceSid)
        .map((p) => {
          const fakeParticipant = {
            participantType: 'unknown',
            phoneNumber: p.phoneNumber,
            connecting: true,
            callSid: p.callSid,
          } as Flex.ConferenceParticipant;

          return (
            <Flex.ParticipantCanvas
              participant={fakeParticipant}
              participantWidth={100}
              conference={props.conference}
              task={props.task}
            />
          );
        })}
    </>
  );
};

export default ConnectingParticipants;
