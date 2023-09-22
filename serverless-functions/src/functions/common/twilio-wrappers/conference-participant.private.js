const { isString, isObject, isNumber, isBoolean } = require('lodash');

const retryHandler = require(Runtime.getFunctions()['common/helpers/retry-handler'].path).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conferenceSid the conference we will be updating
 * @param {string} parameters.participantSid the participant that will be barging/coaching
 * @param {string} parameters.agentSid the worker we will be coaching
 * @param {string} parameters.muted the muted status
 * @param {string} parameters.coaching the coaching status
 * @param {number} parameters.attempts the number of retry attempts performed
 * @returns {any}
 * @description the following method is used to modify a participant
 *      within the defined conference
 */
exports.coachToggle = async function coachToggle(parameters) {
  const { context, conferenceSid, participantSid, agentSid, muted, coaching } = parameters;

  if (!isObject(context))
    throw new Error('Invalid parameters object passed. Parameters must contain reason context object');
  if (!isString(conferenceSid))
    throw new Error('Invalid parameters object passed. Parameters must contain conferenceSid string');
  if (!isString(participantSid))
    throw new Error('Invalid parameters object passed. Parameters must contain participantSid string');
  if (!isString(agentSid)) throw new Error('Invalid parameters object passed. Parameters must contain agentSid string');
  if (!isString(muted)) throw new Error('Invalid parameters object passed. Parameters must contain muted boolean');
  if (!isString(coaching))
    throw new Error('Invalid parameters object passed. Parameters must contain coaching boolean');
  try {
    const client = context.getTwilioClient();

    const updatedConference = await client.conferences(conferenceSid).participants(participantSid).update({
      coaching,
      callSidToCoach: agentSid,
      muted,
    });
    return { success: true, updatedConference, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.coachToggle);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conferenceSid the conference we will be updating
 * @param {string} parameters.participantSid the participant that will be barging/coaching
 * @param {boolean} parameters.muted the muted status
 * @param {number} parameters.attempts the number of retry attempts performed
 * @returns {any}
 * @description the following method is used to modify a participant
 *      within the defined conference
 */
exports.bargeToggle = async function bargeToggle(parameters) {
  const { context, conferenceSid, participantSid, muted } = parameters;

  if (!isObject(context))
    throw new Error('Invalid parameters object passed. Parameters must contain reason context object');
  if (!isString(conferenceSid))
    throw new Error('Invalid parameters object passed. Parameters must contain conferenceSid string');
  if (!isString(participantSid))
    throw new Error('Invalid parameters object passed. Parameters must contain participantSid string');
  if (!isString(muted)) throw new Error('Invalid parameters object passed. Parameters must contain muted boolean');
  try {
    const client = context.getTwilioClient();

    const updatedConference = await client.conferences(conferenceSid).participants(participantSid).update({
      muted,
    });
    return { success: true, updatedConference, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.bargeToggle);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.taskSid the unique task SID to modify
 * @param {string} parameters.to the phone number to add to the conference
 * @param {string} parameters.from the caller ID to use when calling the to number
 * @returns {Participant} The newly created conference participant
 * @description adds the specified phone number as a conference participant
 */
exports.addParticipant = async function addParticipant(parameters) {
  const { context, taskSid, to, from } = parameters;

  if (!isObject(context))
    throw new Error('Invalid parameters object passed. Parameters must contain reason context object');
  if (!isString(taskSid)) throw new Error('Invalid parameters object passed. Parameters must contain taskSid string');
  if (!isString(to)) throw new Error('Invalid parameters object passed. Parameters must contain to string');
  if (!isString(from)) throw new Error('Invalid parameters object passed. Parameters must contain from string');

  try {
    const client = context.getTwilioClient();

    const participantsResponse = await client.conferences(taskSid).participants.create({
      to,
      from,
      earlyMedia: true,
      endConferenceOnExit: false,
    });

    return { success: true, participantsResponse, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.addParticipant);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conference the unique conference SID with the participant
 * @param {string} parameters.participant the unique participant SID to modify
 * @param {boolean} parameters.hold whether to hold or unhold the participant
 * @returns {Participant} The newly updated conference participant
 * @description holds or unholds the given conference participant
 */
exports.holdParticipant = async function holdParticipant(parameters) {
  const { context, conference, participant, hold } = parameters;

  if (!isObject(context))
    throw new Error('Invalid parameters object passed. Parameters must contain reason context object');
  if (!isString(conference))
    throw new Error('Invalid parameters object passed. Parameters must contain conference string');
  if (!isString(participant))
    throw new Error('Invalid parameters object passed. Parameters must contain participant string');
  if (!isBoolean(hold)) throw new Error('Invalid parameters object passed. Parameters must contain hold boolean');

  try {
    const client = context.getTwilioClient();

    const participantsResponse = await client.conferences(conference).participants(participant).update({
      hold,
    });

    return { success: true, participantsResponse, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.holdParticipant);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conference the unique conference SID with the participant
 * @param {string} parameters.participant the unique participant SID to remove
 * @returns empty response object
 * @description removes the given conference participant
 */
exports.removeParticipant = async function removeParticipant(parameters) {
  const { context, conference, participant } = parameters;

  if (!isObject(context))
    throw new Error('Invalid parameters object passed. Parameters must contain reason context object');
  if (!isString(conference))
    throw new Error('Invalid parameters object passed. Parameters must contain conference string');
  if (!isString(participant))
    throw new Error('Invalid parameters object passed. Parameters must contain participant string');

  try {
    const client = context.getTwilioClient();

    const participantsResponse = await client.conferences(conference).participants(participant).remove();

    return { success: true, participantsResponse, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.removeParticipant);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conference the unique conference SID with the participant
 * @param {string} parameters.participant the unique participant SID to remove
 * @returns empty response object
 * @description fetch the given conference participant
 */
exports.fetchParticipant = async function fetchParticipant(parameters) {
  const { context, conference, participant } = parameters;

  if (!isObject(context))
    throw new Error('Invalid parameters object passed. Parameters must contain reason context object');
  if (!isString(conference))
    throw new Error('Invalid parameters object passed. Parameters must contain conference string');
  if (!isString(participant))
    throw new Error('Invalid parameters object passed. Parameters must contain participant string');

  try {
    const client = context.getTwilioClient();

    const participantsResponse = await client.conferences(conference).participants(participant).fetch();

    return { success: true, participantsResponse, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.fetchParticipant);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conference the unique conference SID with the participant
 * @param {string} parameters.participant the unique participant SID to modify
 * @param {boolean} parameters.endConferenceOnExit whether to end conference when the participant leaves
 * @returns {Participant} The newly updated conference participant
 * @description sets endConferenceOnExit on the given conference participant
 */
exports.updateParticipant = async function updateParticipant(parameters) {
  const { context, conference, participant, endConferenceOnExit } = parameters;

  if (!isObject(context))
    throw new Error('Invalid parameters object passed. Parameters must contain reason context object');
  if (!isString(conference))
    throw new Error('Invalid parameters object passed. Parameters must contain conference string');
  if (!isString(participant))
    throw new Error('Invalid parameters object passed. Parameters must contain participant string');
  if (!isBoolean(endConferenceOnExit))
    throw new Error('Invalid parameters object passed. Parameters must contain endConferenceOnExit boolean');

  try {
    const client = context.getTwilioClient();

    const participantsResponse = await client.conferences(conference).participants(participant).update({
      endConferenceOnExit,
    });

    return { success: true, participantsResponse, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.updateParticipant);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.taskSid the task SID to fetch conferences for
 * @param {string} parameters.status the status of conference(s) to fetch
 * @param {number} parameters.limit the maximum number of conferences to retrieve
 * @returns {Conference[]} The fetched conference(s)
 * @description fetches conferences matching the given task SID and status
 */
exports.fetchByTask = async function fetchByTask(parameters) {
  const { context, taskSid, status, limit } = parameters;

  if (!isObject(context))
    throw new Error('Invalid parameters object passed. Parameters must contain reason context object');
  if (!isString(taskSid)) throw new Error('Invalid parameters object passed. Parameters must contain taskSid string');
  if (!isString(status)) throw new Error('Invalid parameters object passed. Parameters must contain status string');
  if (!isNumber(limit)) throw new Error('Invalid parameters object passed. Parameters must contain limit number');

  try {
    const client = context.getTwilioClient();

    const conferences = await client.conferences.list({
      friendlyName: taskSid,
      status,
      limit,
    });

    return { success: true, conferences, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.fetchByTask);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conference the unique conference SID with the participant
 * @param {object} parameters.updateParams parameters to update on the participant
 * @returns {Conference} The newly updated conference
 * @description updates the given conference
 */
exports.updateConference = async function updateConference(parameters) {
  const { context, conference, updateParams } = parameters;

  if (!isObject(context))
    throw new Error('Invalid parameters object passed. Parameters must contain reason context object');
  if (!isString(conference))
    throw new Error('Invalid parameters object passed. Parameters must contain conference string');
  if (!isObject(updateParams))
    throw new Error('Invalid parameters object passed. Parameters must contain updateParams object');

  try {
    const client = context.getTwilioClient();

    const conferencesResponse = await client.conferences(conference).update(updateParams);

    return { success: true, conferencesResponse, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.updateConference);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conference the unique conference SID with the participant
 * @param {string} parameters.participant the unique participant SID to modify
 * @param {boolean} parameters.muted whether to mute the passed participant
 * @returns {Participant} The newly updated conference participant
 * @description sets endConferenceOnExit on the given conference participant
 */
exports.muteParticipant = async function updateParticipant(parameters) {
  const { context, conference, participant, muted } = parameters;

  if (!isObject(context))
    throw new Error('Invalid parameters object passed. Parameters must contain reason context object');
  if (!isString(conference))
    throw new Error('Invalid parameters object passed. Parameters must contain conference string');
  if (!isString(participant))
    throw new Error('Invalid parameters object passed. Parameters must contain participant string');
  if (!isBoolean(muted)) throw new Error('Invalid parameters object passed. Parameters must contain muted boolean');

  try {
    const client = context.getTwilioClient();

    const participantsResponse = await client.conferences(conference).participants(participant).update({
      muted,
    });

    return { success: true, participantsResponse, status: 200 };
  } catch (error) {
    return retryHandler(error, parameters, exports.updateParticipant);
  }
};
