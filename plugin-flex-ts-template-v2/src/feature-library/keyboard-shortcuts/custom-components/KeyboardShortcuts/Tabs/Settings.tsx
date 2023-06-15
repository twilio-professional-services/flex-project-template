import { Dispatch, SetStateAction, useState, useEffect, useCallback } from 'react';
import { Template, templates } from '@twilio/flex-ui';
import { Button, Heading, Stack, Card, Paragraph, Switch, TabPrimitiveInitialState } from '@twilio-paste/core';
import { useToaster, Toaster } from '@twilio-paste/core/toast';

import { StringTemplates } from '../../../flex-hooks/strings';
import { writeToLocalStorage, readFromLocalStorage } from '../../../utils/LocalStorageUtil';
import { resetKeyboardShortcutsUtil, disableKeyboardShortcutsUtil } from '../../../utils/KeyboardShortcutsUtil';
import { deleteShortcuts, enableThrottling, removeAllShortcuts } from '../../../utils/constants';

interface SettingsProps {
  tabState: TabPrimitiveInitialState;
  setReset: Dispatch<SetStateAction<boolean>>;
  setDisableShortcuts: Dispatch<SetStateAction<boolean>>;
  setIsThrottleEnabled: Dispatch<SetStateAction<boolean>>;
  setIsDeleteShortcutsEnabled: Dispatch<SetStateAction<boolean>>;
}

const Settings = ({
  tabState,
  setReset,
  setDisableShortcuts,
  setIsThrottleEnabled,
  setIsDeleteShortcutsEnabled,
}: SettingsProps) => {
  const [throttlingToggle, setThrottlingToggle] = useState<boolean>(false);
  const [deleteToggle, setDeleteToggle] = useState<boolean>(false);
  const [disableAllSetting, setDisableAllSetting] = useState<boolean>(false);
  const [resetSetting, setResetSetting] = useState<boolean>(false);
  const toaster = useToaster();

  const localDeleteSetting = readFromLocalStorage(deleteShortcuts);
  const localThrottlingSetting = readFromLocalStorage(enableThrottling);
  const localRemoveAllSetting = readFromLocalStorage(removeAllShortcuts);

  const toasterNotification = (setting: string): void => {
    if (setting === 'reset') {
      toaster.push({
        message: templates[StringTemplates.SettingsToastResetNotification](),
        variant: 'success',
        dismissAfter: 4000,
      });
    }
    if (setting === 'remove') {
      toaster.push({
        message: templates[StringTemplates.SettingsToastDisableNotification](),
        variant: 'success',
        dismissAfter: 4000,
      });
    }
  };

  const throttlingHandler = (): void => {
    setThrottlingToggle(!throttlingToggle);
    setIsThrottleEnabled(!throttlingToggle);
    writeToLocalStorage(enableThrottling, readFromLocalStorage(enableThrottling) === 'true' ? 'false' : 'true');
  };

  const deleteShortcutsHandler = (): void => {
    setIsDeleteShortcutsEnabled(!deleteToggle);
    setDeleteToggle(!deleteToggle);
    writeToLocalStorage(deleteShortcuts, readFromLocalStorage(deleteShortcuts) === 'true' ? 'false' : 'true');
  };

  const removeAllShortcutsHandler = (): void => {
    disableKeyboardShortcutsUtil();
    setDisableShortcuts(true);
    setDisableAllSetting(false);
    toasterNotification('remove');
    writeToLocalStorage(removeAllShortcuts, readFromLocalStorage(removeAllShortcuts) === 'true' ? 'false' : 'true');
  };

  const resetShortcutsHandler = (): void => {
    setDeleteToggle(false);
    setIsDeleteShortcutsEnabled(false);

    setThrottlingToggle(false);
    setIsThrottleEnabled(false);

    setDisableShortcuts(false);
    setResetSetting(false);

    setReset(true);

    toasterNotification('reset');
    resetKeyboardShortcutsUtil();
  };

  const setSettingStateFromLocalStorage = useCallback((): void => {
    if (localDeleteSetting === 'true') {
      setDeleteToggle(true);
      setIsDeleteShortcutsEnabled(true);
    }
    if (localThrottlingSetting === 'true') {
      setThrottlingToggle(true);
      setIsThrottleEnabled(true);
    }
    if (localRemoveAllSetting === 'true') {
      setDisableAllSetting(false);
      setDisableShortcuts(true);
      disableKeyboardShortcutsUtil();
    }
  }, [
    localDeleteSetting,
    localThrottlingSetting,
    localRemoveAllSetting,
    setIsDeleteShortcutsEnabled,
    setIsThrottleEnabled,
    setDisableShortcuts,
  ]);

  useEffect(() => {
    setSettingStateFromLocalStorage();
  }, [setSettingStateFromLocalStorage]);

  useEffect(() => {
    setDisableAllSetting(false);
    setResetSetting(false);
  }, [tabState]);

  return (
    <>
      {/* Toaster notifications based on setting actions*/}
      <Toaster {...toaster} />
      <Stack orientation="vertical" spacing="space60">
        <Card>
          <Heading as="h5" variant="heading50">
            <Template source={templates[StringTemplates.SettingsEnableKeyThrottling]} />
          </Heading>
          <Paragraph>
            <Template source={templates[StringTemplates.SettingsEnableKeyThrottlingText]} />
          </Paragraph>
          <Switch value="throttling" checked={throttlingToggle} onChange={throttlingHandler}>
            <Template source={templates[StringTemplates.SettingsEnableKeyThrottling]} />
          </Switch>
        </Card>
        <Card>
          <Heading as="h5" variant="heading50">
            <Template source={templates[StringTemplates.SettingsDeleteIndividualShortcuts]} />
          </Heading>
          <Paragraph>
            <Template source={templates[StringTemplates.SettingsDeleteIndividualShortcutsText]} />
          </Paragraph>
          <Switch value="delete" checked={deleteToggle} onChange={deleteShortcutsHandler}>
            <Template source={templates[StringTemplates.SettingsDeleteIndividualShortcuts]} />
          </Switch>
        </Card>
        <Card>
          <Heading as="h5" variant="heading50">
            <Template source={templates[StringTemplates.SettingsRemoveShortcuts]} />
          </Heading>
          <Paragraph>
            <Template source={templates[StringTemplates.SettingsRemoveShortcutsText]} />
          </Paragraph>
          {/* Once the setting is clicked, display the Save and Cancel buttons */}
          {disableAllSetting ? (
            <Stack orientation="horizontal" spacing="space30">
              <Button variant="secondary" onClick={() => setDisableAllSetting(false)}>
                <Template source={templates.Cancel} />
              </Button>
              <Button variant="destructive" onClick={removeAllShortcutsHandler}>
                <Template source={templates.Save} />
              </Button>
            </Stack>
          ) : (
            <>
              {/* Default button presented to the user  */}
              <Button
                variant="destructive"
                onClick={() => setDisableAllSetting(true)}
                disabled={readFromLocalStorage(removeAllShortcuts) === 'true'}
              >
                <Template source={templates[StringTemplates.SettingsRemoveShortcuts]} />
              </Button>
            </>
          )}
        </Card>
        <Card>
          <Heading as="h5" variant="heading50">
            <Template source={templates[StringTemplates.SettingsResetShortcutsTitle]} />
          </Heading>
          <Paragraph>
            <Template source={templates[StringTemplates.SettingsResetShortcutsText]} />
          </Paragraph>
          {/* Once the setting is clicked, display the Save and Cancel buttons */}
          {resetSetting ? (
            <Stack orientation="horizontal" spacing="space30">
              <Button variant="secondary" onClick={() => setResetSetting(false)}>
                <Template source={templates.Cancel} />
              </Button>
              <Button variant="destructive" onClick={resetShortcutsHandler}>
                <Template source={templates.Save} />
              </Button>
            </Stack>
          ) : (
            <>
              {/* Default button presented to the user  */}
              <Button
                variant="destructive"
                onClick={() => {
                  setResetSetting(true);
                }}
              >
                <Template source={templates[StringTemplates.SettingsResetShortcuts]} />
              </Button>
            </>
          )}
        </Card>
      </Stack>
    </>
  );
};

export default Settings;
