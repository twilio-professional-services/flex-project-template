const { pluginDir, flexConfigDir, serverlessDir } = require ('./common');
const shell = require("shelljs");
const prompt = require('prompt');
const secondPrompt = require('prompt');
// https://github.com/shelljs/shelljs#shellstringstr


var profile;
var profile_name;
var account_sid;
var auth_token;
var taskrouter_workspace_sid;
var sync_sid;
var chat_sid;
var api_key;
var api_secret;
var everyoneWorkflow;
var chatTransferWorkFlow;
var callbackWorkflow;
var internalCallWorkflow;

var serverlessEnvExample = `./${serverlessDir}/.env.example`;
var serverlessEnv = `./${serverlessDir}/.env`;
var flexConfigEnvExample = `./${flexConfigDir}/.env.example`;
var flexConfigEnv = `./${flexConfigDir}/.env`;
var pluginAppConfigExample = `./${pluginDir}/public/appConfig.example.js`
var pluginAppConfig = `./${pluginDir}/public/appConfig.js`

const installNpm = false;

console.log(" ----- START OF POST INSTALL SCRIPT ----- ");
console.log("");

setActiveProfile().then(() => {

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
      api_key: {
        description: "Please enter the API KEY for your Twilio Account",
        pattern: /^SK[a-zA-Z0-9]+$/,
        message: 'API Key/SID must start with SK and be made up of only numbers and letters',
        required: true,
        ask: function() {
          return false;
          return prompt.history('proceed') && prompt.history('proceed').value.toLocaleLowerCase() === 'y';
        }
      },
      api_secret: {
        description: "Please enter the API Secret for your Twilio Account",
        message: 'API Secret must be present',
        hidden: true,
        replace: '*',
        required: true,
        ask: function() {
          return false;
          return prompt.history('proceed') && prompt.history('proceed').value.toLocaleLowerCase() === 'y';
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
  prompt.get(prompt_schema, function(err, result) {
    if(result.proceed && result.proceed.toLowerCase().includes("n"))
    {
        console.log("");
        console.log("Ok, abandoning script.  Please run \"npm run postinstall\" when the correct profile is set");
        return; 
    }
    else {
      auth_token = result.auth_token
      api_key = result.api_key
      api_secret = result.api_secret
      
      if(account_sid){
        setEnvironmentVariables();
      }
      setupServerlessFunctions();
      setupFlexConfig();
      setupPlugin();
      postInstallInstructions();
      return;
    }
  });
});

async function setActiveProfile() {

  try{
    profile = await shell.exec("twilio profiles:list", {silent: true}).grep("true").stdout;
    profile_name = profile.split(" ")[0].trim().trimStart();
    account_sid = profile.split("  ")[1].trim().trimStart();

  } catch (error) {
    console.warn("Unable to detect active twilio profile, environment configuration files will have to be setup manually");
    console.log("");
  }

}

function setEnvironmentVariables() {

  try {
    console.log("Loading environment variables..");
    console.log("");
    
    taskrouter_workspace_sid = shell.exec("twilio api:taskrouter:v1:workspaces:list", {silent: true}).grep("Flex Task Assignment").stdout.split(" ")[0]
    sync_sid = shell.exec("twilio api:sync:v1:services:list", {silent: true}).grep("Default Service").stdout.split(" ")[0]
    chat_sid = shell.exec("twilio api:chat:v2:services:list", {silent: true}).grep("Flex").grep("Service").stdout.split(" ")[0]

    var workflows = shell.exec(`twilio api:taskrouter:v1:workspaces:workflows:list --workspace-sid=${taskrouter_workspace_sid}`, {silent: true});
    everyoneWorkflow = workflows.grep("Assign To Anyone").stdout.split(" ")[0].trim();
    chatTransferWorkFlow = workflows.grep("Chat Transfer").stdout.split(" ")[0].trim();
    callbackWorkflow = workflows.grep("Callback").stdout.split(" ")[0].trim();
    internalCallWorkflow = workflows.grep("Internal Call").stdout.split(" ")[0].trim();


  } catch (error) {
    console.warn("Error trying to load environment variables, environment configuration files will have to be setup manually");
  }
}

function setupServerlessFunctions() {
  console.log("Installing npm dependencies for serverless functions..");
  if(installNpm){
    shell.exec("npm --prefix ./serverless-functions ci ./serverless-functions", {silent:true});
  }
  if(!shell.test('-e', serverlessEnv)){
    shell.cp(serverlessEnvExample, serverlessEnv);
  }
  if(shell.test('-e', serverlessEnv)){
    if(account_sid){
      shell.sed('-i', /<YOUR_TWILIO_ACCOUNT_SID>/g, `${account_sid}`, serverlessEnv);
    }
    if(auth_token){
      shell.sed('-i', /<YOUR_TWILIO_AUTH_TOKEN>/g, `${auth_token}`, serverlessEnv);
    }
    if(api_key){
      shell.sed('-i', /<YOUR_API_KEY>/g, `${api_key}`, serverlessEnv);
    }
    if(api_secret){
      shell.sed('-i', /<YOUR_API_SECRET>/g, `${api_secret}`, serverlessEnv);
    }
    if(taskrouter_workspace_sid){
      shell.sed('-i', /<YOUR_FLEX_WORKSPACE_SID>/g, `${taskrouter_workspace_sid}`, serverlessEnv);
    }
    if(sync_sid){
      shell.sed('-i', /<YOUR_FLEX_SYNC_SID>/g, `${sync_sid}`, serverlessEnv);
    }
    if(chat_sid){
      shell.sed('-i', /<YOUR_FLEX_CHAT_SERVICE_SID>/g, `${chat_sid}`, serverlessEnv);
    }

    if(callbackWorkflow || everyoneWorkflow){
      var workflow = callbackWorkflow?  callbackWorkflow: everyoneWorkflow;
      shell.sed('-i', /<YOUR_FLEX_CALLBACK_WORKFLOW_SID>/g, `${workflow}`, serverlessEnv);
    }
    if(internalCallWorkflow){
      shell.sed('-i', /<YOUR_FLEX_INTERNAL_CALL_WORKFLOW_SID>/g, `${internalCallWorkflow}`, serverlessEnv);
    }
    if(chatTransferWorkFlow){
      shell.sed('-i', /<YOUR_FLEX_CHAT_TRANSFER_WORKFLOW_SID>/g, `${chatTransferWorkFlow}`, serverlessEnv);
    }
    console.log("Setting up serverless-functions environment file: complete");
  } else {
    console.warn("Unable to configure serverless environment file, it will need to be done manually");
  }
  console.log("");
}

function setupFlexConfig() {
  console.log("Installing npm dependencies for flex-config...");
  if(installNpm){
    shell.exec("npm --prefix ./flex-config ci ./flex-config", {silent:true});
  }
  if(!shell.test('-e', flexConfigEnv)){
    shell.cp(flexConfigEnvExample,flexConfigEnv);
  }
  if(shell.test('-e', flexConfigEnv)){
    if(account_sid){
      shell.sed('-i', /<YOUR_TWILIO_ACCOUNT_SID>/g, `${account_sid}`, flexConfigEnv);
    }
    if(api_key){
      shell.sed('-i', /<YOUR_API_KEY>/g, `${api_key}`, flexConfigEnv);
    } 
    if(api_secret){
      shell.sed('-i', /<YOUR_API_SECRET>/g, `${api_secret}`, flexConfigEnv);
    }
    console.log("Setting up flex-config environment file: complete");
  } else {
    console.warn("Unable to configure flex config environment file, it will need to be done manually");
  }
  console.log("");
}

function setupPlugin() {
  console.log(`Installing npm dependencies for ${pluginDir}...`);
  if(installNpm){
    shell.exec(`npm --prefix ./${pluginDir} ci ./${pluginDir}`, {silent:true});
  }
  if(!shell.test('-e', pluginAppConfig)){
    shell.cp(pluginAppConfigExample, pluginAppConfig);
  }
  console.log("Setting up public/appConfig.js: complete");
  console.log("");
}

function postInstallInstructions(){

  var regex_apisecret = new RegExp(`${api_secret}`, 'g');
  var regex_authtoken = new RegExp(`${auth_token}`, 'g');

  if(prompt.history('proceed') && prompt.history('proceed').value.toLocaleLowerCase() === 'y'){
    console.log("The environment configuration for serverless and flex-config was populated with the following environment variables");

    console.log("");
    console.log("---- INSTANCE SIDS -----------------------------------------");
    console.log("Taskrouter Flex Workspace sid: \t\t", taskrouter_workspace_sid);
    console.log("Default Sync sid: \t\t\t", sync_sid);
    console.log("chat/conversation service sid: \t\t", chat_sid);

    console.log("");
    console.log("---- WORKFLOW SIDS -----------------------------------------");
    console.log("Assign to Anyone workflow sid: \t\t", everyoneWorkflow);
    console.log("chat transfer workflow sid: \t\t", chatTransferWorkFlow);
    console.log("callback workflow sid: \t\t\t", callbackWorkflow);
    console.log("internal call workflow sid: \t\t", internalCallWorkflow);
    console.log("");
    console.log("");
    console.log("if there are missing workflow sids, you can set those up for those features manually later");

    console.log("");
    console.log("You can now run the following command to start you local serverless functions and flex plugin together")
  
  } else {
    console.log("*****     WARNING       *****");
    console.log(`Twilio cli profile not detected, please populate the ${serverlessEnv} and ${flexConfigEnv} files with the required account sids manually`);
    console.log("");
    console.log("Once you have setup the environment you can run the following command to start you local serverless functions and flex plugin together")
  }

  console.log("$ npm run start:local");
  console.log("");
  console.log(" ----- END OF POST INSTALL SCRIPT ----- ");
  console.log("");

  if(false){
    console.log("");
    console.log("");
    console.log("-------- START FLEX CONFIG --------- ");
    console.log("");
    console.log(shell.cat(`${flexConfigEnv}`).sed('-i', regex_apisecret, "**********").sed('-i', regex_authtoken, "**********").stdout);
    console.log("");
    console.log("-------- END FLEX CONFIG --------- ");
    console.log("");
    console.log("");
    console.log("");
    console.log("-------- START SERVERLESS CONFIG --------- ");
    console.log("");
    console.log(shell.cat(`${serverlessEnv}`).sed('-i', regex_apisecret, "**********").sed('-i', regex_authtoken, "**********").stdout);
    console.log("");
    console.log("-------- END SERVERLESS CONFIG --------- ");

  }

}
