const { flexConfigDir, serverlessDir, getEnvironmentVariables, getActiveTwilioProfile, installNPMServerlessFunctions, generateServerlessFunctionsEnv, printEnvironmentSummary, installNPMFlexConfig, generateFlexConfigEnv, installNPMPlugin, generateAppConfigForPlugins } = require ('./common');
const prompt = require('prompt');
prompt.colors = false;

const installNpm = process.argv[2]? process.argv[2] == false: true;

console.log(" ----- START OF POST INSTALL SCRIPT ----- ");
console.log("");

var serverlessEnv = `./${serverlessDir}/.env`;
var flexConfigEnv = `./${flexConfigDir}/.env`;

var context;

getActiveTwilioProfile().then((profile_result) => {

  context = { ...profile_result }
  const { profile_name, account_sid } = context;

  // define the prompt for local environment setup
  // and account_sid from the detected profile and the auth token are required to 
  // properly populate the serverless env file for running locally
  // the prompt will skip if an account sid has not been detected
  var prompt_schema  = {
    properties: {
      proceed: {
        description: `This script will setup environment variables for the active profile: ${profile_name} (${account_sid}) using twilio cli.  Do you want to proceed? Y/N`,
        pattern: /(?:^|\W)[YynN](?:$|\W)/,
        message: 'prompt only accepts Y or N',
        hidden: false,
        required: true,
        ask: function() {
          return account_sid;
        }
      },
      auth_token: {
        description: "Please enter the AUTH token for your account",
        message: 'Auth token must be present',
        hidden: true,
        replace: '*',
        required: true,
        ask: function() {
          return prompt.history('proceed') && prompt.history('proceed').value.toLocaleLowerCase() === 'y';
        }
      }
    }
  };

  prompt.start();
  prompt.get(prompt_schema, function(err, prompt_result) {
  
    // we will abandon the script if you have expressly said no or 
    // an account was not detected
    if(!prompt_result.proceed || prompt_result.proceed.toLowerCase().includes("n"))
    {
        console.log("");
        console.log("Ok, abandoning local environment setup script.  Please run \"npm run postinstall\" when the correct profile is set");
        return; 
    }
    else {
      
      context = { 
        ...context, 
        ...prompt_result, 
        ...getEnvironmentVariables(),
      };

      if(installNpm){
        installNPMServerlessFunctions();
        installNPMFlexConfig();
        installNPMPlugin();
        console.log("");
      }

      if(context.account_sid) {
        generateServerlessFunctionsEnv(context, serverlessEnv);
        generateFlexConfigEnv(context, flexConfigEnv);
        generateAppConfigForPlugins();
        console.log("");

        printEnvironmentSummary(context);

        console.log("if there are missing workflow sids, you can set those up for those features manually later");
        console.log("You can now run the following command to start you local serverless functions and flex plugin together")
        console.log("");
        console.log("For Flex v1 execute:");
        console.log("\tnpm run start:local:v1");
        console.log("For Flex v2 execute:");
        console.log("\tnpm run start:local:v2");
        console.log("Or if you have renamed the template");
        console.log("\tnpm run start:local");
      } else {
        console.log("*****     WARNING       *****");
        console.log(`Twilio cli profile not detected, please set an active profile with`);
        console.log(`twilio profiles:use <profile-name>`);
        console.log(`or populate the ${serverlessEnv} and ${flexConfigEnv} files with the required account sids manually`);
        console.log("");
        console.log("Once you have setup the environment you can run the following command to start you local serverless functions and flex plugin together")
        console.log("");
        console.log("For Flex v1 execute:");
        console.log("\tnpm run start:local:v1");
        console.log("For Flex v2 execute:");
        console.log("\tnpm run start:local:v2");
        console.log("Or if you have renamed the plugin");
        console.log("\tnpm run start:local");
      }
    }

    console.log("");
    console.log(" ----- END OF POST INSTALL SCRIPT ----- ");
    console.log("");
  });
});
