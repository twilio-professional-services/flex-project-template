const { isString, omitBy, isNil, merge } = require('lodash');
const axios = require('axios');

const retryHandler = require(Runtime.getFunctions()['common/helpers/retry-handler'].path).retryHandler;

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @returns {object} the current configuration
 * @description fetches current config from flex api
 */
exports.fetchUiAttributes = async function fetchConfiguration(parameters) {
  try {
    const configUrl = 'https://flex-api.twilio.com/v1/Configuration';
    const config = {
      auth: {
        username: process.env.ACCOUNT_SID,
        password: process.env.AUTH_TOKEN,
      },
    };

    const getResponse = await axios.get(configUrl, config);

    return {
      success: true,
      status: 200,
      configuration: getResponse?.data?.ui_attributes,
    };
  } catch (error) {
    return retryHandler(error, parameters, exports.fetchUiAttributes);
  }
};

/**
 * @param {object} parameters the parameters for the function
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {object} parameters.context the context from calling lambda function
 * @param {object} parameters.attributesUpdate the attributes to update
 * @returns {object} https://www.twilio.com/docs/lookup/v2-api#making-a-request
 * @description updates config using flex api
 */
exports.updateUiAttributes = async function updateUiAttributes(parameters) {
  const { attributesUpdate } = parameters;

  if (!isString(attributesUpdate))
    throw new Error('Invalid parameters object passed. Parameters must contain attributesUpdate string');

  try {
    const configUrl = 'https://flex-api.twilio.com/v1/Configuration';
    const config = {
      auth: {
        username: process.env.ACCOUNT_SID,
        password: process.env.AUTH_TOKEN,
      },
    };

    // we need to fetch the config first so that we do not overwrite another setting
    const getResponse = await axios.get(configUrl, config);
    const existingData = getResponse?.data?.ui_attributes;

    // merge the objects
    const updatedAttributes = omitBy(
      merge(
        { account_sid: process.env.ACCOUNT_SID },
        { ui_attributes: existingData },
        { ui_attributes: JSON.parse(attributesUpdate) },
      ),
      isNil,
    );
    const postResponse = await axios.post(configUrl, updatedAttributes, config);

    return {
      success: true,
      status: 200,
      configuration: postResponse?.data?.ui_attributes,
    };
  } catch (error) {
    return retryHandler(error, parameters, exports.updateUiAttributes);
  }
};
