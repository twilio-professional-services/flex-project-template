import { Icon } from '@twilio/flex-ui';
import { ActivityStatistic } from '@twilio/flex-ui/src/state/QueuesState';
import * as React from 'react';
import { Tooltip } from '@twilio-paste/core/tooltip';

import { ActivityData, Heading } from './QueueActivityStats.Components';

interface ComponentProps {
  activityStats: ActivityStatistic[];
}

const QueueActivityStats = (props: ComponentProps) => {
  const { activityStats } = props;
  let activitySummary = '';
  let total = 0;
  activityStats.forEach((ac: ActivityStatistic) => {
    total += ac.workers;
    if (ac.workers > 0) {
      activitySummary += `${ac.friendly_name}: ${ac.workers} |  `;
    }
  });
  if (total === 0) activitySummary = 'No Agents';
  else activitySummary += `TOTAL: ${total}`;

  return (
    <ActivityData>
      <Tooltip text={activitySummary} placement="left">
        <Heading>
          <Icon icon="Data" />
        </Heading>
      </Tooltip>
    </ActivityData>
  );
};

export default QueueActivityStats;
