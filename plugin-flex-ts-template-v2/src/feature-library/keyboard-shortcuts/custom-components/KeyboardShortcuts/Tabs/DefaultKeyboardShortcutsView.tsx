import { useState, useEffect } from 'react';
import { Table, THead, Tr, Th, Td, TBody } from '@twilio-paste/core/table';
import { Box } from '@twilio-paste/core/box';
import { Card } from '@twilio-paste/core/card';
import { Heading } from '@twilio-paste/core/heading';
import { Paragraph } from '@twilio-paste/core/paragraph';
import { Stack } from '@twilio-paste/core/stack';
import { Text } from '@twilio-paste/core/text';
import { Tooltip } from '@twilio-paste/core/tooltip';
import { Template, templates } from '@twilio/flex-ui';
import { InformationIcon } from '@twilio-paste/icons/esm/InformationIcon';
import { WarningIcon } from '@twilio-paste/icons/esm/WarningIcon';

import { StringTemplates } from '../../../flex-hooks/strings';
import KeyCommand from '../KeyCommand';
import EditButton from '../EditButton';
import DeleteButton from '../DeleteButton';
import ModalWindow from '../ModalWindow';
import { ShortcutsObject } from '../../../types/types';
import { getDefaultShortcuts } from '../../../utils/KeyboardShortcutsUtil';

interface DefaultKeyboardShortcutsViewProps {
  reset: boolean;
  disableShortcuts: boolean;
  isThrottleEnabled: boolean;
  isDeleteShortcutsEnabled: boolean;
  toasterDeleteNotification: (actionName: string) => void;
  toasterSuccessNotification: (actionName: string, oldShortcut: string, newShortcut: string) => void;
}

const DefaultKeyboardShortcutsView = ({
  reset,
  disableShortcuts,
  isThrottleEnabled,
  isDeleteShortcutsEnabled,
  toasterDeleteNotification,
  toasterSuccessNotification,
}: DefaultKeyboardShortcutsViewProps) => {
  const [defaultShortcuts, setDefaultShortcuts] = useState<ShortcutsObject[]>([]);
  const [shortcutsDeleted, setShortcutsDeleted] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedShortcutKey, setSelectedShortcutKey] = useState<string>('');
  const [selectedActionName, setSelectedActionName] = useState<string>('');
  const [selectedThrottle, setSelectedThrottle] = useState<number | undefined>(0);

  const openModalHandler = (shortcut: string, actionName: string, throttle?: number): void => {
    setIsEditModalOpen(true);
    setSelectedThrottle(throttle);
    setSelectedShortcutKey(shortcut);
    setSelectedActionName(actionName);
  };

  const closeModalHandler = (): void => {
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    setDefaultShortcuts(getDefaultShortcuts());
    setShortcutsDeleted(false);
  }, [reset]);

  useEffect(() => {
    if (Object.keys(getDefaultShortcuts()).length === 0) {
      setShortcutsDeleted(true);
    }
  }, [defaultShortcuts]);

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
            <Template source={templates[StringTemplates.ErrorMsgNoDefaultShortcuts]} />
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
                {defaultShortcuts.map((item) => (
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
                          actionName={item.actionName}
                          throttle={item.throttle}
                          openModalHandler={openModalHandler}
                        />
                        {isDeleteShortcutsEnabled && (
                          <DeleteButton
                            shortcutKey={item.key}
                            actionName={item.actionName}
                            shortcuts={defaultShortcuts}
                            setShortcuts={setDefaultShortcuts}
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
              shortcuts={defaultShortcuts}
              setShortcuts={setDefaultShortcuts}
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

export default DefaultKeyboardShortcutsView;
