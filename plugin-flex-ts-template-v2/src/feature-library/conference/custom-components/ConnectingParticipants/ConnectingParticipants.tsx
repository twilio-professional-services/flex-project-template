import React, { useEffect, useState } from 'react'
import * as Flex from '@twilio/flex-ui';
import { ConferenceState } from '@twilio/flex-ui/src/state/Conferences';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, reduxNamespace } from '../../../../flex-hooks/states';
import { removeConnectingParticipant } from '../../flex-hooks/states/ConferenceSlice';
import ConferenceService from '../../../../utils/serverless/ConferenceService/ConferenceService';
import { FetchedCall } from '../../../../types/serverless/twilio-api';

export interface OwnProps {
  conference?: ConferenceState;
  task?: Flex.ITask;
}

const ConnectingParticipants = (props: OwnProps) => {
  const [clock, setClock] = useState(true);
  
  const dispatch = useDispatch();
  const { connectingParticipants } = useSelector((state: AppState) => state[reduxNamespace].conference);
  
  useEffect(() => {
    // set up interval for cleaning up disconnected participants
    const interval = setInterval(() => {
      setClock(clock => !clock);
    }, 1000);

    return () => clearInterval(interval);
  }, [])
  
  useEffect(() => {
    for (let i = 0; i < connectingParticipants.length; i++) {
      const participant = connectingParticipants[i];
      
      if (participant.conferenceSid !== props.task?.attributes?.conference?.sid) {
        continue;
      }
      
      // if this call is no longer active, remove it
      ConferenceService.getCallProperties(participant.callSid)
      .then((response: FetchedCall) => {
        if (response && response.status !== 'ringing' && response.status !== 'queued' && response.status !== 'in-progress') {
          dispatch(removeConnectingParticipant(participant.callSid));
        }
      })
      .catch(error => {
        console.log('ConnectingParticipant unable to check call status', error)
      });
    }
  }, [clock])
  
  useEffect(() => {
    for (let i = 0; i < connectingParticipants.length; i++) {
      const participant = connectingParticipants[i];
      const connected = props.conference?.source.participants.filter((p) => p.callSid === participant.callSid);
      
      // remove connecting participant once connected
      if (connected && connected.length > 0) {
        dispatch(removeConnectingParticipant(participant.callSid));
        
        // break here; if there were multiple to remove the state change will trigger us again
        break;
      }
    }
  }, [props.conference, connectingParticipants]);
  
  return (
    <>
    { connectingParticipants.filter((p) => p.conferenceSid === props.task?.attributes?.conference?.sid).map((p) => {
        const fakeParticipant = {
          participantType: 'external',
          phoneNumber: p.phoneNumber,
          connecting: true,
          callSid: p.callSid
        } as Flex.ConferenceParticipant;
        
        return (<Flex.ParticipantCanvas participant={fakeParticipant} participantWidth={100} conference={props.conference} task={props.task} />)
      }
    )}
    </>
  )
}

export default ConnectingParticipants;