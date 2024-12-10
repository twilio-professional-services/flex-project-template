import { Actions } from '@twilio/flex-ui';

export const registerSelectCRMContainerTabAction = () => {
  Actions.registerAction('SelectCRMContainerTab', async () => {
    // Do nothing! The TabbedCRMTask component adds a listener to afterSelectCRMContainerTab to handle the payload.
  });
};
