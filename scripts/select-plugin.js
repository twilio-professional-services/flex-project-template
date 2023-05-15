const shell = require("shelljs");
var originalPluginName;

function getDirectoryName(originalName, regex) {

  var tempPluginDir = "";

  if(originalName && originalName != "" && shell.test('-d', `${originalName}`)){
    tempPluginDir = originalName;
  } else {
    shell.ls('./').forEach(function (dir){
      if(shell.test('-d', dir)){
        if(dir.match(regex)){
          tempPluginDir  = dir;
        }
      }
    })
  }
  if(tempPluginDir == ""){
    console.log("unable to detect plugin folder name");
  }
  return tempPluginDir;
}

exports.getPaths = function getPaths(pluginName) {
  if (pluginName) {
    originalPluginName = pluginName;
  } else {
    originalPluginName = 'plugin-flex-ts-template-v2';
  }
  exports.originalPluginName = originalPluginName;
  const pluginDir = getDirectoryName(originalPluginName, /flex-template-.*/);
  const templateDirectory = `${pluginDir}/template-files`;
  const featureDirectory = `${pluginDir}/src/feature-library`;
  const pluginSrc = `${pluginDir}/src`;

  return { pluginDir, templateDirectory, featureDirectory, pluginSrc }
}

