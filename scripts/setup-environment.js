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
  
  // TODO: Fetch and save env files
  // do this for each package
  const environmentData = await fetchEnvironment(constants.scheduleManagerServerlessDir, environment);
  
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