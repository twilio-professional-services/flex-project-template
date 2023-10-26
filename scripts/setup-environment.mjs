import getTwilioAccount from "./common/get-account.mjs";
import getPluginDirs from "./common/get-plugin.mjs";
import installNpmPackage from "./common/install-packages.mjs";
import fillReplacements from "./common/fill-replacements.mjs";
import printReplacements from "./common/print-replacements.mjs";
import saveAppConfig from "./common/save-appconfig.mjs";
import * as constants from "./common/constants.mjs";

// example usage of all possible options:
// node scripts/setup-environment.mjs --skip-install --env=dev --packages=serverless-functions,serverless-schedule-manager

let skipInstallStep = false;
let overwrite = false;
let uninstall = false;
let environment = process.env.ENVIRONMENT;
let overridePackages = [];

// parse command args
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i].startsWith('--skip-install')) {
    skipInstallStep = true;
  } else if (process.argv[i].startsWith('--env=')) {
    environment = process.argv[i].slice(6);
  } else if (process.argv[i].startsWith('--packages=')) {
    overridePackages = process.argv[i].slice(11).split(',');
  } else if (process.argv[i].startsWith('--overwrite')) {
    overwrite = true;
  } else if (process.argv[i].startsWith('--uninstall')) {
    uninstall = true;
  }
}

const outputEnd = () => {
  if (!skipInstallStep && !environment) {
    console.log("");
    console.log(" ----- END OF POST INSTALL SCRIPT ----- ");
    console.log("");
  }
}

const execute = async () => {
  if (!skipInstallStep && !environment) {
    console.log(" ----- START OF POST INSTALL SCRIPT ----- ");
    console.log("");
  }
  
  const account = await getTwilioAccount();
  
  if (!account) {
    // No account provided
    outputEnd();
    return;
  }
  
  let allReplacements = {};
  
  const defaultPackages = [
    constants.serverlessDir,
    constants.scheduleManagerServerlessDir,
    constants.flexConfigDir,
    constants.videoAppDir,
  ];
  let packages = [];
  
  if (overridePackages.length) {
    packages = overridePackages;
  } else {
    packages = defaultPackages;
  }
  
  // Fetch and save env files for each package
  for (const path of packages) {
    const envFile = `./${path}/.env${environment ? `.${environment}` : ''}`;
    const exampleFile = `./${path}/.env.example`;
    let environmentData = await fillReplacements(envFile, exampleFile, account, environment, overwrite);
    allReplacements = { ...allReplacements, ...environmentData };
  }
  
  if (packages.includes(constants.flexConfigDir)) {
    // We also need to populate flex-config
    let configEnv = environment;
    if (!environment) configEnv = 'local';
    
    const configFile = `./${constants.flexConfigDir}/ui_attributes.${configEnv}.json`;
    const exampleFile = `./${constants.flexConfigDir}/ui_attributes.example.json`;
    let configData = await fillReplacements(configFile, exampleFile, account, configEnv, overwrite);
    allReplacements = { ...allReplacements, ...configData };
  }
  
  if (!environment) {
    // When running locally, we need to generate appConfig.js
    saveAppConfig(overwrite);
  }
  
  if (!skipInstallStep || uninstall) {
    if (!overridePackages.length) {
      installNpmPackage(getPluginDirs().pluginDir, skipInstallStep, uninstall);
    }
    for (const path of packages) {
      installNpmPackage(path, skipInstallStep, uninstall);
    }
  }
  
  printReplacements(allReplacements);
  
  if (!skipInstallStep && !environment) {
    if (Object.keys(allReplacements).length < 1) {
      console.log("All local environment files are already fully populated.");
    } else {
      console.log("If there are missing workflow SIDs, you can set those up for those features manually later.");
    }
    console.log("You can now run the following command to start your local serverless functions and Flex plugin together:");
    console.log("\tnpm start");
  }
  
  outputEnd();
}

execute();