const TokenValidator = require("twilio-flex-token-validator").functionValidator;
const ParameterValidator = require(Runtime.getFunctions()[
  "common/helpers/parameter-validator"
].path);
const ConferenceOperations = require(Runtime.getFunctions()[
  "common/twilio-wrappers/conference-participant"
].path);

exports.handler = TokenValidator(async function participantMuteCoach(
  context,
  event,
  callback
) {
  const scriptName = arguments.callee.name;
  const response = new Twilio.Response();
  const requiredParameters = [
    { key: "conferenceSid", purpose: "conference sid to target for changes" },
    {
      key: "participantSid",
      purpose: "participant sid to target for conference changes",
    },
    { key: "agentSid", purpose: "sid of target worker" },
    {
      key: "muted",
      purpose:
        "boolean to determine the muted status of the participant in the conference",
    },
    {
      key: "coaching",
      purpose:
        "boolean to determine the coaching status of the participant in the conference",
    },
  ];
  const parameterError = ParameterValidator.validate(
    context.PATH,
    event,
    requiredParameters
  );

  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST");
  response.appendHeader("Content-Type", "application/json");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  if (Object.keys(event).length === 0) {
    console.log("Empty event object, likely an OPTIONS request");
    return callback(null, response);
  }

  if (parameterError) {
    response.setStatusCode(400);
    response.setBody({ data: null, message: parameterError });
    callback(null, response);
  } else {
    try {
      const { conferenceSid, participantSid, agentSid, muted, coaching } =
        event;

      // If agentSid isn't null/blank, we know we are updating the conference coaching status
      if (agentSid != "") {
        const result = await ConferenceOperations.coachToggle({
          context,
          conferenceSid,
          participantSid,
          agentSid,
          muted,
          coaching,
          scriptName,
          attempts: 0,
        });
        response.setStatusCode(result.status);
        response.setBody({
          success: result.success,
          conference: result.conferenceSid,
        });
      }
      // If the agentSid is null/blank, we know we are updating the conference muted status
      if (agentSid === "") {
        const result = await ConferenceOperations.bargeToggle({
          context,
          conferenceSid,
          participantSid,
          muted,
          scriptName,
          attempts: 0,
        });
        response.setStatusCode(result.status);
        response.setBody({
          success: result.success,
          conference: result.conferenceSid,
        });
      }
      callback(null, response);
    } catch (error) {
      response.setStatusCode(500);
      response.setBody({ success: false, message: error.message });
      callback(null, response);
    }
  }
});
