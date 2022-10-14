var shell = require("shelljs");

const originalPluginDir = 'plugin-flex-ts-template-v2';


var tempPluginDir = "";

if(shell.test('-d', `${originalPluginDir}`)){
  tempPluginDir = originalPluginDir;
} else {
  shell.ls('./').forEach(function (dir){
    if(shell.test('-d', dir)){
      if(dir.match(/flex-template-.*/)){
        tempPluginDir  = dir;
      }
    }
  })
}

const pluginDir = tempPluginDir;
const serverlessDir = 'serverless-functions';
const flexConfigDir = 'flex-config';
const templateDirectory = `${pluginDir}/template-files/no-features`;
const featureDirectory = `${pluginDir}/src/feature-library`;
const pluginSrc = `${pluginDir}/src`;
const serverlessSrc = `${serverlessDir}/src`;



exports.pluginDir = pluginDir;
exports.serverlessDir =  serverlessDir;
exports.flexConfigDir = flexConfigDir;
exports.templateDirectory = templateDirectory;
exports.featureDirectory = featureDirectory;
exports.pluginSrc = pluginSrc;
exports.serverlessSrc = serverlessSrc;
