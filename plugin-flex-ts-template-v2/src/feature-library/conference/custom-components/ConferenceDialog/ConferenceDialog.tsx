import React, { useState } from 'react';
import { Actions, Manager, ITask, withTaskContext, useFlexSelector } from '@twilio/flex-ui';
import { useDispatch } from 'react-redux';
import { useUID } from '@twilio-paste/core/uid-library';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { Input } from '@twilio-paste/core/input';
import { HelpText } from '@twilio-paste/core/help-text';
import { Label } from '@twilio-paste/core/label';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';

import ConferenceService from '../../utils/ConferenceService';
import AppState from '../../../../types/manager/AppState';
import { addConnectingParticipant } from '../../flex-hooks/states/ConferenceSlice';
import { isFeatureEnabled } from '../../../hang-up-by/config';
import * as HangUpByHelper from '../../../hang-up-by/helpers/hangUpBy';
import { HangUpBy } from '../../../hang-up-by/enums/hangUpBy';

export interface OwnProps {
  task?: ITask;
}

const ConferenceDialog = (props: OwnProps) => {
  const [conferenceTo, setConferenceTo] = useState('');
  const [hasError, setHasError] = useState(false);

  const componentViewStates = useFlexSelector((state: AppState) => state.flex.view.componentViewStates);
  const phoneNumber = useFlexSelector((state: AppState) => state.flex.worker.attributes.phone);

  const conferenceDialogState = componentViewStates && componentViewStates.ConferenceDialog;
  const isOpen = (conferenceDialogState && conferenceDialogState.isOpen) || false;

  const dispatch = useDispatch();
  const modalHeadingID = useUID();
  const inputRef = React.createRef<HTMLInputElement>();
  const inputID = useUID();

  const closeDialog = () => {
    Actions.invokeAction('SetComponentState', {
      name: 'ConferenceDialog',
      state: { isOpen: false },
    });
    setHasError(false);
  };

  const handleClose = () => {
    closeDialog();
  };

  const handleButtonClose = (e: React.MouseEvent<HTMLElement>) => {
    closeDialog();
    if (e) e.preventDefault();
  };

  const checkInput = (): boolean => {
    if (!conferenceTo) {
      setHasError(true);
      return false;
    } else if (hasError) {
      setHasError(false);
    }
    return true;
  };

  const addConferenceParticipant = async () => {
    const { task } = props;

    if (!task) return;

    let mainConferenceSid = task.attributes.conference ? task.attributes.conference.sid : null;

    if (!mainConferenceSid && task.conference) {
      mainConferenceSid = task.conference.conferenceSid;
    }

    let from;
    if (phoneNumber) {
      from = phoneNumber;
    } else {
      from = Manager.getInstance().serviceConfiguration.outbound_call_flows.default.caller_id;
    }

    // Adding entered number to the conference
    console.log(`Adding ${conferenceTo} to conference`);
    let participantCallSid;
    try {
      participantCallSid = await ConferenceService.addParticipant(mainConferenceSid, from, conferenceTo);
      dispatch(
        addConnectingParticipant({
          callSid: participantCallSid,
          conferenceSid: mainConferenceSid,
          phoneNumber: conferenceTo,
        }),
      );

      // Set Hang Up By if that feature is enabled
      if (isFeatureEnabled()) {
        HangUpByHelper.setHangUpBy(task.sid, HangUpBy.ExternalWarmTransfer);
        await HangUpByHelper.setHangUpByAttribute(
          task.taskSid,
          task.attributes,
          HangUpBy.ExternalWarmTransfer,
          conferenceTo,
        );
      }
    } catch (error) {
      console.error('Error adding conference participant:', error);
    }

    setConferenceTo('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;

    if (key === 'Enter') {
      if (checkInput()) {
        addConferenceParticipant();
        closeDialog();
      }
      e.preventDefault();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setConferenceTo(value);
  };

  const handleDialButton = (e: React.MouseEvent<HTMLElement>) => {
    if (checkInput()) {
      addConferenceParticipant();
      closeDialog();
    }
    e.preventDefault();
  };

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
            hasError={hasError}
          />
          {hasError && <HelpText variant="error">Enter a phone number to add to the conference.</HelpText>}
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
};

export default withTaskContext(ConferenceDialog);
