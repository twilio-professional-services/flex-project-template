import shell from "shelljs";
// https://github.com/shelljs/shelljs#shellstringstr
import { flexConfigDir, serverlessDir, infraAsCodeDir } from "./common/constants.mjs";
import getPluginDirs from "./common/get-plugin.mjs";
import { promises as fs } from 'fs';

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function onlyValidCharacters(str) {
  return /^[0-9a-zA-Z_-]+$/.test(str);
}

const { pluginDir, pluginSrc } = getPluginDirs();

const performRename = async () => {
  shell.echo(`renaming plugin: `, pluginDir);
  shell.echo("");
  
  if(process.argv[2] === undefined || process.argv[2] === "" ){
    shell.echo("A new template name was not provided, please try again and provide a new template name when you run the script.  For example...");
    shell.echo("");
    shell.echo("npm run rename-template my-new-template-name");
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
  
  const start_plugin =`     "start:plugin": "cd ${fullPluginName} && twilio flex:plugins:start"`
  
  
  // rename flex v2 plugin project name in package.json
  shell.sed('-i', /.*"name": ".*",/, `  "name": "${fullPluginName}",`, `${pluginDir}/package.json`);
  
  // reset the build number to 0.0.1
  shell.sed('-i', /.*"version": ".*",/, `  "version": "0.0.1",`, `${pluginDir}/package.json`);
  
  // repeat for package-lock
  if(shell.test('-e', `${pluginDir}/package-lock.json`)){
    shell.sed('-i', /.*"name": ".*",/, `  "name": "${fullPluginName}",`, `${pluginDir}/package-lock.json`);
    shell.sed('-i', /.*"version": ".*",/, `  "version": "0.0.1",`, `${pluginDir}/package-lock.json`);
  }
  
  // rename the plugin file names
  shell.sed ('-i', /FlexPlugin.loadPlugin\(.*Plugin\);/, `FlexPlugin.loadPlugin(${pluginName});`, `${pluginSrc}/index.ts`);
  shell.sed ('-i', /const PLUGIN_NAME = '.*Plugin';/, `const PLUGIN_NAME = '${pluginName}';`, `${pluginSrc}/*lugin.tsx`);
  shell.sed ('-i', /export default class .*Plugin extends/, `export default class ${pluginName} extends`, `${pluginSrc}/*lugin.tsx`);
  
  // ensuring file name always ends with plugin
  shell.ls(`${pluginSrc}/*lugin.tsx`).forEach(function (file) {
   if(pluginName.endsWith("Plugin") || pluginName.endsWith("plugin")){
     shell.mv(file, `${pluginSrc}/${pluginName}.tsx`);
     shell.sed ('-i', /import .*lugin from '.\/.*lugin';/, `import ${pluginName} from './${pluginName}';`, `${pluginSrc}/index.ts`);
   } else {
     shell.mv(file, `${pluginSrc}/${pluginName}Plugin.tsx`);
     shell.sed ('-i', /import .*Plugin from '.\/.*Plugin';/, `import ${pluginName} from './${pluginName}Plugin';`, `${pluginSrc}/index.ts`);
   }
  });

  //rename redux namespace
  shell.ls(`${pluginSrc}/utils/state/index.ts`).forEach(function (file) {
    shell.sed ('-i', /export const reduxNamespace.*/, `export const reduxNamespace = '${fullPluginName}';`, file);
  });

  //update the config mappings
  const mappingsFile = './scripts/config/mappings.json'
  const originalMappings = await fs.readFile(mappingsFile, "utf8");
  let mappings = await JSON.parse(originalMappings);
  mappings.SERVERLESS_DOMAIN.name = `serverless_functions_domain_${packageSuffixUndercore}`;
  await fs.writeFile(mappingsFile, JSON.stringify(mappings, null, 2), 'utf8');

   // rename the plugin directory
  shell.mv([pluginDir], `./${fullPluginName}`)
  
  // update the script to use the new plugin directory
  shell.sed('-i', /.*"start:plugin": .*"/, start_plugin, `package.json`);
  
  
  // rename serverless package so plugins dont collide when deployed side by side
  shell.sed('-i', /.*"name": ".*",/, `  "name": "serverless-${packageSuffix}",`, `${serverlessDir}/package.json`);
  shell.sed('-i', /.*"name": ".*",/, `  "name": "serverless-${packageSuffix}",`, `${serverlessDir}/package-lock.json`);
  
  // rename the flex-config serverless_functions_domain so it doesnt collide either
  shell.sed('-i', /serverless_functions_domain[_,a-z]*":/, `serverless_functions_domain_${packageSuffixUndercore}":`, `${flexConfigDir}/ui_attributes.*.json`);
  
  //update references to it
  shell.sed('-i', /serverless_functions_domain[_]*[a-z]*/g, `serverless_functions_domain_${packageSuffixUndercore}`, `${fullPluginName}/src/types/manager/ServiceConfiguration.ts`);
  shell.sed('-i', /serverless_functions_domain[_]*[a-z]*/g, `serverless_functions_domain_${packageSuffixUndercore}`, `${fullPluginName}/src/utils/serverless/ApiService/ApiService.test.ts`);
  shell.sed('-i', /serverless_functions_domain[_]*[a-z]*/g, `serverless_functions_domain_${packageSuffixUndercore}`, `${fullPluginName}/src/utils/serverless/ApiService/index.ts`);
  shell.sed('-i', /serverless_functions_domain[_]*[a-z]*/g, `serverless_functions_domain_${packageSuffixUndercore}`, `${fullPluginName}/test-utils/flex-service-configuration.ts`);
  
  shell.sed('-i', /serverless_functions_domain[_]*[a-z]*/g, `serverless_functions_domain_${packageSuffixUndercore}`, `${fullPluginName}/public/appConfig.example.js`);
  
  if(shell.test('-e', `${fullPluginName}/public/appConfig.js`)){
    shell.sed('-i', /serverless_functions_domain[_]*[a-z]*/g, `serverless_functions_domain_${packageSuffixUndercore}`, `${fullPluginName}/public/appConfig.js`);
  }
  
  if(shell.test('-e', './serverless-functions/.twiliodeployinfo')){
    shell.echo(`Removing any serverless deployment references`);
    shell.echo("");
    shell.rm('-rf', './serverless-functions/.twiliodeployinfo'); 
  }
  
  // update references to the plugin in the actions scripts
  var oldPluginNamdRegex = RegExp(`${pluginDir}`); 
  shell.sed('-i', oldPluginNamdRegex, fullPluginName, `./.github/*/flex_deploy.yaml`);
  shell.sed('-i', oldPluginNamdRegex, fullPluginName, `./.github/*/checks.yaml`);

  // update references to the domain name in the infra-as-code package
  const name = `serverless-${packageSuffix}`
  shell.sed('-i', /custom-flex-extensions-serverless/g, `${name}`, `./infra-as-code/state/import_internal_state.sh`);
  shell.sed('-i', /custom-flex-extensions-serverless/g, `${name}`, `./infra-as-code/terraform/environments/default/variables.tf`);
  shell.sed('-i', /length\(var.SERVERLESS_DOMAIN\) > [0-9][0-9] && substr\(var.SERVERLESS_DOMAIN, 0, [0-9][0-9]\)/g, `length(var.SERVERLESS_DOMAIN) > ${name.length+1} && substr(var.SERVERLESS_DOMAIN, 0, ${name.length+1})`, `./infra-as-code/terraform/environments/default/variables.tf`);
  shell.sed('-i', /custom-flex-extensions-serverless/g, `${name}`, `./infra-as-code/terraform/modules/callback-and-voicemail/variables.tf`);
  shell.sed('-i', /length\(var.serverless_domain\) > [0-9][0-9] && substr\(var.serverless_domain, 0, [0-9][0-9]\)/g, `length(var.serverless_domain) > ${name.length+1} && substr(var.serverless_domain, 0, ${name.length+1})`, `./infra-as-code/terraform/modules/callback-and-voicemail/variables.tf`);

  // rename the state service that is in use
  if(shell.test('-e', `./${infraAsCodeDir}/state/config.sh`)){
    shell.sed('-i', /tfstate_service_name=.*/, `tfstate_service_name=tfstate-${packageSuffix}`, `./${infraAsCodeDir}/state/config.sh`);
  }
  
  console.log(`Re-evaluating npm package-lock for ${fullPluginName}...`);
  shell.exec(`npm --prefix ./${fullPluginName} install ./${fullPluginName}`, {silent:true});
  
  shell.echo("");
  shell.echo(`Renaming assets complete, don't forget to re-run: npm install to use locally and to check 'perform initial release' when deploying with github actions`);
  shell.echo("");
}

performRename();