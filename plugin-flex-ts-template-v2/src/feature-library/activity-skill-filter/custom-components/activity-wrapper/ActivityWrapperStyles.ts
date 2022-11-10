import { styled } from '@twilio/flex-ui';
import { ActivityCssConfig } from '../../utils/AgentActivities';

export interface OwnProps {
  activitiesConfig: Array<ActivityCssConfig>
}

export type Props = OwnProps;

export const ActivityWrapper = styled('div')<OwnProps>`
  display: flex;
  flex-shrink: 0;
  
  & > div > div {
    display: flex;
    flex-direction: column;
  }

  ${(props) => {
    return props.activitiesConfig.map((config) => {
      const { idx, display, order } = config;
      // NOTE: idx/order are 0-based, CSS order and nth-of-type are 1-based
      return `
        & > div > div > button:nth-of-type(${idx + 1}) {
          display: ${display};
          order: ${order + 1};
        }
      `;
    }).join("");
  }}
`;