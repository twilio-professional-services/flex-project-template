import * as Flex from '@twilio/flex-ui';
import React from 'react';
import { UserControlsWrapper } from './CustomUserControlsStyles'
import AgentActivities from '../../utils/AgentActivities'
import { ContainerProps } from './CustomUserControlsContainer';

type Props = ContainerProps & Flex.MainHeaderChildrenProps;

function CustomUserControlsComponent(props: Props) {
	// NOTE: This will use a "hack" of sorts...
	// Using css it will show/hide and change the order of the activities
	// Mostly because there isn't a way to hook into the native component
	return (
	  <UserControlsWrapper activitiesConfig={AgentActivities.getCSSConfig()}>
		<Flex.UserControls />
	  </UserControlsWrapper>
	);
}

export default CustomUserControlsComponent;