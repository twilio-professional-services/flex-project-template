import getTwilioAccount from "./common/get-account.mjs";
import { installAllPackages, buildVideoApp } from "./common/install-packages.mjs";
import fillReplacements from "./common/fill-replacements.mjs";
import printReplacements from "./common/print-replacements.mjs";
import saveAppConfig from "./common/save-appconfig.mjs";
import * as constants from "./common/constants.mjs";

// valid usage:
// node setup-environment.mjs
// node setup-environment.mjs --skip-install
// node setup-environment.mjs dev
// node setup-environment.mjs --skip-install dev
const skipInstallStep = process.argv.length > 2 && process.argv[2] == '--skip-install';
const environment = (skipInstallStep ? (process.argv.length > 3 ? process.argv[3] : '') : process.argv.length > 2 ? process.argv[2] : '') || process.env.ENVIRONMENT;

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
  
  printReplacements(allReplacements);
  
  if (!skipInstallStep) {
    console.log("You can now run the following command to start your local serverless functions and Flex plugin together:");
    console.log("\tnpm start");
  }
  
  outputEnd();
}

execute();