const TaskOperations = require(Runtime.getFunctions()["common/twilio-wrappers/taskrouter"].path);

exports.handler = async function callOutboundJoin(context, event, callback) {
  const client = context.getTwilioClient();
  const { FriendlyName: taskSid, ConferenceSid } = event;

  if (event.StatusCallbackEvent === "participant-join") {
    console.log(
      `callSid ${event.CallSid} joined, task is ${taskSid}, conference is ${event.ConferenceSid}`
    );

    const call = await client.calls(event.CallSid).fetch();

    if (call.to.includes("client")) {
      console.log(`agent ${call.to} joined the conference`);

      const fetchTaskResult = await TaskOperations.fetchTask({
        context,
        taskSid,
        attempts: 0,
      });
      
      const { task } = fetchTaskResult;

      let newAttributes = {
        conference: {
          sid: event.ConferenceSid,
          participants: {
            worker: event.CallSid,
          },
        },
      };

      if (task.attributes.worker_call_sid === newAttributes.conference.participants.worker) {
        const { to, fromName, targetWorker } = task.attributes;
        
        if (to.substring(0, 6) === "client") {
          const createTaskResult = await TaskOperations.createTask({
            context,
            attributes: {
              to: to,
              name: fromName,
              from: targetWorker,
              targetWorker: to,
              autoAnswer: "false",
              conferenceSid: taskSid,
              conference: {
                sid: ConferenceSid,
                friendlyName: taskSid,
              },
              internal: "true",
              client_call: true,
            },
            workflowSid: process.env.TWILIO_FLEX_INTERNAL_CALL_WORKFLOW_SID,
            taskChannel: "voice",
            attempts: 0,
          });
          
          newAttributes.conference.participants.taskSid = createTaskResult.task.sid;
        }
        
        await TaskOperations.updateTaskAttributes({
          context,
          taskSid,
          attributesUpdate: JSON.stringify(newAttributes),
          attempts: 0,
        });
      }
    }
  }

  if (event.StatusCallbackEvent === "conference-end") {
    try {
      const fetchTaskResult = await TaskOperations.fetchTask({
        context,
        taskSid,
        attempts: 0,
      });
      
      const { task } = fetchTaskResult;

      if (["assigned", "pending", "reserved"].includes(task.assignmentStatus)) {
        await TaskOperations.updateTask({
          context,
          taskSid,
          updateParams: {
            assignmentStatus:
              task.assignmentStatus === "assigned" ? "wrapping" : "canceled",
            reason: "conference is complete",
          },
          attempts: 0,
        });
      }
      
      const targetTaskSid = task.attributes.conference?.participants?.taskSid;

      if (targetTaskSid) {
        const fetchTargetTaskResult = await TaskOperations.fetchTask({
          context,
          taskSid: targetTaskSid,
          attempts: 0,
        });
        
        const { task: targetTask } = fetchTargetTaskResult;

        if (["assigned", "pending", "reserved"].includes(targetTask.assignmentStatus)) {
          await TaskOperations.updateTask({
            context,
            taskSid: targetTaskSid,
            updateParams: {
              assignmentStatus:
                targetTask.assignmentStatus === "assigned" ? "wrapping" : "canceled",
              reason: "conference is complete",
            },
            attempts: 0,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  callback(null);
};
