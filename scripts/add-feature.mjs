import shell from "shelljs";
import { promises as fs } from 'fs';

import getPluginDirs from "./common/get-plugin.mjs";
const { templateDirectory, featureDirectory, pluginSrc, pluginDir } = getPluginDirs();

var featureName;
var featureClassName;
var featureConfigName;
var newFeatureDirectory;

const featureSubstitutionFiles = [
  "config.ts",
  "index.ts",
  "types/ServiceConfiguration.ts"
];

const createDirs = [
  "custom-components",
  "flex-hooks"
];

const onlyValidCharacters = (str) => {
  return /^[0-9a-z-]+$/.test(str);
}

const startsWithAlpha = (str) => {
  return /^[a-z]+$/.test(str[0]);
}

const capitalizeFirstLetter = (str) => {
  return str[0].toUpperCase() + str.slice(1);
}

const validateInput = () => {
  if(process.argv[2] === undefined || process.argv[2] === "" ){
    shell.echo("A new feature name was not provided, please try again and provide a new feature name when you run the script.  For example...");
    shell.echo("");
    shell.echo("npm run add-feature my-new-feature-name");
    shell.echo("");
    return false;
  }
  
  if(!onlyValidCharacters(process.argv[2])){
    shell.echo("invalid characters detected in new name.  Only a-z (lowercase), 0-9, and hyphens are accepted");
    shell.echo("");
    return false;
  }
  
  if(!startsWithAlpha(process.argv[2])){
    shell.echo("feature name must begin with a letter");
    shell.echo("");
    return false;
  }
  
  if(pluginSrc === ""){
    shell.echo("something went wrong trying to detect the current plugin directory, abandoning");
    shell.echo("");
    return false;
  }
  
  return true;
}

const performSubstitutions = (input) => {
  return input.replace(/FEATURE_NAME/g, featureName)
  .replace(/FEATURE_CLASS_NAME/g, featureClassName)
  .replace(/FEATURE_CONFIG_NAME/g, featureConfigName);
}

// get feature name from argv
const setVars = () => {
  featureName = process.argv[2];
  
  // transform name
  featureClassName = capitalizeFirstLetter(featureName.replace(/-([a-z0-9])/gi, function(s, group1) {
      return group1.toUpperCase();
  }));
  featureConfigName = featureName.replace(/-/g, '_');
  
  newFeatureDirectory = `${featureDirectory}/${featureName}`;
}

const createDir = async () => {
  try {
    await fs.access(newFeatureDirectory);
    // if this is successful, the feature directory already exists
    shell.echo("feature directory already exists, abandoning");
    shell.echo("");
    return false;
  } catch {
    shell.echo("Creating feature");
    shell.mkdir(newFeatureDirectory);
    createDirs.forEach(newDir => {
      shell.mkdir(`${newFeatureDirectory}/${newDir}`);
    });
    shell.cp('-R', `${templateDirectory}/feature-template/.`, `${newFeatureDirectory}/`);
    return true;
  }
}

const updateNames = async () => {
  var success = true;
  
  await Promise.all(featureSubstitutionFiles.map(async (file) => {
    try {
      shell.echo(`Setting feature name in ${file}`);
      const fileData = await fs.readFile(`${newFeatureDirectory}/${file}`, "utf8");
      let newFileData = performSubstitutions(fileData);
      await fs.writeFile(`${newFeatureDirectory}/${file}`, newFileData, 'utf8');
    } catch (error) {
      shell.echo(`Failed to update ${file}: ${error}`);
      success = false;
    }
  }));
  
  return success;
}

// update flex-config, used for deployment to Flex Configuration API
// default to disabled to allow for planned deployments
const updateConfig = async () => {
  let configFile = "flex-config/ui_attributes.common.json";
  try {
    shell.echo(`Adding feature to ${configFile}`);
    let fileData = await fs.readFile(configFile, "utf8");
    let jsonData = JSON.parse(fileData);
    jsonData.custom_data.features[featureConfigName] = { enabled: false };
    await fs.writeFile(configFile, JSON.stringify(jsonData, null, 2), 'utf8');
  } catch (error) {
    shell.echo(`Failed to update ${configFile}: ${error}`);
  }
}

// update appConfig, used for local development
// default this one to enabled to make developer's life easier
const updateAppConfig = async () => {
  var success = true;
  let appConfigFile = `${pluginDir}/public/appConfig.js`;
  try {
    await fs.access(appConfigFile);
    // if this is successful, the appConfig exists (yay!)
    shell.echo(`Adding feature to ${appConfigFile}`);
    let appConfigData = await fs.readFile(appConfigFile, "utf8");
    let newAppConfigData = appConfigData.replace("features: {", `features: {\n      ${featureConfigName}: {\n        enabled: true,\n      },`);
    await fs.writeFile(appConfigFile, newAppConfigData, 'utf8');
  } catch (error) {
    success = false;
  }
  
  return success;
}

const addFeature = async () => {
  if (!validateInput()) {
    return;
  }
  
  setVars();
  
  if (!(await createDir()) || !(await updateNames())) {
    return;
  }
  
  await updateConfig();
  let appConfigUpdated = await updateAppConfig();
  
  shell.echo("");
  shell.echo(`Feature added: "${featureName}"`);
  if (appConfigUpdated) {
    shell.echo("Please note that this feature has been enabled locally for development. It will not be enabled elsewhere until it is added to flex-config for the appropriate environment.");
  } else {
    shell.echo("Please note that this feature will not be enabled until it is added to flex-config for the appropriate environment.");
  }
  shell.echo("");
}

addFeature();