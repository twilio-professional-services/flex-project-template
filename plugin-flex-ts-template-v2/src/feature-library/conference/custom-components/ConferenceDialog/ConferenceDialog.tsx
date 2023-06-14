import React, { useState } from 'react';
import { Actions, ITask, withTaskContext, useFlexSelector, Manager, Template, templates } from '@twilio/flex-ui';
import { useUID } from '@twilio-paste/core/uid-library';
import { Box } from '@twilio-paste/core/box';
import { Button } from '@twilio-paste/core/button';
import { Input } from '@twilio-paste/core/input';
import { HelpText } from '@twilio-paste/core/help-text';
import { Label } from '@twilio-paste/core/label';
import { Modal, ModalBody, ModalFooter, ModalFooterActions, ModalHeader, ModalHeading } from '@twilio-paste/core/modal';

import AppState from '../../../../types/manager/AppState';
import { StringTemplates } from '../../flex-hooks/strings/Conference';

export interface OwnProps {
  task?: ITask;
}

const ConferenceDialog = (props: OwnProps) => {
  const [conferenceTo, setConferenceTo] = useState('');
  const [hasError, setHasError] = useState(false);

  const componentViewStates = useFlexSelector((state: AppState) => state.flex.view.componentViewStates);
  const workerAttrs = useFlexSelector((state: AppState) => state.flex.worker.attributes);

  const conferenceDialogState = componentViewStates && componentViewStates.ConferenceDialog;
  const isOpen = (conferenceDialogState && conferenceDialogState.isOpen) || false;

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
    const defaultFromNumber = Manager.getInstance().serviceConfiguration.outbound_call_flows.default.caller_id;
    const callerId = workerAttrs.phone
      ? workerAttrs.phone
      : workerAttrs.selectedCallerId
      ? workerAttrs.selectedCallerId
      : defaultFromNumber;

    await Actions.invokeAction('StartExternalWarmTransfer', { task: props.task, phoneNumber: conferenceTo, callerId });

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
          <Template source={templates[StringTemplates.AddConferenceParticipant]} />
        </ModalHeading>
      </ModalHeader>
      <ModalBody>
        <Box as="form">
          <Label htmlFor={inputID}>
            <Template source={templates[StringTemplates.PhoneNumber]} />
          </Label>
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
          {hasError && (
            <HelpText variant="error">
              <Template source={templates[StringTemplates.PhoneNumberError]} />
            </HelpText>
          )}
        </Box>
      </ModalBody>
      <ModalFooter>
        <ModalFooterActions>
          <Button variant="secondary" onClick={handleButtonClose}>
            <Template source={templates.Cancel} />
          </Button>
          <Button variant="primary" onClick={handleDialButton}>
            <Template source={templates[StringTemplates.Dial]} />
          </Button>
        </ModalFooterActions>
      </ModalFooter>
    </Modal>
  );
};

export default withTaskContext(ConferenceDialog);
