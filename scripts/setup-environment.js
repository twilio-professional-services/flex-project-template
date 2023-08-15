import getTwilioAccount from "./common/get-account.js";
import { installAllPackages, buildVideoApp } from "./common/install-packages.js";
import fillReplacements from "./common/fill-replacements.js";
import saveAppConfig from "./common/save-appconfig.js";
import constants from "./common/constants.js";

// valid usage:
// node setup-environment.js
// node setup-environment.js --skip-install
// node setup-environment.js dev
// node setup-environment.js --skip-install dev
const skipInstallStep = process.argv.length > 2 && process.argv[2] == '--skip-install';
const environment = skipInstallStep ? (process.argv.length > 3 ? process.argv[3] : '') : process.argv.length > 2 ? process.argv[2] : '';

const outputEnd = () => {
  console.log("");
  console.log(" ----- END OF POST INSTALL SCRIPT ----- ");
  console.log("");
}

const execute = async () => {
  console.log(" ----- START OF POST INSTALL SCRIPT ----- ");
  console.log("");
  
  const account = await getTwilioAccount();
  
  if (!account) {
    // No account provided
    outputEnd();
    return;
  }
  
  let allReplacements = {};
  
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
    let environmentData = await fillReplacements(envFile, exampleFile, account, environment);
    allReplacements = { ...allReplacements, ...environmentData };
  }
  
  if (environment) {
    // When running for a specific environment, we need to populate flex-config
    const configFile = `./${constants.flexConfigDir}/ui_attributes.${environment}.json`;
    const exampleFile = `./${constants.flexConfigDir}/ui_attributes.example.json`;
    let configData = await fillReplacements(configFile, exampleFile, account, environment);
    allReplacements = { ...allReplacements, ...configData };
  } else {
    // When running locally, we need to generate appConfig.js
    saveAppConfig();
  }
  
  if (!skipInstallStep) {
    installAllPackages();
    buildVideoApp();
  }
  
  // TODO: Display summary -- what to show?
  // Match to the constants map to get a grouping.
  // Manually pick out the auth stuff.
  // Show "the rest" as custom section (from env etc)
  console.log(allReplacements);
  
  outputEnd();
}

execute();