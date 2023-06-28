const { random, isNumber } = require('lodash');

snooze = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @param {object} error the error from the calling function
 * @param {object} parameters the parameters to call the callback with
 * @param {number} parameters.attempts the number of retry attempts performed
 * @param {function} callback the callback function to retry
 * @returns {any}
 * @description the following method is used as a generic retry handler for method
 *   calls to the twilio client where the response code is 412, 429 or 503.
 *   Although there is a maximum runtime for twilio functions
 *   it is beneficial to retry from within the twilio function as the overhead
 *   of the retry is much lower from within the twilio function
 *   (as its in the same data center) than to go all
 *   the way back to the calling client and retry from there.
 *
 *   this is particularly useful if doing a multi transactional
 *   operation from a single twilio function call as it helps minimize
 *   failures here from the occasional 412 or 429 in particular
 *
 *   NOTE: Status codes should still be passed back and
 *   retry handler in the browser are still encouraged.
 */
exports.retryHandler = async (error, parameters, callback) => {
  const { TWILIO_SERVICE_MAX_BACKOFF, TWILIO_SERVICE_MIN_BACKOFF, TWILIO_SERVICE_RETRY_LIMIT, ENABLE_LOCAL_LOGGING } =
    process.env;
  const { context } = parameters;
  const {
    response,
    message: errorMessage,
    status: errorStatus,
    moreInfo: twilioDocPage,
    code: twilioErrorCode,
  } = error;
  const attempts = parameters.attempts ?? 0;
  const status = errorStatus ? errorStatus : response ? response.status : 500;
  const retryAttemptsMessage = attempts === 1 ? `${attempts} retry attempt` : `${attempts} retry attempts`;
  const message = errorMessage ? errorMessage : error;

  // Perform retries only on retry-able response status codes
  // 412: Received upon ETag conflict; retry without delay
  // 429: Rate limited; retry with delay
  // 503: Internal error; retry with delay
  if (
    (status === 412 || status === 429 || status === 503) &&
    isNumber(attempts) &&
    attempts < TWILIO_SERVICE_RETRY_LIMIT
  ) {
    console.warn(
      `retrying ${context.PATH}.${callback.name}() after ${retryAttemptsMessage}, http-status-code: ${status}`,
    );
    if (status === 429 || status === 503) await snooze(random(TWILIO_SERVICE_MIN_BACKOFF, TWILIO_SERVICE_MAX_BACKOFF));

    const updatedAttempts = attempts + 1;
    const updatedParameters = { ...parameters, attempts: updatedAttempts };
    return callback(updatedParameters);
  }

  if (ENABLE_LOCAL_LOGGING) {
    const logMessage = `\n\n${context.PATH}.${callback.name}() failed after ${retryAttemptsMessage},\n http-status-code\t: ${status},\n twilio-error-code\t: ${twilioErrorCode},\n twilio-doc-page\t: ${twilioDocPage},\n error-message\t\t: ${message}`;
    console.error(logMessage);
  }
  return { success: false, message, status, twilioErrorCode, twilioDocPage };
};
