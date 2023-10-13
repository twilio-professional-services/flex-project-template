import { useState } from 'react';
import { Template, templates } from '@twilio/flex-ui';
import { useUID } from '@twilio-paste/core/uid-library';
import { useTabState, Tab, Tabs, TabList, TabPanel, TabPanels } from '@twilio-paste/core/tabs';
import { Box } from '@twilio-paste/core/box';
import { Heading } from '@twilio-paste/core/heading';
import { useToaster, Toaster } from '@twilio-paste/core/toast';

import { StringTemplates } from '../../flex-hooks/strings';
import Settings from './Tabs/Settings';
import DefaultKeyboardShortcutsView from './Tabs/DefaultKeyboardShortcutsView';
import CustomKeyboardShortcutsView from './Tabs/CustomKeyboardShortcutsView';

const KeyboardShortcuts = () => {
  const [disableShortcuts, setDisableShortcuts] = useState(false);
  const [isDeleteShortcutsEnabled, setIsDeleteShortcutsEnabled] = useState(false);
  const [isThrottleEnabled, setIsThrottleEnabled] = useState(false);
  const [reset, setReset] = useState(false);
  const randomComponentId = useUID();
  const { ...tabState } = useTabState();
  const toaster = useToaster();

  const toasterSuccessNotification = (actionName: string, oldShortcut: string, newShortcut: string) => {
    const upperCase = newShortcut.toUpperCase();
    toaster.push({
      message: templates[StringTemplates.ToasterSuccessNotification]({ actionName, oldShortcut, upperCase }),
      variant: 'success',
      dismissAfter: 6000,
    });
  };

  const toasterDeleteNotification = (actionName: string) => {
    toaster.push({
      message: templates[StringTemplates.ToasterDeleteNotification]({ actionName }),
      variant: 'success',
      dismissAfter: 4000,
    });
  };

  return (
    <Box overflow="auto" padding="space80" width="100%">
      <Heading as="h1" variant="heading10">
        <Template source={templates[StringTemplates.MainTitle]} />
      </Heading>
      <Tabs selectedId={randomComponentId} baseId="options" orientation="vertical" state={tabState}>
        <TabList aria-label="Vertical product tabs">
          <Tab id={randomComponentId}>
            <Template source={templates[StringTemplates.DefaultTitle]} />
          </Tab>
          <Tab>
            <Template source={templates[StringTemplates.CustomTitle]} />
          </Tab>
          <Tab>
            <Template source={templates[StringTemplates.SettingsTitle]} />
          </Tab>
          <Toaster {...toaster} />
        </TabList>
        <TabPanels>
          <TabPanel>
            <Heading as="h3" variant="heading30">
              <Template source={templates[StringTemplates.DefaultTitle]} />
            </Heading>
            <DefaultKeyboardShortcutsView
              reset={reset}
              disableShortcuts={disableShortcuts}
              isThrottleEnabled={isThrottleEnabled}
              isDeleteShortcutsEnabled={isDeleteShortcutsEnabled}
              toasterDeleteNotification={toasterDeleteNotification}
              toasterSuccessNotification={toasterSuccessNotification}
            />
          </TabPanel>
          <TabPanel>
            <Heading as="h3" variant="heading30">
              <Template source={templates[StringTemplates.CustomTitle]} />
            </Heading>
            <CustomKeyboardShortcutsView
              reset={reset}
              disableShortcuts={disableShortcuts}
              isThrottleEnabled={isThrottleEnabled}
              isDeleteShortcutsEnabled={isDeleteShortcutsEnabled}
              toasterDeleteNotification={toasterDeleteNotification}
              toasterSuccessNotification={toasterSuccessNotification}
            />
          </TabPanel>
          <TabPanel>
            <Heading as="h3" variant="heading30">
              <Template source={templates[StringTemplates.SettingsTitle]} />
            </Heading>
            <Settings
              tabState={tabState}
              setReset={setReset}
              setDisableShortcuts={setDisableShortcuts}
              setIsThrottleEnabled={setIsThrottleEnabled}
              setIsDeleteShortcutsEnabled={setIsDeleteShortcutsEnabled}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default KeyboardShortcuts;
