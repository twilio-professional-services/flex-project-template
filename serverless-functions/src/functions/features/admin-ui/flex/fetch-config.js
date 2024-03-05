const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const Configuration = require(Runtime.getFunctions()['common/twilio-wrappers/configuration'].path);

const requiredParameters = [];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const result = await Configuration.fetchUiAttributes({
      context,
    });

    const { data: configuration } = result;
    response.setStatusCode(result.status);
    response.setBody({ configuration, ...extractStandardResponse(result) });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
