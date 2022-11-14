import React, { ChangeEvent } from 'react';
import * as Flex from '@twilio/flex-ui';
import AgentActivities from '../../utils/AgentActivities';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import { FormControlWrapper } from './NoTasksCanvasAvailabilityStyles';
import { NoTasksCanvasChildrenProps } from '@twilio/flex-ui/src/components/canvas/NoTaskCanvas/NoTasksCanvas';

function NoTasksCanvasAvailabilityComponent(props: NoTasksCanvasChildrenProps) {
	let { worker } = props;
	
	if (!worker) return null;
	
	const activities = AgentActivities.getEligibleActivites(worker.worker);
	
	function handleChange(event: ChangeEvent<HTMLSelectElement>) {
		Flex.Actions.invokeAction("SetActivity", { activitySid: event.target.value });
	};
	
	return (
		<FormControlWrapper>
			<FormControl fullWidth>
				<Select value={worker.activity.sid} onChange={handleChange} renderValue={() => <>{worker?.activity.name}</>}>
					{activities.map(activity => (
						<MenuItem key={activity.sid} value={activity.sid}>
							{activity.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</FormControlWrapper>
	);
}

export default NoTasksCanvasAvailabilityComponent;