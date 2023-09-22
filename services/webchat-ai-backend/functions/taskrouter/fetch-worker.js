exports.handler = async (context, event, callback) => {
  const { ACCOUNT_SID, AUTH_TOKEN, TASKROUTER_WORKSPACE_SID } = context;
  const client = require("twilio")(ACCOUNT_SID, AUTH_TOKEN);
  const { user_data } = event;
  console.log(user_data);
  const { traits } = JSON.parse(user_data);
  console.log(traits);
  const { email } = traits;

  try {
    const workers = await client.taskrouter.v1
      .workspaces(TASKROUTER_WORKSPACE_SID)
      .workers.list();

    const matchingWorker = workers.find((worker) =>
      email.includes(worker.friendlyName)
    );

    return callback(
      null,
      matchingWorker
        ? matchingWorker.sid
        : { body: `worker ${email} not found` }
    );
  } catch (error) {
    console.error(error);
    callback(null, error);
  }
};
