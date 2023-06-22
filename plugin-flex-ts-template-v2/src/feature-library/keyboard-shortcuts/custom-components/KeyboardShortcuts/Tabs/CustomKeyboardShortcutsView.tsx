import React, { useEffect, useState } from 'react';
import {
  Heading,
  Paragraph,
  Card,
  Tooltip,
  Text,
  Stack,
  Box,
  Table,
  THead,
  Tr,
  Th,
  Td,
  TBody,
} from '@twilio-paste/core';
import { Template, templates } from '@twilio/flex-ui';
import { WarningIcon } from '@twilio-paste/icons/esm/WarningIcon';
import { InformationIcon } from '@twilio-paste/icons/esm/InformationIcon';

import { StringTemplates } from '../../../flex-hooks/strings';
import EditButton from '../EditButton';
import KeyCommand from '../KeyCommand';
import ModalWindow from '../ModalWindow';
import DeleteButton from '../DeleteButton';
import { ShortcutsObject } from '../../../types/types';
import { getCustomShortcuts } from '../../../utils/KeyboardShortcutsUtil';

interface CustomKeyboardShortcutsViewProps {
  reset: boolean;
  disableShortcuts: boolean;
  isThrottleEnabled: boolean;
  isDeleteShortcutsEnabled: boolean;
  toasterDeleteNotification: (actionName: string) => void;
  toasterSuccessNotification: (actionName: string, oldShortcut: string, newShortcut: string) => void;
}

const CustomKeyboardShortcutsView = ({
  reset,
  disableShortcuts,
  isThrottleEnabled,
  isDeleteShortcutsEnabled,
  toasterDeleteNotification,
  toasterSuccessNotification,
}: CustomKeyboardShortcutsViewProps) => {
  const [customShortcuts, setCustomShortcuts] = useState<ShortcutsObject[]>([]);
  const [shortcutsDeleted, setShortcutsDeleted] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedShortcutKey, setSelectedShortcutKey] = useState<string>('');
  const [selectedActionName, setSelectedActionName] = useState<string>('');
  const [selectedThrottle, setSelectedThrottle] = useState<number | undefined>(0);

  const openModalHandler = (shortcut: string, actionName: string, throttle: number | undefined): void => {
    setIsEditModalOpen(true);
    setSelectedThrottle(throttle);
    setSelectedShortcutKey(shortcut);
    setSelectedActionName(actionName);
  };

  const closeModalHandler = (): void => {
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    setCustomShortcuts(getCustomShortcuts());
    setShortcutsDeleted(false);
  }, [reset]);

  useEffect(() => {
    if (Object.keys(getCustomShortcuts()).length === 0) {
      setShortcutsDeleted(true);
    }
  }, [customShortcuts]);

  return (
    <>
      {/* Check if shortcuts have been disabled or deleted  */}
      {disableShortcuts || shortcutsDeleted ? (
        <Card>
          <Heading as="h5" variant="heading50">
            <Stack orientation="horizontal" spacing="space20">
              <WarningIcon decorative />
              <Template source={templates[StringTemplates.WarningMsg]} />
            </Stack>
          </Heading>
          <Paragraph>
            <Template source={templates[StringTemplates.ErrorMsgNoCustomShortcuts]} />
          </Paragraph>
        </Card>
      ) : (
        <>
          {/* Present a table if there are shortcuts to present */}
          <Box overflowY="auto" maxHeight="1000px">
            <Table>
              <THead>
                <Tr>
                  <Th>
                    <Stack orientation="horizontal" spacing="space30">
                      <Tooltip text={templates[StringTemplates.TooltipMsg]()}>
                        <Stack orientation="horizontal" spacing="space20">
                          <Text as="span">
                            <Template source={templates[StringTemplates.HeaderModifiers]} />
                          </Text>
                          <InformationIcon decorative />
                        </Stack>
                      </Tooltip>
                    </Stack>
                  </Th>
                  <Th>
                    <Text as="span">
                      <Template source={templates[StringTemplates.HeaderShortcuts]} />
                    </Text>
                  </Th>
                  <Th>
                    <Text as="span">
                      <Template source={templates[StringTemplates.HeaderActions]} />
                    </Text>
                  </Th>
                  {isThrottleEnabled && (
                    <Th>
                      <Text as="span">
                        <Template source={templates[StringTemplates.HeaderThrottle]} />
                      </Text>
                    </Th>
                  )}
                  <Th>
                    <Text as="span">
                      <Template source={templates[StringTemplates.HeaderEdit]} />
                    </Text>
                  </Th>
                </Tr>
              </THead>
              <TBody>
                {customShortcuts.map((item) => (
                  <Tr key={item.key}>
                    <Td>
                      <KeyCommand keyCommand="Ctrl" /> + <KeyCommand keyCommand="Shift" />
                    </Td>
                    <Td>
                      <KeyCommand keyCommand={item.key} />
                    </Td>
                    <Td>{item.actionName}</Td>
                    {isThrottleEnabled && (
                      <Td>
                        {item.throttle ? (
                          item.throttle
                        ) : (
                          <Template source={templates[StringTemplates.NotConfiguredMsg]} />
                        )}
                      </Td>
                    )}
                    <Td>
                      <Stack orientation="horizontal" spacing="space30">
                        <EditButton
                          shortcutKey={item.key}
                          throttle={item.throttle}
                          actionName={item.actionName}
                          openModalHandler={openModalHandler}
                        />
                        {isDeleteShortcutsEnabled && (
                          <DeleteButton
                            shortcutKey={item.key}
                            actionName={item.actionName}
                            shortcuts={customShortcuts}
                            setShortcuts={setCustomShortcuts}
                            toasterDeleteNotification={toasterDeleteNotification}
                          />
                        )}
                      </Stack>
                    </Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
            <ModalWindow
              shortcuts={customShortcuts}
              setShortcuts={setCustomShortcuts}
              isEditModalOpen={isEditModalOpen}
              closeModalHandler={closeModalHandler}
              selectedShortcutKey={selectedShortcutKey}
              selectedActionName={selectedActionName}
              selectedThrottle={selectedThrottle}
              toasterSuccessNotification={toasterSuccessNotification}
              isThrottleEnabled={isThrottleEnabled}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default CustomKeyboardShortcutsView;
