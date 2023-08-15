import getTwilioAccount from "./common/get-account.js";
import { installAllPackages, buildVideoApp } from "./common/install-packages.js";
import * as fetchEnvironment from "./common/fetch-environment.js";
import fillEnvironment from "./common/fill-environment.js";
import saveAppConfig from "./common/save-appconfig.js";
import saveReplacements from "./common/save-replacements.js";
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
  // console.log(account);
  // console.log(environment);
  let replacements = {};
  
  // Fetch and save env files for each package
  const packages = [
    constants.serverlessDir,
    constants.scheduleManagerServerlessDir,
    constants.flexConfigDir,
    constants.videoAppDir,
  ];
  
  for (const path of packages) {
    const envFile = `./${path}/.env${environment ? `.${environment}` : ''}`;
    const exampleFile = `./${path}/.env.example`;
    let environmentData = await fillEnvironment(envFile, exampleFile, account, environment);
    replacements = { ...replacements, ...environmentData };
    await saveReplacements(environmentData, envFile);
  }
  
  if (environment) {
    // When running for a specific environment, we need to populate flex-config
    const configFile = `./${constants.flexConfigDir}/ui_attributes.${environment}.json`;
    const exampleFile = `./${constants.flexConfigDir}/ui_attributes.example.json`;
    let configData = await fillEnvironment(configFile, exampleFile, account, environment);
    replacements = { ...replacements, ...configData };
    await saveReplacements(configData, configFile);
  } else {
    // When running locally, we need to generate appConfig.js
    saveAppConfig();
  }
  
  if (!skipInstallStep) {
    installAllPackages();
    buildVideoApp();
  }
  
  // TODO: Display summary -- what to show?
  console.log(replacements);
  
  console.log("");
  console.log(" ----- END OF POST INSTALL SCRIPT ----- ");
  console.log("");
}

execute();