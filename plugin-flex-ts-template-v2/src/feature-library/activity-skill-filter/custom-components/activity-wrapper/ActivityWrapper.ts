import { styled } from '@twilio/flex-ui';

import { ActivityCssConfig } from '../../utils/AgentActivities';

export interface OwnProps {
  activitiesConfig: Array<ActivityCssConfig>;
}

export type Props = OwnProps;

const buildActivityCss = (config: ActivityCssConfig) => {
  const { idx, display, order } = config;
  // NOTE: idx/order are 0-based, CSS order and nth-of-type are 1-based
  // Flex UI 2.4.0 changed data-test to data-testid; we support both versions
  return `
    & > div.Twilio-MainHeader > div.Twilio-MainHeader-end > div > div[data-test="activity-menu"],
    & > div.Twilio-MainHeader > div.Twilio-MainHeader-end > div > div[data-testid="activity-menu"] {
      display: flex;
      flex-direction: column;
      > button:nth-of-type(${idx + 1}) {
        display: ${display};
        order: ${order + 1};
      }
    }
  `;
};

const ActivityWrapper = styled('div')<OwnProps>`
  ${(props) => {
    return props.activitiesConfig.map(buildActivityCss).join('');
  }}
`;

export default ActivityWrapper;
