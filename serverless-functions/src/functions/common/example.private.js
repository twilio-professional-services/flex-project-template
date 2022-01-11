// example function for modular private methods shared between functions

const ParameterValidator = require(Runtime.getFunctions()['functions/common/parameter-validator'].path);

exports.example = async function (context, event) {
  return true;
}
