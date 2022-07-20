const { isString, isObject } = require("lodash");

const retryHandler = (require(Runtime.getFunctions()['functions/common/twilio-wrappers/retry-handler'].path)).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conferenceSid the conference we will be updating
 * @param {string} parameters.participantSid the participant that will be barging/coaching
 * @param {string} parameters.agentSid the worker we will be coaching
 * @param {string} parameters.muted the muted status
 * @param {string} parameters.coaching the coaching status
 * @returns {any}
 * @description the following method is used to modify a participant
 *      within the defined conference
 */
exports.coachToggle = async function coachToggle(parameters) {

  const {context, conferenceSid, participantSid, agentSid, muted, coaching} = parameters;

  if(!isObject(context))
      throw "Invalid parameters object passed. Parameters must contain reason context object";
  if(!isString(conferenceSid))
      throw "Invalid parameters object passed. Parameters must contain conferenceSid string";
  if(!isString(participantSid))
      throw "Invalid parameters object passed. Parameters must contain participantSid string";
  if(!isString(agentSid))
      throw "Invalid parameters object passed. Parameters must contain agentSid string";
  if(!isString(muted))
      throw "Invalid parameters object passed. Parameters must contain muted boolean";
  if(!isString(coaching))
      throw "Invalid parameters object passed. Parameters must contain coaching boolean";
  
  try {  
    const client = context.getTwilioClient();

    const updatedConference = await client.conferences(conferenceSid)
        .participants(participantSid)
        .update(
            { 
                coaching: coaching,
                callSidToCoach: agentSid,
                muted: muted
            }
        )
    return { success: true, status: 200, updatedConference };
  }
  catch (error) {
    return retryHandler(
        error, 
        parameters,
        arguments.callee
    )
  }
}

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conferenceSid the conference we will be updating
 * @param {string} parameters.participantSid the participant that will be barging/coaching
 * @param {boolean} parameters.muted the muted status
 * @returns {any}
 * @description the following method is used to modify a participant
 *      within the defined conference
 */
exports.bargeToggle = async function bargeToggle(parameters) {

  const {context, conferenceSid, participantSid, muted} = parameters;

    
  if(!isObject(context))
      throw "Invalid parameters object passed. Parameters must contain reason context object";
  if(!isString(conferenceSid))
      throw "Invalid parameters object passed. Parameters must contain conferenceSid string";
  if(!isString(participantSid))
      throw "Invalid parameters object passed. Parameters must contain participantSid string";
  if(!isString(muted))
      throw "Invalid parameters object passed. Parameters must contain muted boolean";
  
  try {  
    const client = context.getTwilioClient();

    const updatedConference = await client.conferences(conferenceSid)
        .participants(participantSid)
        .update(
            { 
                muted: muted
            }
        )
    return { success: true, status: 200, updatedConference };
  }
  catch (error) {
    return retryHandler(
        error, 
        parameters,
        arguments.callee
    )
  }
}
