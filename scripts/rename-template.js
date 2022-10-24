var shell = require("shelljs");
// https://github.com/shelljs/shelljs#shellstringstr

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function onlyValidCharacters(str) {
  return /^[a-zA-_-]+$/.test(str);
}

const { pluginDir, pluginSrc, flexConfigDir, serverlessDir } = require ('./common');

shell.echo(`renaming plugin: `, pluginDir);
shell.echo("");

if(process.argv[2] === undefined || process.argv[2] === "" ){
  shell.echo("A new asset name was not provided, please try again and provide a new asset name when you run the script.  For example...");
  shell.echo("");
  shell.echo("npm run rename-assets my-new-asset-name");
  shell.echo("");
  return;
}

if(!onlyValidCharacters(process.argv[2])){
  shell.echo("invalid characters detected in new name.  Only a-z, A-Z, hyphens and underscores are accepted");
  shell.echo("");
  return;
}

if(pluginDir === ""){
  shell.echo("something went wrong trying to detect the current plugin directory, abandoning");
  shell.echo("");
  return;
} 

const packageSuffix = (process.argv[2]).toLowerCase();
const packageSuffixUndercore = packageSuffix.replace(/-/g, '_');
const wordArray = process.argv[2].replace(/-/g, ' ').replace(/_/g, ' ').split(' ')

wordArray.forEach((word, index, array) => {
  array[index] = capitalizeFirstLetter(word);
});

const pluginName =  wordArray.join('')
const fullPluginName = `flex-template-${packageSuffix}`

const postInstall = `    "postinstall": "(cd serverless-functions && npm install && cp -n .env.example .env); (cd flex-config && npm install && cp -n .env.example .env); (cd ${fullPluginName} && npm install)"`


// rename flex v2 plugin project name in package.json
shell.sed('-i', /.*"name": ".*",/, `  "name": "${fullPluginName}",`, `${pluginDir}/package.json`);

// reset the build number to 0.0.1
shell.sed('-i', /.*"version": ".*",/, `  "version": "0.0.1",`, `${pluginDir}/package.json`);

// repeat for package-lock
shell.sed('-i', /.*"name": ".*",/, `  "name": "${fullPluginName}",`, `${pluginDir}/package-lock.json`);
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
shell.mv([pluginDir], `./${fullPluginName}`)

// update the script to use the new plugin directory
shell.sed('-i', /.*"postinstall": .*"/, postInstall, `package.json`);


// rename serverless package so plugins dont collide when deployed side by side
shell.sed('-i', /.*"name": ".*",/, `  "name": "serverless-${packageSuffix}",`, `${serverlessDir}/package.json`);
shell.sed('-i', /.*"name": ".*",/, `  "name": "serverless-${packageSuffix}",`, `${serverlessDir}/package-lock.json`);

// rename the flex-config serverless_functions_domain so it doesnt collide either
shell.sed('-i', /serverless_functions_domain[_,a-z]*":/, `serverless_functions_domain_${packageSuffixUndercore}":`, `${flexConfigDir}/ui_attributes.*.json`);

//update references to it
if(shell.test('-e', `${fullPluginName}/src/feature-library/chat-to-video-escalation/custom-components/SwitchToVideo/SwitchToVideo.tsx`)){
  shell.sed('-i', /serverless_functions_domain[_]*[a-z]*/g, `serverless_functions_domain_${packageSuffixUndercore}`, `${fullPluginName}/src/feature-library/chat-to-video-escalation/custom-components/SwitchToVideo/SwitchToVideo.tsx`);
}

if(shell.test('-e', `${fullPluginName}/src/feature-library/chat-to-video-escalation/custom-components/VideoRoom/VideoRoom.tsx`)){
  shell.sed('-i', /serverless_functions_domain[_]*[a-z]*/g, `serverless_functions_domain_${packageSuffixUndercore}`, `${fullPluginName}/src/feature-library/chat-to-video-escalation/custom-components/VideoRoom/VideoRoom.tsx`);
}

shell.sed('-i', /serverless_functions_domain[_]*[a-z]*/g, `serverless_functions_domain_${packageSuffixUndercore}`, `${fullPluginName}/src/types/manager/ServiceConfiguration.ts`);
shell.sed('-i', /serverless_functions_domain[_]*[a-z]*/g, `serverless_functions_domain_${packageSuffixUndercore}`, `${fullPluginName}/src/utils/serverless/ApiService/ApiService.test.ts`);
shell.sed('-i', /serverless_functions_domain[_]*[a-z]*/g, `serverless_functions_domain_${packageSuffixUndercore}`, `${fullPluginName}/src/utils/serverless/ApiService/index.ts`);


if(shell.test('-e', './plugin-flex-ts-template')){
  shell.echo(`Removing v1 plugin`);
  shell.echo("");
  shell.rm('-rf', './plugin-flex-ts-template');
}

if(shell.test('-e', './serverless-functions/.twiliodeployinfo')){
  shell.echo(`Removing any serverless deployment references`);
  shell.echo("");
  shell.rm('-rf', './serverless-functions/.twiliodeployinfo'); 
}

shell.echo(`Renaming assets complete, dont forget to re-run: npm install, deploy your serverless functions and update the serverless_functions_domain_${packageSuffixUndercore} in your flex-config`);
shell.echo("");
