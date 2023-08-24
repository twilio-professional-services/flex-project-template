const WorkerUpdates = require(Runtime.getFunctions()['features/tr-events/common/worker-updates'].path);

/* Example Event  
  WorkerActivityName: 'Offline',
  EventType: 'worker.attributes.update',
  ResourceType: 'worker',
  Timestamp: '1692625512',
  WorkerActivitySid: 'WA...',
  AccountSid: 'AC...',
  WorkerName: 'jhunter',
  Sid: 'EV...',
  TimestampMs: '1692625512203',
  WorkerVersion: '23',
  WorkerSid: 'WK...',
  WorkspaceSid: 'WS...',
  WorkspaceName: 'Flex Task Assignment',
  OperatingUnitSid: 'OU...',
  EventDescription: 'Worker <worker-name> updated attributes to {"routing":{"skills":[],"levels":{}},"full_name":"Bugs Bunny","image_url":"https:\\/\\/www.gravatar.com\\/avatar\\/3b4dc5a8fb4a39108c9145a1a2601fff?d=mp","roles":["admin"],"contact_uri":"client:bugsbunny","disabled_skills":{"skills":["english"],"levels":{"english":5}},"email":"bugsbunny@twilio.com"}',
  ResourceSid: 'WK...',
  WorkerAttributes: '{"routing":{"skills":[],"levels":{}},"full_name":"Bugs Bunny","image_url":"https:\\/\\/www.gravatar.com\\/avatar\\/3b4dc5a8fb4a39108c9145a1a2601fff?d=mp","roles":["admin"],"contact_uri":"client:bugsbunny","disabled_skills":{"skills":["english"],"levels":{"english":5}},"email":"bugsbunny@twilio.com"}'
 */

// function when attributes are updated re-evaluates which queues the worker
// is eligible for and updates that specific worker if necessary.
// This in turn will trigger another attributes update so the function only
// updates the attributes if the qualified list of queues does not match
// what is on the worker attributes already
exports.syncWorkerAttributesWithEligibleQueues = async function syncWorkerAttributesWithEligibleQueues(context, event) {
  try {
    const { WorkerSid: workerSid, WorkerAttributes } = event;

    // grab the worker attributes from the event
    // showing the new updated attributes
    workerAttributes = JSON.parse(WorkerAttributes);
    return await WorkerUpdates.syncWorkerAttributesWithEligibleQueues(context, workerSid, workerAttributes);
  } catch (error) {
    console.log(`TR EVENT: Error in workerAttributesUpdated.syncWorkerAttributesWithEligibleQueues: ${error}`);
    return false;
  }
};
