const { prepareFlexFunction } = require(Runtime.getFunctions()["common/helpers/prepare-function"].path);
const TaskOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/taskrouter"
].path);
const ChatOperations = require(Runtime.getFunctions()[
  "features/chat-transfer/common/chat-operations"
].path);

const requiredParameters = [
  {
    key: "conversationId",
    purpose: "conversation_id to link tasks for reporting",
  },
  {
    key: "jsonAttributes",
    purpose: "JSON calling tasks attributes to perpetuate onto new task",
  },
  {
    key: "transferTargetSid",
    purpose: "sid of target worker or target queue",
  },
  {
    key: "transferQueueName",
    purpose:
      "name of the queue if transfering to a queue, otherwise empty string",
  },
  {
    key: "ignoreWorkerContactUri",
    purpose: "woker Contact Uri to ignore when transfering",
  },
];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const {
      conversationId,
      jsonAttributes,
      transferTargetSid,
      transferQueueName,
      ignoreWorkerContactUri,
      workflowSid: overriddenWorkflowSid,
      timeout: overriddenTimeout,
      priority: overriddenPriority,
    } = event;
    
    // use assigned values or use defaults
    const workflowSid =
      overriddenWorkflowSid ||
      process.env.TWILIO_FLEX_CHAT_TRANSFER_WORKFLOW_SID;
    const timeout = overriddenTimeout || 86400;
    const priority = overriddenPriority || 0;
    
    // setup the new task attributes based on the old
    const originalTaskAttributes = JSON.parse(jsonAttributes);
    const newAttributes = {
      ...originalTaskAttributes,
      ignoreWorkerContactUri,
      transferTargetSid,
      transferQueueName,
      transferTargetType: transferTargetSid.startsWith("WK")
        ? "worker"
        : "queue",
      conversations: {
        ...originalTaskAttributes.conversations,
        conversation_id: conversationId,
      },
    };
    
    // create task for transfer
    const {
      success: createTaskSuccess,
      task: newTask,
      status: createTaskStatus,
    } = await TaskOperations.createTask({
      context,
      workflowSid,
      taskChannel: "chat",
      attributes: newAttributes,
      priority,
      timeout,
      attempts: 0,
    });
    
    // push task data into chat meta data so that should we end the chat while in queue
    // the customer front end can trigger cancelling tasks associated to the chat channel
    // this is not critical to transfer but is ideal
    try {
      if (createTaskSuccess)
        await ChatOperations.addTaskToChannel({
          context,
          taskSid: newTask.sid,
          channelSid: newTask.attributes.channelSid,
          attempts: 0,
        });
    } catch (error) {
      console.error(
        "Error updating chat channel with task sid created for it"
      );
    }
    
    response.setStatusCode(createTaskStatus);
    response.setBody({ success: createTaskSuccess, taskSid: newTask.sid });
    
    callback(null, response);
  } catch (error) {
    handleError(error);
  }
});