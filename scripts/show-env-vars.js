const shell = require("shelljs");
const prompt = require('prompt');

var profile;
var profile_name;
var account_sid;
var taskrouter_workspace_sid;
var sync_sid;
var chat_sid;
var everyoneWorkflow;
var chatTransferWorkFlow;
var callbackWorkflow;
var internalCallWorkflow;

var serviceFunctionsSid
var serviceFunctionsDomain
var scheduleFunctionsSid
var scheduledFunctionsDomain


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
    if(account_sid) {
      console.log("Loading environment variables..");
      console.log("");
      
      taskrouter_workspace_sid = shell.exec("twilio api:taskrouter:v1:workspaces:list", {silent: true}).grep("Flex Task Assignment").stdout.split(" ")[0]
      sync_sid = shell.exec("twilio api:sync:v1:services:list", {silent: true}).grep("Default Service").stdout.split(" ")[0]
      chat_sid = shell.exec("twilio api:chat:v2:services:list", {silent: true}).grep("Flex").grep("Service").stdout.split(" ")[0]

      var workflows = shell.exec(`twilio api:taskrouter:v1:workspaces:workflows:list --workspace-sid=${taskrouter_workspace_sid}`, {silent: true});
      everyoneWorkflow = workflows.grep("Assign").grep("Anyone").stdout.split(" ")[0].trim();
      chatTransferWorkFlow = workflows.grep("Chat Transfer").stdout.split(" ")[0].trim();
      callbackWorkflow = workflows.grep("Callback").stdout.split(" ")[0].trim();
      internalCallWorkflow = workflows.grep("Internal Call").stdout.split(" ")[0].trim();

      serviceFunctionsSid = shell.exec("twilio api:serverless:v1:services:list", {silent: true}).grep("custom-flex-extensions-serverless").stdout.split(" ")[0]
      serviceFunctionsDomain = shell.exec(`twilio api:serverless:v1:services:environments:list --service-sid=${serviceFunctionsSid}`, {silent: true}).grep("custom-flex-extensions-serverless").stdout.split(" ")[4]

      scheduleFunctionsSid = shell.exec("twilio api:serverless:v1:services:list", {silent: true}).grep("schedule-manager").stdout.split(" ")[0]
      scheduledFunctionsDomain = shell.exec(`twilio api:serverless:v1:services:environments:list --service-sid=${scheduleFunctionsSid}`, {silent: true}).grep("schedule-manager").stdout.split(" ")[4]

      
    }


  } catch (error) {
    console.warn("Error trying to load environment variables, environment configuration files will have to be setup manually");
  }
}

function postInstallInstructions(){

  if(account_sid){

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
    console.log("---- SERVERLESS DOMAINS -----------------------------------------");
    console.log("serverless functions: \t\t", serviceFunctionsDomain);
    console.log("schedule manager: \t\t", scheduledFunctionsDomain);
    console.log("");
    console.log("");
    console.log("if there are missing workflow sids, you can set those up for those features manually later");
  
  } else {
    console.log("*****     WARNING       *****");
    console.log(`Twilio cli profile not detected`);
  }
  console.log("");

}


setActiveProfile().then(() => {
  if(account_sid){
    setEnvironmentVariables();
    postInstallInstructions()
  }
  return;
});
