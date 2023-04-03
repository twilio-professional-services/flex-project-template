import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useUID } from '@twilio-paste/core/uid-library';

import { Grid, Column, HelpText } from '@twilio-paste/core';
import { ModalHeading, ModalFooterActions } from '@twilio-paste/core';
import { Box, Button, Label, Input, Separator } from '@twilio-paste/core';
import { Table, THead, Tr, Th, Td, TBody, Stack } from '@twilio-paste/core';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '@twilio-paste/core';

import KeyCommand from './KeyCommand';

import { ShortcutsObject } from '../../types/types';
import { shortcutsConfig } from '../../utils/constants';
import { getCamelCase } from '../../utils/KeyboardShortcutsUtil';
import { getAllActions } from '../../utils/KeyboardShortcutsUtil';
import { writeToLocalStorage } from '../../utils/LocalStorageUtil';
import { getAllShortcuts } from '../../utils/KeyboardShortcutsUtil';
import { getCurrentShortcuts } from '../../utils/KeyboardShortcutsUtil';
import { remapKeyboardShortcutUtil } from '../../utils/KeyboardShortcutsUtil';

interface ModalProps {
  shortcuts: ShortcutsObject[];
  isEditModalOpen: boolean;
  selectedShortcutKey: string;
  selectedActionName: string;
  selectedThrottle?: number;
  isThrottleEnabled: boolean;
  closeModalHandler: () => void;
  setShortcuts: Dispatch<SetStateAction<ShortcutsObject[]>>;
  toasterSuccessNotification: (
    actionName: string,
    oldShortcut: string,
    newShortcut: string
  ) => void;
}

const ModalWindow = ({
  shortcuts,
  isEditModalOpen,
  isThrottleEnabled,
  closeModalHandler,
  selectedShortcutKey,
  selectedActionName,
  selectedThrottle,
  setShortcuts,
  toasterSuccessNotification,
}: ModalProps) => {
  const [throttleValue, setThrottleValue] = useState<string>('');
  const [newShortcut, setNewShortcut] = useState<string>('');
  const [isSaveButtonVisible, setIsSaveButtonVisible] = useState<boolean>(true);
  const [shortcutErrorMessage, setShortcutErrorMessage] = useState<string>('');

  const modalHeadingID = useUID();
  const titleInputID = useUID();

  const saveHandler = (): void => {
    const actionFunction = getCamelCase(selectedActionName);
    const shortcutKeys = getAllShortcuts().map(item => item.key);
    let parsedShortcut =
      typeof newShortcut === 'string' ? newShortcut.toUpperCase() : newShortcut;
    const indexPosition = shortcutKeys.indexOf(parsedShortcut);
    const shortcutObject = {
      action: getAllActions()[actionFunction],
      name: selectedActionName,
      throttle: +throttleValue,
    };

    setShortcutErrorMessage('');
    if (shortcutKeys.indexOf(parsedShortcut) !== -1) {
      setShortcutErrorMessage(
        `A shortcut with key mapping ${parsedShortcut} already exists and it is assigned to the ${
          getAllShortcuts()[indexPosition].actionName
        } action.`
      );
      return;
    }

    if (parsedShortcut === '' && throttleValue) {
      parsedShortcut = selectedShortcutKey;
    }

    remapKeyboardShortcutUtil(
      selectedShortcutKey,
      parsedShortcut,
      shortcutObject
    );

    const updatedShortcuts = shortcuts.map(item => item.key);
    shortcuts[updatedShortcuts.indexOf(selectedShortcutKey)].key =
      parsedShortcut === '' ? selectedShortcutKey : parsedShortcut;
    shortcuts[updatedShortcuts.indexOf(selectedShortcutKey)].throttle =
      +throttleValue;
    setShortcuts(shortcuts);

    closeModalHandler();
    setNewShortcut('');
    setThrottleValue('');
    writeToLocalStorage(shortcutsConfig, getCurrentShortcuts());
    toasterSuccessNotification(
      selectedActionName,
      selectedShortcutKey,
      newShortcut
    );
  };

  useEffect(() => {
    if (newShortcut === '') {
      setIsSaveButtonVisible(false);
    }
    if (newShortcut !== '') {
      setIsSaveButtonVisible(true);
    }
    if (newShortcut === '' && throttleValue) {
      setIsSaveButtonVisible(true);
    }

    if (isNaN(+throttleValue)) {
      setIsSaveButtonVisible(false);
    }
  }, [newShortcut, throttleValue]);

  return (
    <Modal
      ariaLabelledby={modalHeadingID}
      size="default"
      isOpen={isEditModalOpen}
      onDismiss={closeModalHandler}
    >
      <ModalHeader>
        <ModalHeading as="h3" id={modalHeadingID}>
          Modify a keyboard shortcut
        </ModalHeading>
      </ModalHeader>
      <ModalBody>
        <Grid gutter="space50">
          <Column>
            <Box marginBottom="space50">
              <Stack orientation="vertical" spacing="space30">
                <ModalHeading as="h6" id={modalHeadingID}>
                  Current configuration
                </ModalHeading>
                <Table>
                  <THead>
                    <Tr>
                      <Th>Action name</Th>
                      <Th>Current shortcut</Th>
                      {isThrottleEnabled && <Th>Throttle (ms)</Th>}
                    </Tr>
                  </THead>
                  <TBody>
                    <Tr>
                      <Td>{selectedActionName}</Td>
                      <Td>
                        <KeyCommand keyCommand={selectedShortcutKey} />
                      </Td>
                      {isThrottleEnabled && (
                        <Td>
                          {selectedThrottle
                            ? selectedThrottle
                            : 'Not configured'}
                        </Td>
                      )}
                    </Tr>
                  </TBody>
                </Table>
              </Stack>
            </Box>
          </Column>
        </Grid>
        <Separator orientation="horizontal" />
        <Grid gutter="space50" marginTop="space30">
          <Column>
            <Box marginBottom="space50">
              <Stack orientation="vertical" spacing="space30">
                <ModalHeading as="h6" id={modalHeadingID}>
                  New configuration
                </ModalHeading>
                <Stack orientation="horizontal" spacing="space200">
                  <Stack orientation="vertical" spacing="space30">
                    <Label htmlFor="new-shortcut" required>
                      New keyboard shortcut
                    </Label>
                    <Input
                      required
                      onChange={e => setNewShortcut(e.currentTarget.value)}
                      id={titleInputID}
                      type="text"
                      value={newShortcut}
                      maxLength={1}
                      placeholder="Single character"
                    />
                    <HelpText>Enter your new keyboard shortcut</HelpText>
                  </Stack>
                  {isThrottleEnabled && (
                    <Stack orientation="vertical" spacing="space30">
                      <Label htmlFor="throttle">Throttle</Label>
                      <Input
                        id={titleInputID}
                        type="number"
                        onChange={e => setThrottleValue(e.currentTarget.value)}
                        hasError={isNaN(+throttleValue)}
                        placeholder="Number in milliseconds"
                        maxLength={5}
                      />
                      <HelpText>Enter the shortcut throttle</HelpText>
                    </Stack>
                  )}
                  {shortcutErrorMessage !== '' ? (
                    <HelpText variant="error">{shortcutErrorMessage}</HelpText>
                  ) : (
                    ''
                  )}
                </Stack>
              </Stack>
            </Box>
          </Column>
        </Grid>
      </ModalBody>
      <ModalFooter>
        <ModalFooterActions>
          <Button
            variant="secondary"
            onClick={() => {
              setNewShortcut('');
              closeModalHandler();
              setThrottleValue('');
              setShortcutErrorMessage('');
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={saveHandler}
            disabled={!isSaveButtonVisible}
          >
            Save changes
          </Button>
        </ModalFooterActions>
      </ModalFooter>
    </Modal>
  );
};

export default ModalWindow;
