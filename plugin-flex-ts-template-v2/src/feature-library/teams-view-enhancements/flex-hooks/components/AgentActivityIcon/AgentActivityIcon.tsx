import { Icon } from '@twilio/flex-ui';
import * as React from 'react';
import { Tooltip } from '@twilio-paste/core/tooltip';

import { AgentActivity, Heading } from './AgentActivityIcon.Components';

interface ActivityConfig {
  color: string;
  icon: string;
}
interface AgentActivityConfiguration {
  activities: {
    [key: string]: ActivityConfig;
  };
  other: ActivityConfig;
}
interface ComponentProps {
  activityName: string;
  activityConfig: AgentActivityConfiguration;
}

const AgentActivityIcon = (props: ComponentProps) => {
  const { activityName, activityConfig } = props;

  return (
    <AgentActivity bgColor={activityConfig.activities[activityName]?.color}>
      <Tooltip text={activityName} placement="top">
        <Heading>
          <Icon icon={activityConfig.activities[activityName]?.icon} />
        </Heading>
      </Tooltip>
    </AgentActivity>
  );
};

export default AgentActivityIcon;
