import { Actions } from '@twilio/flex-ui';

export const registerLoadCRMContainerTabsAction = () => {
  Actions.registerAction('LoadCRMContainerTabs', async () => {
    // Do nothing! The TabbedCRMTask component adds a listener to afterLoadCRMContainerTabs to handle the payload.
  });
};
