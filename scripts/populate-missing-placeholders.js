const { serverlessDir, getEnvironmentVariables, generateServerlessFunctionsEnv, printEnvironmentSummary, populateFlexConfigPlaceholders, generateVideoAppConfigEnv } = require ('./common');


if(!process.argv[2]) {
  console.error("Please provide an environment name");
  return;
}

const environmentName = `${process.argv[2]}`;

var serverlessEnv = `./${serverlessDir}/.env.${environmentName}`;

var context = { 
        ...getEnvironmentVariables()
      }

generateServerlessFunctionsEnv(context, serverlessEnv);
populateFlexConfigPlaceholders(context, environmentName);
generateVideoAppConfigEnv(context, false);
printEnvironmentSummary(context);

