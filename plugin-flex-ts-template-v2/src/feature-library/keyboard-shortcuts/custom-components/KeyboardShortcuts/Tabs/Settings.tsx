import { Dispatch, SetStateAction } from 'react';
import { useState, useEffect, useCallback } from 'react';

import { Button, Heading, Stack } from '@twilio-paste/core';
import { Card, Paragraph, Switch } from '@twilio-paste/core';
import { TabPrimitiveInitialState } from '@twilio-paste/core';
import { useToaster, Toaster } from '@twilio-paste/core/toast';
import { writeToLocalStorage } from '../../../utils/LocalStorageUtil';
import { readFromLocalStorage } from '../../../utils/LocalStorageUtil';
import { resetKeyboardShortcutsUtil } from '../../../utils/KeyboardShortcutsUtil';
import { disableKeyboardShortcutsUtil } from '../../../utils/KeyboardShortcutsUtil';

import { deleteShortcuts } from '../../../utils/constants';
import { enableThrottling } from '../../../utils/constants';
import { removeAllShortcuts } from '../../../utils/constants';
import { deleteSettingExplanation } from '../../../utils/constants';
import { throttleSettingExplanation } from '../../../utils/constants';
import { removeAllSettingExplanation } from '../../../utils/constants';
import { resetShortcutsSettingExplanation } from '../../../utils/constants';

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
        message: `All keyboard shortcuts have been reset to the default values!`,
        variant: 'success',
        dismissAfter: 4000,
      });
    }
    if (setting === 'remove') {
      toaster.push({
        message: `All keyboard shortcuts have been disabled.`,
        variant: 'success',
        dismissAfter: 4000,
      });
    }
  };

  const throttlingHandler = (): void => {
    setThrottlingToggle(!throttlingToggle);
    setIsThrottleEnabled(!throttlingToggle);
    writeToLocalStorage(
      enableThrottling,
      readFromLocalStorage(enableThrottling) === 'true' ? 'false' : 'true'
    );
  };

  const deleteShortcutsHandler = (): void => {
    setIsDeleteShortcutsEnabled(!deleteToggle);
    setDeleteToggle(!deleteToggle);
    writeToLocalStorage(
      deleteShortcuts,
      readFromLocalStorage(deleteShortcuts) === 'true' ? 'false' : 'true'
    );
  };

  const removeAllShortcutsHandler = (): void => {
    disableKeyboardShortcutsUtil();
    setDisableShortcuts(true);
    setDisableAllSetting(false);
    toasterNotification('remove');
    writeToLocalStorage(
      removeAllShortcuts,
      readFromLocalStorage(removeAllShortcuts) === 'true' ? 'false' : 'true'
    );
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
            Enable key throttling
          </Heading>
          <Paragraph>{throttleSettingExplanation}</Paragraph>
          <Switch
            value="throttling"
            checked={throttlingToggle}
            onChange={throttlingHandler}
          >
            Enable key throttling
          </Switch>
        </Card>
        <Card>
          <Heading as="h5" variant="heading50">
            Delete individual shortcuts
          </Heading>
          <Paragraph>{deleteSettingExplanation}</Paragraph>
          <Switch
            value="delete"
            checked={deleteToggle}
            onChange={deleteShortcutsHandler}
          >
            Delete individual shortcuts
          </Switch>
        </Card>
        <Card>
          <Heading as="h5" variant="heading50">
            Remove all shortcuts
          </Heading>
          <Paragraph>{removeAllSettingExplanation}</Paragraph>
          {/* Once the setting is clicked, display the Save and Cancel buttons */}
          {disableAllSetting ? (
            <Stack orientation="horizontal" spacing="space30">
              <Button
                variant="secondary"
                onClick={() => setDisableAllSetting(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={removeAllShortcutsHandler}>
                Save
              </Button>
            </Stack>
          ) : (
            <>
              {/* Default button presented to the user  */}
              <Button
                variant="destructive"
                onClick={() => setDisableAllSetting(true)}
                disabled={
                  readFromLocalStorage(removeAllShortcuts) === 'true'
                    ? true
                    : false
                }
              >
                Remove all shortcuts
              </Button>
            </>
          )}
        </Card>
        <Card>
          <Heading as="h5" variant="heading50">
            Reset keyboard shortcut settings
          </Heading>
          <Paragraph>{resetShortcutsSettingExplanation}</Paragraph>
          {/* Once the setting is clicked, display the Save and Cancel buttons */}
          {resetSetting ? (
            <Stack orientation="horizontal" spacing="space30">
              <Button
                variant="secondary"
                onClick={() => setResetSetting(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={resetShortcutsHandler}>
                Save
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
                Reset keyboard shortcuts
              </Button>
            </>
          )}
        </Card>
      </Stack>
    </>
  );
};

export default Settings;
