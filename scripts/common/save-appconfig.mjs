import { promises as fs } from 'fs';
import JSON5 from 'json5';
import shell from 'shelljs';

import getPluginDirs from "./get-plugin.mjs";
import { flexConfigDir } from "./constants.mjs";

export default async (overwrite) => {
  var { pluginDir } = getPluginDirs();

  var pluginAppConfigExample = `./${pluginDir}/public/appConfig.example.js`;
  var pluginAppConfig = `./${pluginDir}/public/appConfig.js`;
  var commonFlexConfig = `./${flexConfigDir}/ui_attributes.common.json`;
  
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
    
    // disable admin panel for local
    flexConfigJsonData.custom_data.features.admin_ui.enabled = false
    
    appConfigFileData = appConfigFileData.replace("common: {}", `common: ${JSON5.stringify(flexConfigJsonData.custom_data.common, null, 2)}`);
    appConfigFileData = appConfigFileData.replace("features: {}", `features: ${JSON5.stringify(flexConfigJsonData.custom_data.features, null, 2)}`);
    
    await fs.writeFile(pluginAppConfig, appConfigFileData, 'utf8');
  } catch (error) {
    console.error(`Error attempting to generate appConfig file ${pluginAppConfig}`, error);
  }
}