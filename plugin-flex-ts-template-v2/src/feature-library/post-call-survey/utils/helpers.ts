import { Manager } from '@twilio/flex-ui';

import { isFeatureEnabled } from '../config';

export const canShowAdminUi = (manager: Manager) => {
  const { roles } = manager.user;
  return isFeatureEnabled() === true && roles.indexOf('admin') >= 0;
};
