const { prepareFlexFunction, extractStandardResponse } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);
const Configuration = require(Runtime.getFunctions()['common/twilio-wrappers/configuration'].path);

const requiredParameters = [{ key: 'attributesUpdate', purpose: 'ui_attributes to update' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  try {
    const { attributesUpdate, mergeFeature, TokenResult } = event;

    if (TokenResult.roles.indexOf('admin') < 0) {
      response.setStatusCode(403);
      response.setBody('Not authorized');
      return callback(null, response);
    }

    const result = await Configuration.updateUiAttributes({
      attributesUpdate,
      mergeFeature,
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
