import { Icon } from '@twilio/flex-ui';
import { ActivityStatistic } from '@twilio/flex-ui/src/state/QueuesState';
import * as React from 'react';
import { Text } from '@twilio-paste/core/text';
import { PopoverContainer, PopoverButton, Popover } from '@twilio-paste/core/popover';

interface ComponentProps {
  activityStats: ActivityStatistic[];
}

const QueueActivityStats = (props: ComponentProps) => {
  const { activityStats } = props;
  let total = 0;
  activityStats.forEach((ac: ActivityStatistic) => {
    total += ac.workers;
  });

  return (
    <PopoverContainer baseId="activity-summary" placement="left">
      <PopoverButton variant="secondary_icon" disabled={total === 0}>
        <Icon icon="Data" />
      </PopoverButton>
      <Popover aria-label="Popover">
        {activityStats.map((ac: ActivityStatistic) => {
          if (ac.workers > 0) return <Text as="p">{`${ac.friendly_name}: ${ac.workers}`}</Text>;
          return <Text as="span" />;
        })}
      </Popover>
    </PopoverContainer>
  );
};

export default QueueActivityStats;
