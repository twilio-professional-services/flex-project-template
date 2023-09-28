exports.handler = async (context, event, callback) => {
	try {
		const { ACCOUNT_SID, AUTH_TOKEN, TASKROUTER_WORKSPACE_SID } = context;
		const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);

		// https://events-schemas.twilio.com/TaskRouter.WDSEvent/2
		const webhookEvent = event['0'].data

		const payload = webhookEvent.payload;

		const { task_sid: taskSid, task_queue_name: taskQueueName } = payload;

		if (taskQueueName.toLowerCase() === 'Dead Letters'.toLowerCase()) {
			await client.taskrouter.v1.workspaces(TASKROUTER_WORKSPACE_SID)
				.tasks(taskSid)
				.remove();
			console.log(`Deleted dead task: ${taskSid}`);
		}

		return callback(null, true);
	} catch (error) {
		console.error(error);
		callback(null, error);
	}
};
