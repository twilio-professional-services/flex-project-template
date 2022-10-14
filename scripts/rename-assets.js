var shell = require("shelljs");
// https://github.com/shelljs/shelljs#shellstringstr

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

const { pluginDir, pluginSrc } = require ('./common');

shell.echo(`pluginDir: `, pluginDir);

if(process.argv[2] === undefined || process.argv[2] === ""){
  shell.echo("A new asset name was not provided, please try again and provide a new asset name when you run the script.  For example...");
  shell.echo("");
  shell.echo("npm run rename-assets my-new-asset-name");
  shell.echo("");
  return;
} 

const packageSuffix = (process.argv[2]).toLowerCase();
const pluginName =  capitalizeFirstLetter(`${process.argv[2]}Plugin`);

const postInstall = `    "postinstall": "(cd serverless-functions && npm install && cp -n .env.example .env); (cd flex-config && npm install && cp -n .env.example .env); (cd plugin-ps-template-${packageSuffix} && npm install)"`


// rename flex v2 plugin project name in package.json
shell.sed('-i', /.*"name": ".*",/, `  "name": "plugin-ps-template-${packageSuffix}",`, `${pluginDir}/package.json`);

// reset the build number to 0.0.1
shell.sed('-i', /.*"version": ".*",/, `  "version": "0.0.1",`, `${pluginDir}/package.json`);

// repeat for package-lock
shell.sed('-i', /.*"name": ".*",/, `  "name": "plugin-ps-template-${packageSuffix}",`, `${pluginDir}/package-lock.json`);
shell.sed('-i', /.*"version": ".*",/, `  "version": "0.0.1",`, `${pluginDir}/package-lock.json`);

// rename the plugin file names
 shell.sed ('-i', /import .*Plugin from '.\/.*Plugin';/, `import ${pluginName} from './${pluginName}';`, `${pluginSrc}/index.ts`);
 shell.sed ('-i', /FlexPlugin.loadPlugin\(.*Plugin\);/, `FlexPlugin.loadPlugin(${pluginName});`, `${pluginSrc}/index.ts`);

 shell.sed ('-i', /const PLUGIN_NAME = '.*Plugin';/, `const PLUGIN_NAME = '${pluginName}';`, `${pluginSrc}/*Plugin.tsx`);
 shell.sed ('-i', /export default class .*Plugin extends/, `export default class ${pluginName} extends`, `${pluginSrc}/*Plugin.tsx`);

 shell.ls(`${pluginSrc}/*Plugin.tsx`).forEach(function (file) {
  shell.mv(file, `${pluginSrc}/${pluginName}.tsx`);
 });

 shell.ls(`${pluginSrc}/*Plugin.tsx`).forEach(function (file) {
  shell.mv(file, `${pluginSrc}/${pluginName}.tsx`);
 });

 // rename the plugin directory
shell.mv([pluginDir], `./plugin-ps-template-${packageSuffix}`)

// update the script to use the new plugin directory
shell.sed('-i', /.*"postinstall": .*"/, postInstall, `package.json`);


shell.echo("Renaming assets complete, dont forget to re-run: npm install");
shell.echo("");
