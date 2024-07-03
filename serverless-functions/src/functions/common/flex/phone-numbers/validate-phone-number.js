const { prepareFlexFunction, extractStandardResponse, twilioExecute } = require(Runtime.getFunctions()[
  'common/helpers/function-helper'
].path);

const requiredParameters = [{ key: 'phoneNumber', purpose: 'phone number to validate' }];

exports.handler = prepareFlexFunction(requiredParameters, async (context, event, callback, response, handleError) => {
  const { phoneNumber } = event;

  try {
    const result = await twilioExecute(context, (client) => client.lookups.v2.phoneNumbers(phoneNumber).fetch());
    const { data: lookupResponse, status } = result;
    let { valid } = lookupResponse;
    let invalidReason = null;

    if (valid) {
      // Number is valid, check if we are allowed to dial it
      const { data: permissionsResponse } = await twilioExecute(context, (client) =>
        client.voice.v1.dialingPermissions.countries(lookupResponse.countryCode).fetch(),
      );

      if (!permissionsResponse.lowRiskNumbersEnabled) {
        valid = false;
        invalidReason = 'COUNTRY_DISABLED';
      } else if (!permissionsResponse.highRiskSpecialNumbersEnabled) {
        // Check if this number is considered a high-risk special number
        const { data: highRiskResponse } = await twilioExecute(context, (client) =>
          client.voice.v1.dialingPermissions.countries(lookupResponse.countryCode).highriskSpecialPrefixes.list(),
        );
        const normalizedNumber = phoneNumber.replace('+', '');
        const matchedPrefix = highRiskResponse?.filter((item) =>
          normalizedNumber.startsWith(item.prefix.replace('+', '')),
        );

        if (matchedPrefix?.length) {
          valid = false;
          invalidReason = 'HIGH_RISK_SPECIAL_NUMBER_DISABLED';
        }
      }
    } else {
      invalidReason = lookupResponse.validationErrors?.join(', ');
    }

    response.setStatusCode(status);
    response.setBody({ valid, invalidReason, ...extractStandardResponse(result) });
    return callback(null, response);
  } catch (error) {
    return handleError(error);
  }
});
