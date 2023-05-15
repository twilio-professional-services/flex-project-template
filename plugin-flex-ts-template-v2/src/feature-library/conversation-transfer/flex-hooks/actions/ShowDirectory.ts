import * as Flex from '@twilio/flex-ui';

import { isColdTransferEnabled, isMultiParticipantEnabled } from '../../config';
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.ShowDirectory;
export const actionHook = function handleConvTransferShowDirectory(flex: typeof Flex, manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, (_payload: any, _abortFunction: any) => {
    let display1 = 'flex';
    let display2 = 'flex';

    const taskSid = manager.store.getState().flex.view.selectedTaskSid;
    if (!taskSid) return;

    const isCbm = Flex.TaskHelper.isCBMTask(Flex.TaskHelper.getTaskByTaskSid(taskSid));

    // Hide buttons for CBM tasks only
    if (isCbm) {
      // if cold xfer is disabled, remove button 2 unless flex warm xfer is disabled, then remove button 1 instead.
      // if multi party is disabled, remove button 1 unless flex warm xfer is disabled
      const isFlexWarmXferEnabled =
        manager.store.getState().flex.featureFlags.features['flex-warm-transfers']?.enabled === true;

      if (isFlexWarmXferEnabled) {
        if (!isMultiParticipantEnabled()) {
          display1 = 'none';
        }
        if (!isColdTransferEnabled()) {
          display2 = 'none';
        }
      } else if (!isColdTransferEnabled()) {
        display1 = 'none';
      }
    }

    manager.updateConfig({
      theme: {
        componentThemeOverrides: {
          WorkerDirectory: {
            Container: {
              '.Twilio-WorkerDirectory-ButtonContainer': {
                '&>:nth-child(1)': {
                  display: display1,
                },
                '&>:nth-child(2)': {
                  display: display2,
                },
              },
            },
          },
        },
      },
    });
  });
};
