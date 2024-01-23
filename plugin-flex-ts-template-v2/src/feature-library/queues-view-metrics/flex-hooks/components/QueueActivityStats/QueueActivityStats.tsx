import { Icon } from '@twilio/flex-ui';
import { ActivityStatistic } from '@twilio/flex-ui/src/state/QueuesState';
import * as React from 'react';
import { Text } from '@twilio-paste/core/text';
import { Heading } from '@twilio-paste/core/heading';
import { Separator } from '@twilio-paste/core/separator';
import { PopoverContainer, PopoverButton, Popover } from '@twilio-paste/core/popover';

interface ComponentProps {
  queueName: string;
  activityStats: ActivityStatistic[];
}

const QueueActivityStats = (props: ComponentProps) => {
  const { queueName, activityStats } = props;
  let total = 0;
  activityStats.forEach((ac: ActivityStatistic) => {
    total += ac.workers;
  });

  return (
    <PopoverContainer baseId="activity-summary">
      <PopoverButton variant="secondary_icon" disabled={total === 0}>
        <Icon icon="Data" />
      </PopoverButton>
      <Popover aria-label="Popover">
        <Heading as="h3" variant="heading30">
          {queueName}
        </Heading>
        <Separator orientation="horizontal" verticalSpacing="space50" />
        {activityStats.map((ac: ActivityStatistic) => {
          if (ac.workers > 0) return <Text as="p">{`${ac.friendly_name}: ${ac.workers}`}</Text>;
          return <Text as="span" />;
        })}
      </Popover>
    </PopoverContainer>
  );
};

export default QueueActivityStats;
