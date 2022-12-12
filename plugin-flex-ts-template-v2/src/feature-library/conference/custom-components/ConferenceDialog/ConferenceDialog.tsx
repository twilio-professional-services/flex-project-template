import React, { useState } from 'react';
import { Actions, Manager, ITask, withTaskContext, useFlexSelector } from '@twilio/flex-ui';
import { useDispatch } from 'react-redux';
import { AppState } from '../../../../flex-hooks/states'
import ConferenceService from '../../utils/ConferenceService';

import {useUID} from '@twilio-paste/core/uid-library';
import {Box} from '@twilio-paste/core/box';
import {Button} from '@twilio-paste/core/button';
import {Input} from '@twilio-paste/core/input';
import {Label} from '@twilio-paste/core/label';
import {Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading} from '@twilio-paste/core/modal';
import { addConnectingParticipant } from '../../flex-hooks/states/ConferenceSlice';

import { isFeatureEnabled } from '../../../hang-up-by';
import * as HangUpByHelper from "../../../hang-up-by/helpers/hangUpBy";
import { HangUpBy } from '../../../hang-up-by/enums/hangUpBy';

export interface OwnProps {
  task?: ITask
}

const ConferenceDialog = (props: OwnProps) => {
  const [conferenceTo, setConferenceTo] = useState('');
  
  const componentViewStates = useFlexSelector((state: AppState) => state.flex.view.componentViewStates);
  const phoneNumber = useFlexSelector((state: AppState) => state.flex.worker.attributes.phone);
  
  const conferenceDialogState = componentViewStates && componentViewStates.ConferenceDialog;
  const isOpen = conferenceDialogState && conferenceDialogState.isOpen;
  
  const dispatch = useDispatch();
  const modalHeadingID = useUID();
  const inputRef = React.createRef<HTMLInputElement>();
  const inputID = useUID();
  
  const handleClose = () => {
    closeDialog();
  }
  
  const handleButtonClose = (e: React.MouseEvent<HTMLElement>) => {
    closeDialog();
    if(e) e.preventDefault();
  }
  
  const closeDialog = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'ConferenceDialog',
      state: { isOpen: false }
    });
  }
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
  
    if (key === 'Enter') {
      addConferenceParticipant();
      closeDialog();
      e.preventDefault();
    }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConferenceTo(value);
  }
  
  const handleDialButton = (e: React.MouseEvent<HTMLElement>) => {
    addConferenceParticipant();
    closeDialog();
    e.preventDefault();
  }
  
  const addConferenceParticipant = async () => {
    const { task } = props;
    
    if (!task) return;
  
    let mainConferenceSid = task.attributes.conference ? task.attributes.conference.sid : null;
    
    if (!mainConferenceSid && task.conference) {
      mainConferenceSid = task.conference.conferenceSid;
    }
  
    let from;
    if (phoneNumber) {
      from = phoneNumber
    } else {
      from = Manager.getInstance().serviceConfiguration.outbound_call_flows.default.caller_id;
    }
  
    // Adding entered number to the conference
    console.log(`Adding ${conferenceTo} to conference`);
    let participantCallSid;
    try {
  
      participantCallSid = await ConferenceService.addParticipant(mainConferenceSid, from, conferenceTo);
      dispatch(addConnectingParticipant({
        callSid: participantCallSid,
        conferenceSid: mainConferenceSid,
        phoneNumber: conferenceTo
      }));
      
      // Set Hang Up By if that feature is enabled
      if (isFeatureEnabled()) {
        HangUpByHelper.setHangUpBy(task.sid, HangUpBy.ExternalWarmTransfer);
        await HangUpByHelper.setHangUpByAttribute(task.taskSid, task.attributes, HangUpBy.ExternalWarmTransfer, conferenceTo);
      }
  
    } catch (error) {
      console.error('Error adding conference participant:', error);
    }
    
    setConferenceTo('');
  }
  
  return (
    <Modal
      ariaLabelledby={modalHeadingID}
      isOpen={isOpen}
      onDismiss={handleClose}
      // set initial focus here
      initialFocusRef={inputRef}
      size="default"
    >
      <ModalHeader>
        <ModalHeading as="h3" id={modalHeadingID}>
          Add Conference Participant
        </ModalHeading>
      </ModalHeader>
      <ModalBody>
        <Box as="form">
          <Label htmlFor={inputID}>Phone Number</Label>
          <Input
            id={inputID}
            value={conferenceTo}
            // assign the target ref here
            ref={inputRef}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            type="text"
          />
        </Box>
      </ModalBody>
      <ModalFooter>
        <ModalFooterActions>
          <Button variant="secondary" onClick={handleButtonClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDialButton}>
            Dial
          </Button>
        </ModalFooterActions>
      </ModalFooter>
    </Modal>
  );
}

export default withTaskContext(ConferenceDialog);
