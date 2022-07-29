const { isString, isObject, isNumber } = require("lodash");

const retryHandler = (require(Runtime.getFunctions()['functions/common/twilio-wrappers/retry-handler'].path)).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {object} parameters.context the context from calling lambda function
 * @param {string} parameters.conferenceSid the conference we will be updating
 * @param {string} parameters.participantSid the participant that will be barging/coaching
 * @param {string} parameters.agentSid the worker we will be coaching
 * @param {string} parameters.muted the muted status
 * @param {string} parameters.coaching the coaching status
 * @param {string} parameters.scriptName the name of the top level lambda function 
 * @param {number} parameters.attempts the number of retry attempts performed
 * @returns {any}
 * @description the following method is used to modify a participant
 *      within the defined conference
 */
exports.coachToggle = async function coachToggle(parameters) {

  const {context, conferenceSid, participantSid, agentSid, muted, coaching, scriptName, attempts} = parameters;

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
  if(!isString(scriptName))
      throw "Invalid parameters object passed. Parameters must contain scriptName of calling function";
  if(!isNumber(attempts))
      throw "Invalid parameters object passed. Parameters must contain the number of attempts";
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
    return { success: true, updatedConference, status: 200 };
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
 * @param {string} parameters.scriptName the name of the top level lambda function 
 * @param {number} parameters.attempts the number of retry attempts performed
 * @returns {any}
 * @description the following method is used to modify a participant
 *      within the defined conference
 */
exports.bargeToggle = async function bargeToggle(parameters) {

  const {context, conferenceSid, participantSid, muted, scriptName, attempts} = parameters;

    
  if(!isObject(context))
      throw "Invalid parameters object passed. Parameters must contain reason context object";
  if(!isString(conferenceSid))
      throw "Invalid parameters object passed. Parameters must contain conferenceSid string";
  if(!isString(participantSid))
      throw "Invalid parameters object passed. Parameters must contain participantSid string";
  if(!isString(muted))
      throw "Invalid parameters object passed. Parameters must contain muted boolean";
  if(!isString(scriptName))
      throw "Invalid parameters object passed. Parameters must contain scriptName of calling function";
  if(!isNumber(attempts))
      throw "Invalid parameters object passed. Parameters must contain the number of attempts";
  try {  
    const client = context.getTwilioClient();

    const updatedConference = await client.conferences(conferenceSid)
        .participants(participantSid)
        .update(
            { 
                muted: muted
            }
        )
    return { success: true, updatedConference, status: 200 };
  }
  catch (error) {
    return retryHandler(
        error, 
        parameters,
        arguments.callee
    )
  }
}
