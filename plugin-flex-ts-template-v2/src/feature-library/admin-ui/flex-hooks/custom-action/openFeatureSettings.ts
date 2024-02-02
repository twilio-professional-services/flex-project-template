import { Actions } from '@twilio/flex-ui';

export const registerOpenFeatureSettingsAction = () => {
  Actions.registerAction('OpenFeatureSettings', async () => {
    // Do nothing! The FeatureModal component adds a listener to afterOpenFeatureSettings to handle the payload.
  });
};
