const shell = require("shelljs");
var originalPluginName;

exports.setPluginName = function setPluginName(pluginVersion){

  if(pluginVersion && pluginVersion.toLowerCase() === "v1" ){
    shell.echo("Selecting v1 plugin for install")
    shell.echo("");
    originalPluginName = 'plugin-flex-ts-template-v1';
    exports.originalPluginName = originalPluginName;
    
  } else if (pluginVersion && pluginVersion.toLowerCase() === "v2"){

    shell.echo("Selecting v2 plugin for install")
    shell.echo("");
    originalPluginName = 'plugin-flex-ts-template-v2';
    exports.originalPluginName = originalPluginName;

  } else {

    shell.echo("Plugin version not provided, abandoning post install")
    shell.echo("");

    return;
  }

}

