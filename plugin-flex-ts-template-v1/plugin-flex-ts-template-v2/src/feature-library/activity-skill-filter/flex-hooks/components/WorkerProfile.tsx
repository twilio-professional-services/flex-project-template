import * as Flex from '@twilio/flex-ui';

import WorkerProfileInfo from '../../custom-components/worker-profile-info';
import { isFilterTeamsViewEnabled, getRules } from '../../config';
import { FlexComponent } from '../../../../types/feature-loader';

export const componentName = FlexComponent.WorkerProfile;
export const componentHook = function replaceWorkerProfileInfo(flex: typeof Flex, _manager: Flex.Manager) {
  if (!isFilterTeamsViewEnabled() || !getRules()) return;

  flex.WorkerProfile.Content.remove('info');
  flex.WorkerProfile.Content.add(<WorkerProfileInfo key="worker-profile-info" />, {
    align: 'start',
    sortOrder: 2,
  });
};
