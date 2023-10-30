import getTwilioAccount from "./common/get-account.mjs";
import getAddonsDirs from "./common/get-addons.mjs";
import getPluginDirs from "./common/get-plugin.mjs";
import installNpmPackage from "./common/install-packages.mjs";
import fillReplacements from "./common/fill-replacements.mjs";
import printReplacements from "./common/print-replacements.mjs";
import saveAppConfig from "./common/save-appconfig.mjs";
import * as constants from "./common/constants.mjs";

// example usage of options:
// node scripts/setup-environment.mjs --skip-install --env=dev --packages=serverless-functions,serverless-schedule-manager --files=test/config.example.json

let skipEnvSetup = false;
let skipInstallStep = false;
let skipPlugin = false;
let skipPackages = false;
let overwrite = false;
let uninstall = false;
let environment = process.env.ENVIRONMENT;
let overridePackages = [];
let files = [];

// parse command args
for (let i = 2; i < process.argv.length; i++) {
  if (process.argv[i].startsWith('--skip-install')) {
    skipInstallStep = true;
  } else if (process.argv[i].startsWith('--skip-env')) {
    skipEnvSetup = true;
  } else if (process.argv[i].startsWith('--skip-plugin')) {
    skipPlugin = true;
  } else if (process.argv[i].startsWith('--skip-packages')) {
    skipPackages = true;
  } else if (process.argv[i].startsWith('--overwrite')) {
    overwrite = true;
  } else if (process.argv[i].startsWith('--uninstall')) {
    uninstall = true;
  } else if (process.argv[i].startsWith('--env=')) {
    environment = process.argv[i].slice(6);
  } else if (process.argv[i].startsWith('--packages=')) {
    overridePackages = process.argv[i].slice(11).split(',');
  } else if (process.argv[i].startsWith('--files=')) {
    files = process.argv[i].slice(8).split(',');
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
  
  const account = skipEnvSetup ? {} : await getTwilioAccount();
  
  if (!account && !skipEnvSetup) {
    // No account provided
    outputEnd();
    return;
  }
  
  let allReplacements = {};
  
  // determine packages to process
  const defaultPackages = [
    constants.serverlessDir,
    constants.flexConfigDir,
    ...getAddonsDirs(),
  ];
  let packages = [];
  
  if (skipPackages) {
    // keep the empty packages array
  } else if (overridePackages.length) {
    packages = overridePackages;
  } else {
    if (!skipPlugin) {
      defaultPackages.push(getPluginDirs().pluginDir);
    }
    packages = defaultPackages;
  }
  
  // determine additional files to process based on selected packages
  if (packages.includes(constants.flexConfigDir)) {
    files.push(`./${constants.flexConfigDir}/ui_attributes.example.json`);
  }
  
  if (!skipEnvSetup) {
    // Fetch and save env files for each package
    for (const path of packages) {
      const envFile = `./${path}/.env${environment ? `.${environment}` : ''}`;
      const exampleFile = `./${path}/.env.example`;
      let environmentData = await fillReplacements(envFile, exampleFile, account, environment, overwrite);
      allReplacements = { ...allReplacements, ...environmentData };
    }
    
    // Fetch and save standalone files specified
    // Performs a regex replacement of 'example' to the environment name within the filename
    for (const exampleFile of files) {
      let filenameEnv = environment;
      if (!environment) filenameEnv = 'local';
      
      const configFile = exampleFile.replace(/([_\-\./])(example)([_\-\./])/g, `$1${filenameEnv}$3`);
      let configData = await fillReplacements(configFile, exampleFile, account, filenameEnv, overwrite);
      allReplacements = { ...allReplacements, ...configData };
    }
    
    if (!environment && !skipPlugin && !skipPackages) {
      // When running locally, we need to generate appConfig.js for the plugin
      saveAppConfig(overwrite);
    }
  }
  
  if ((!skipInstallStep || uninstall) && !skipPackages) {
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