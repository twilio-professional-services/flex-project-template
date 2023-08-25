import shell from "shelljs";

import { defaultPluginDir } from "./constants.mjs";

const getDirectoryName = (originalName, regex) => {
  var tempPluginDir = "";

  if (originalName && shell.test('-d', originalName)) {
    return originalName;
  }
  
  shell.ls('./').forEach((dir) => {
    if (shell.test('-d', dir)) {
      if (dir.match(regex)) {
        tempPluginDir  = dir;
      }
    }
  });
  
  if (!tempPluginDir) {
    console.log("Unable to detect plugin folder name");
    return;
  }
  
  return tempPluginDir;
}

export default () => {
  // The plugin can be renamed via the rename-template script,
  // so we must do some searching before relying on constants.
  const pluginDir = getDirectoryName(defaultPluginDir, /flex-template-.*/);
  const templateDirectory = `${pluginDir}/template-files`;
  const featureDirectory = `${pluginDir}/src/feature-library`;
  const pluginSrc = `${pluginDir}/src`;

  return { pluginDir, templateDirectory, featureDirectory, pluginSrc }
}