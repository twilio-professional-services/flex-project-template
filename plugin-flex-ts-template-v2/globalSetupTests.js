import 'regenerator-runtime/runtime';

module.exports = async () => {
  // NOTE: This is needed to set the TZ in azure build pipeline
  //       BUT, it doesn't work on windows so build.yaml should use a linux image
  //       https://stackoverflow.com/a/56482581
  
  // CAVEAT: Developers using windows need to be in this timezone when running unit tests for date based unit tests to pass
  //         https://github.com/nodejs/node/issues/4230
  process.env.TZ = 'America/New_York';
};