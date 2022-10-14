var shell = require("shelljs");
// https://github.com/shelljs/shelljs#shellstringstr

const { pluginDir, pluginSrc } = require ('./common');

const packageSuffix = process.argv[2];
const pluginName = `${process.argv[2]}Plugin`;

if(packageSuffix === undefined || packageSuffix === ""){
  shell.echo("A new asset name was not provided, please try again and provide a new asset name when you run the script.  For example...");
  shell.echo("");
  shell.echo("npm run rename-assets my-new-asset-name");
  shell.echo("");
  return;
} 

if (!(shell.test('-e', `${pluginSrc}/FlexTSTemplatePlugin.tsx`))) { 
  shell.echo("It looks like this plugin has already been renamed");
  shell.echo("");
  shell.echo("this script is only designed to run on the unmodified template.  You could try reverting your changes and trying again");
  shell.echo("");
  return;
 };

// rename flex v2 plugin project name in package.json
shell.sed('-i', /.*"name": ".*",/, `"name": "plugin-ps-template-${packageSuffix}"`, `${pluginDir}/package.json`);

// reset the build number to 0.0.1
shell.sed('-i', /.*"version": ".*",/, `  "version": "0.0.1",`, `${pluginDir}/package.json`);

// rename the plugin file names
shell.sed ('-i', `FlexTSTemplatePlugin`, `${pluginName}`, `${pluginSrc}/index.ts`);
shell.sed ('-i', `./FlexTSTemplatePlugin`, `./${pluginName}`, `${pluginSrc}/index.ts`);
shell.sed ('-i', `FlexTSTemplatePlugin`, `${pluginName}`, `${pluginSrc}/FlexTSTemplatePlugin.tsx`);
shell.mv(`${pluginSrc}/FlexTSTemplatePlugin.tsx`, `${pluginSrc}/${pluginName}.tsx`);

// rename the plugin directory
shell.mv([pluginDir], `./plugin-ps-template-${packageSuffix}`)

// update the script to use the new plugin directory
shell.sed('-i', `plugin-flex-ts-template-v2`, `plugin-ps-template-${packageSuffix}`, `package.json`);

// run npm install again
shell.exec("npm install");
