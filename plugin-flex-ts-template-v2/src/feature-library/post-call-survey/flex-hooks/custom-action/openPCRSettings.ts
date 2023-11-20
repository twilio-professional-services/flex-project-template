import { Actions } from '@twilio/flex-ui';

export const registerOpenPCSSettingsAction = () => {
  Actions.registerAction('OpenPCSSettings', async () => {
    // Do nothing! The FeatureModal component adds a listener to afterOpenFeatureSettings to handle the payload.
  });
};
