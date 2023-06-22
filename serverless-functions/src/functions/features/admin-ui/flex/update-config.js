const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const Configuration = require(Runtime.getFunctions()['common/twilio-wrappers/configuration'].path);

const requiredParameters = [{ key: 'attributesUpdate', purpose: 'ui_attributes to update' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { attributesUpdate } = event;
    const result = await Configuration.updateUiAttributes({
      attributesUpdate,
      context,
    });

    const { configuration } = result;
    response.setStatusCode(result.status);
    response.setBody({ configuration, ...extractStandardResponse(result) });

    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
