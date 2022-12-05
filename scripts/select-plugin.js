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

function setPluginName(pluginVersion){
  if(pluginVersion && pluginVersion.toLowerCase() === "v1" ){
    originalPluginName = 'plugin-flex-ts-template-v1';
    exports.originalPluginName = originalPluginName;
  } else if (pluginVersion && pluginVersion.toLowerCase() === "v2"){
    originalPluginName = 'plugin-flex-ts-template-v2';
    exports.originalPluginName = originalPluginName;
  }
}

exports.setPluginName = setPluginName

exports.getPaths = function getPaths(plugin_version) {
  setPluginName(plugin_version);
  const pluginDir = getDirectoryName(originalPluginName, /flex-template-.*/);
  const templateDirectory = `${pluginDir}/template-files/no-features`;
  const featureDirectory = `${pluginDir}/src/feature-library`;
  const pluginSrc = `${pluginDir}/src`;

  return { pluginDir, templateDirectory, featureDirectory, pluginSrc }
}

