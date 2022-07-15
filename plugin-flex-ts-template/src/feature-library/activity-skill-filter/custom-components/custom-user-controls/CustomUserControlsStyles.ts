import styled from 'react-emotion';
import { ActivityCssConfig } from '../../utils/AgentActivities'

export interface OwnProps {
	activitiesConfig: Array<ActivityCssConfig>
}

export type Props = OwnProps;

export const UserControlsWrapper = styled('div')<OwnProps>`
  ul.Twilio-UserControls-AccountMenu {
	display: flex;
	flex-direction: column;

	& li.Twilio-AccountMenu-Title {
	  order: 1;
	}
	${props => {
	return props.activitiesConfig.map(config => {
	  const { idx, display, order } = config;
	  // NOTE: idx/order are 0 based, and +2 is to skip the first <li> which is the list title
	  return `
		  & li:nth-of-type(${idx + 2}) {
			display: ${display};
			order: ${order + 2};
		  }
		`;
	}).join("");
  }}
	& li:nth-last-child(-n+2) {
	  order: ${props => props.activitiesConfig.length + 1};
	}
  }
`;