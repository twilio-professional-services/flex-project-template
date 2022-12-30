import * as Flex from '@twilio/flex-ui';
import WorkerProfileInfo from '../../custom-components/worker-profile-info/';
import { isFilterTeamsViewEnabled, getRules } from '../..';

export function replaceWorkerProfileInfo(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!isFilterTeamsViewEnabled() || !getRules()) return;
  
  flex.WorkerProfile.Content.remove('info');
  flex.WorkerProfile.Content.add(
    <WorkerProfileInfo key="worker-profile-info" />,
    {
      align: 'start',
      sortOrder: 2
    }
  );
}
