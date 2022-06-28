import * as Flex from '@twilio/flex-ui';
import React, { ChangeEvent } from 'react';
import { FormControl, Select, MenuItem, WithStyles } from '@material-ui/core'
import { ContentWrapper, AvatarWrapper, Availability, AgentName, FormControlWrapper, styles } from './WorkerCanvasProfileStyles';
import AgentActivities from '../../utils/AgentActivities';

export interface OwnProps extends WithStyles<typeof styles> {
	worker?: Flex.IWorker
}

export type Props = OwnProps;

function WorkerCanvasProfileComponent(props: Props) {
	
	if (props.worker === undefined) {
	  return null;
	}
	
	let { worker } = props;
	
	function handleChange(event: ChangeEvent<HTMLSelectElement>) {
		Flex.Actions.invokeAction("SetWorkerActivity", { workerSid: worker.sid, activitySid: event.target.value });
	};
	
	const activities = AgentActivities.getEligibleActivites(props.worker);
	const currentActivity = activities.find(activity => activity.name === worker.activityName);
	
	return (
	  <ContentWrapper>
		<AvatarWrapper>
		  <Flex.Avatar
			large
			available={props.worker.isAvailable}
			imageUrl={props.worker.attributes.image_url}
			className={props.classes.avatar} />
		</AvatarWrapper>
		<Availability>
		  <AgentName>
			{props.worker.fullName}
		  </AgentName>
		  <FormControlWrapper>
			<FormControl fullWidth>
			  <Select value={currentActivity?.sid} onChange={handleChange}>
				{activities.map(activity => (
				  <MenuItem key={activity.sid} value={activity.sid}>
					{activity.name}
				  </MenuItem>
				))}
			  </Select>
			</FormControl>
		  </FormControlWrapper>
		</Availability>
	  </ContentWrapper>
	);
}

export default WorkerCanvasProfileComponent;