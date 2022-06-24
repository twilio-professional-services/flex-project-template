import * as Flex from '@twilio/flex-ui';
import React from 'react';
import { UserControlsWrapper } from './CustomUserControlsStyles'
import AgentActivities from '../../utils/AgentActivities'

function CustomUserControlsComponent(props: Flex.MainHeaderChildrenProps) {
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