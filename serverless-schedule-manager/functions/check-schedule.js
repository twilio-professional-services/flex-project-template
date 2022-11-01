const ParameterValidator = require(Runtime.getFunctions()['common/helpers/parameter-validator'].path);
const ScheduleUtils = require(Runtime.getFunctions()['common/helpers/schedule-utils'].path);

exports.handler = async function checkSchedule(context, event, callback) {
  const response = new Twilio.Response();
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET');
  response.appendHeader('Content-Type', 'application/json');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  const requiredParameters = [
    { key: 'name', purpose: 'name of the schedule to check' }
  ];
  const parameterError = ParameterValidator.validate(context.PATH, event, requiredParameters);
  
  if (parameterError) {
    response.setStatusCode(400);
    response.setBody({ parameterError });
    callback(null, response);
    return;
  }
  
  const { name, simulate } = event;
  
  try {
    
    const returnData = ScheduleUtils.evaluateSchedule(name, simulate);
    
    if (returnData.error) {
      const { error, status } = returnData;
      response.setStatusCode(status);
      
      // fail open to be as graceful as possible
      response.setBody({ isOpen: true, closedReason: 'error', error });
      
      callback(null, response);
      return;
    }
    
    console.log(`Schedule ${name} result`, returnData);
    response.setBody(returnData);
    callback(null, response);
  } catch (error) {
    console.log('Error executing function', error);
    response.setStatusCode(500);
    response.setBody({ error });
    callback(null, response);
  }
};
