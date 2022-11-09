const shell = require("shelljs");
const prompt = require('prompt');
const { getEnvironmentVariables, printEnvironmentSummary } = require('./common');

var context = getEnvironmentVariables();
printEnvironmentSummary(context)

