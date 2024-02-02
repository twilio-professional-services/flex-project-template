import { Icon } from '@twilio/flex-ui';
import * as React from 'react';
import { Tooltip } from '@twilio-paste/core/tooltip';

import { AgentActivity, Heading } from './AgentActivityIcon.Components';

interface ActivityConfig {
  color: string;
  icon: string;
}

interface ComponentProps {
  activityName: string;
  activityConfig: {
    activities: {
      [key: string]: ActivityConfig;
    };
    other: ActivityConfig;
  };
}

const AgentActivityIcon = (props: ComponentProps) => {
  const { activityName, activityConfig } = props;
  let bgColor = activityConfig.other.color;
  let icon = activityConfig.other.icon;
  if (activityConfig.activities[activityName]) {
    bgColor = activityConfig.activities[activityName]?.color;
    icon = activityConfig.activities[activityName]?.icon;
  }
  return (
    <AgentActivity bgColor={bgColor}>
      <Tooltip text={activityName} placement="top">
        <Heading>
          <Icon icon={icon} sizeMultiplier={1.4} />
        </Heading>
      </Tooltip>
    </AgentActivity>
  );
};

export default AgentActivityIcon;
