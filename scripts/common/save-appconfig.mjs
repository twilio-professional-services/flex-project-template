import { promises as fs } from 'fs';
import JSON5 from 'json5';
import shell from 'shelljs';
import merge from 'lodash/merge.js';

import { fillReplacementsForString } from "./fill-replacements.mjs";
import getPluginDirs from "./get-plugin.mjs";
import { flexConfigDir } from "./constants.mjs";

export default async (account, overwrite) => {
  var { pluginDir } = getPluginDirs();

  var pluginAppConfigExample = `./${pluginDir}/public/appConfig.example.js`;
  var pluginAppConfig = `./${pluginDir}/public/appConfig.js`;
  var commonFlexConfig = `./${flexConfigDir}/ui_attributes.common.json`;
  var localFlexConfig = `./${flexConfigDir}/ui_attributes.local.json`;
  
  if (!pluginDir) {
    return;
  }

  try {
    if (!overwrite && shell.test('-e', pluginAppConfig)) {
      return;
    }
    
    console.log(`Setting up ${pluginAppConfig}...`);
    
    shell.cp(pluginAppConfigExample, pluginAppConfig);
    
    // now that we have a copy of the file, populate it with defaults
    let appConfigFileData = await fs.readFile(pluginAppConfig, "utf8");
    let flexConfigFileData = await fs.readFile(commonFlexConfig, "utf8");
    let flexConfigJsonData = JSON.parse(flexConfigFileData);
    
    // also read the environment-specific config
    // this file should have been created by earlier script functions
    let localFlexConfigJsonData = {};
    if (shell.test('-e', localFlexConfig)) {
      let localFlexConfigFileData = await fs.readFile(localFlexConfig, "utf8");
      localFlexConfigJsonData = JSON.parse(localFlexConfigFileData);
    }
    
    // the environment-specific flex config should take precedence over the common config
    let mergedFlexConfigJsonData = merge(flexConfigJsonData, localFlexConfigJsonData);
    
    // disable admin panel for local
    mergedFlexConfigJsonData.custom_data.features.admin_ui.enabled = false
    
    appConfigFileData = appConfigFileData.replace("common: {}", `common: ${JSON5.stringify(mergedFlexConfigJsonData.custom_data.common, null, 2)}`);
    appConfigFileData = appConfigFileData.replace("features: {}", `features: ${JSON5.stringify(mergedFlexConfigJsonData.custom_data.features, null, 2)}`);
    
    // Perform replacements in the fully assembled string
    const replacements = await fillReplacementsForString(appConfigFileData, account, "local");
    
    await fs.writeFile(pluginAppConfig, replacements.data, 'utf8');
    
    return replacements.envVars;
  } catch (error) {
    console.error(`Error attempting to generate appConfig file ${pluginAppConfig}`, error);
  }
}