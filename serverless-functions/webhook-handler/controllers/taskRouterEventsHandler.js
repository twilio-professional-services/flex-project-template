const { readEvents, writeEvents } = require('../utils/eventsStore');

/**
 * Handle TaskRouter events from Twilio
 * Validates required fields and stores events to the events store
 */
const handleTaskRouterEvents = (req, res, next) => {
  try {
    const { TaskAssignmentStatus, TaskSid, TaskChannelUniqueName, TaskQueueName, Timestamp, TaskAttributes } =
      req.body || {};

    const missing = [];
    if (!TaskSid) missing.push('TaskSid');
    if (!TaskAssignmentStatus) missing.push('TaskAssignmentStatus');
    if (!TaskChannelUniqueName) missing.push('TaskChannelUniqueName');
    if (!TaskQueueName) missing.push('TaskQueueName');
    if (!Timestamp) missing.push('Timestamp');
    if (!TaskAttributes) missing.push('TaskAttributes');
    if (missing.length > 0) {
      const err = new Error(`Missing required field(s): ${missing.join(', ')}`);
      err.status = 400;
      return next(err);
    }
    let attributes = JSON.parse(TaskAttributes);
    let customerName = attributes.customerName;
    const event = {
      taskSid: TaskSid,
      taskStatus: TaskAssignmentStatus,
      taskChannel: TaskChannelUniqueName,
      queueName: TaskQueueName,
      timestamp: Timestamp,
      customerName: customerName,
    };

    console.log(JSON.stringify(event));

    const events = [];
    events.push(event);
    writeEvents(events);

    return res.status(204).send();
  } catch (error) {
    const err = new Error(error.message || 'Failed to process event');
    err.status = 500;
    next(err);
  }
};

module.exports = handleTaskRouterEvents;
