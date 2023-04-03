/**
 * @param {string} callingFunctionPath
 * @param {object} parameterObject
 * @param {Array} requiredKeysArray
 * @returns {string}
 * @description Convenience method to validate properties exist on an object
 * requiredKeysArray should be an array of strings or objects,
 *   { key: 'propertyName', purpose: 'describe need' }
 * error handling will fallback to less useful messages
 * if an array of strings is provided instead of the key and purpose objects
 */

exports.validate = (callingFunctionPath, parameterObject, requiredKeysArray) => {
  let errorMessage = '';
  requiredKeysArray.forEach((data) => {
    if (module.exports.isString(data)) {
      // Support "lazy" requiredKeysArray of just ['propertyName']
      if (parameterObject[data] === undefined || parameterObject[data] === null || parameterObject[data].length < 1) {
        errorMessage += `(${callingFunctionPath}) Missing ${data}`;
      }
    } else if (module.exports.isObject(data) && data.key && data.purpose) {
      // Support "useful" requiredKeysArray of [{ key: 'propertyName', purpose: 'I need it' }]
      if (
        parameterObject[data.key] === undefined ||
        parameterObject[data.key] === null ||
        parameterObject[data.key].length < 1
      ) {
        errorMessage += `(${callingFunctionPath}) Missing ${data.key}: ${data.purpose}`;
      }
    } else {
      // No supported way for us to check parameter
      errorMessage += 'Invalid data provided to Parameter Validator function';
    }
  });
  return errorMessage;
};

exports.isBoolean = (data) => {
  let valueToCheck = data;
  if (module.exports.isString(valueToCheck)) {
    valueToCheck = Boolean(data);
  }
  return (
    valueToCheck === true ||
    valueToCheck === false ||
    Object.prototype.toString.call(valueToCheck) === '[object Boolean]'
  );
};

exports.isString = (data) => {
  return typeof data === 'string' || data instanceof String;
};

exports.isObject = (data) => {
  return Object.prototype.toString.call(data) === '[object Object]';
};
