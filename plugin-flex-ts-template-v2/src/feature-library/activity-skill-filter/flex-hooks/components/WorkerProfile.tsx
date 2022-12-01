import * as Flex from '@twilio/flex-ui';
import WorkerProfileInfo from '../../custom-components/worker-profile-info/'

import { getFeatureFlags } from '../../../../utils/configuration/configuration';

const { enabled, filter_teams_view, rules } = getFeatureFlags().features?.activity_skill_filter || {};

export function replaceWorkerProfileInfo(flex: typeof Flex, manager: Flex.Manager) {
  
  if (!enabled || !filter_teams_view || !rules) return;
  
  flex.WorkerProfile.Content.remove('info');
  flex.WorkerProfile.Content.add(
    <WorkerProfileInfo key="worker-profile-info" />,
    {
      align: 'start',
      sortOrder: 2
    }
  );
}
