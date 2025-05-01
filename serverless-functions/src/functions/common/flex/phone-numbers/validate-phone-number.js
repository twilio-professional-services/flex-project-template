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
      const { data: countriesResponse } = await twilioExecute(context, (client) =>
        client.voice.v1.dialingPermissions.countries.list({ countryCode: lookupResponse.callingCountryCode }),
      );

      if (countriesResponse.length) {
        if (!countriesResponse[0].lowRiskNumbersEnabled) {
          valid = false;
          invalidReason = 'COUNTRY_DISABLED';
        } else if (!countriesResponse[0].highRiskSpecialNumbersEnabled) {
          // Check if this number is considered a high-risk special number
          const { data: highRiskResponse } = await twilioExecute(context, (client) =>
            client.voice.v1.dialingPermissions.countries(countriesResponse[0].isoCode).highriskSpecialPrefixes.list(),
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
        valid = false;
        invalidReason = 'COUNTRY_UNKNOWN';
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
