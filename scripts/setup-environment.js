import getTwilioAccount from "./common/get-account.js";
import { installAllPackages, buildVideoApp } from "./common/install-packages.js";
import fetchEnvironment from "./common/fetch-environment.js";
import constants from "./common/constants.js";

// valid usage:
// node setup-environment.js
// node setup-environment.js --skip-install
// node setup-environment.js dev
// node setup-environment.js --skip-install dev
const skipInstallStep = process.argv.length > 2 && process.argv[2] == '--skip-install';
const environment = skipInstallStep ? (process.argv.length > 3 ? process.argv[3] : '') : process.argv.length > 2 ? process.argv[2] : '';

const execute = async () => {
  console.log(" ----- START OF POST INSTALL SCRIPT ----- ");
  console.log("");
  
  const account = await getTwilioAccount();
  console.log(account);
  console.log(environment);
  
  // Fetch and save env files for each package
  const packages = [
    constants.serverlessDir,
    constants.scheduleManagerServerlessDir,
    constants.flexConfigDir,
    constants.videoAppDir,
  ];
  
  for (const path of packages) {
    let environmentData = await fetchEnvironment(path, environment);
    
    // Populate account information from profile if present
    // TODO: Do this better
    if (account.accountSid) {
      environmentData.ACCOUNT_SID = account.accountSid;
    }
    if (account.authToken) {
      environmentData.AUTH_TOKEN = account.authToken;
    }
    
    console.log('environment data:', environmentData);
    // TODO: Figure out handling of flex-config and video app envs
    // TODO: Save
  }
  
  // TODO: Do ui_attributes files
  
  // TODO: Generate appConfig.js if local
  
  if (!skipInstallStep) {
    installAllPackages();
    buildVideoApp();
  }
  
  console.log("");
  console.log(" ----- END OF POST INSTALL SCRIPT ----- ");
  console.log("");
}

execute();