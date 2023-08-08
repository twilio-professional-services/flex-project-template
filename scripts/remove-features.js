var shell = require("shelljs");
// https://github.com/shelljs/shelljs#shellstringstr
var fs = require("fs").promises;

const { serverlessSrc, flexConfigDir, gitHubWorkflowDir, scheduleManagerServerlessDir } = require ('./common');

var { getPaths } = require("./select-plugin");
const { featureDirectory} = getPaths();

const gitHubWorkflowRemovals = [
  {
    filename: `${gitHubWorkflowDir}/checks.yaml`,
    features: [ "schedule-manager" ],
  },
  {
    filename: `${gitHubWorkflowDir}/flex_deploy.yaml`,
    features: [ "chat-to-video-escalation", "schedule-manager" ],
  },
];

const flexConfigRemovals = [
  `${flexConfigDir}/ui_attributes.common.json`,
  `${flexConfigDir}/ui_attributes.example.json`,
];

let keepFeatures = [];

const performGitHubWorkflowRemovals = async () => {
  shell.echo("Removing features from GitHub Actions workflows...");
  
  await Promise.all(gitHubWorkflowRemovals.map(async (workflow) => {
    try {
      const originalData = await fs.readFile(workflow.filename, "utf8");
      let newData = originalData;
      
      for (const feature of workflow.features) {
        if (keepFeatures.includes(feature)) {
          continue;
        }
        
        const startString = `# FEATURE: ${feature}`;
        const endString = `# END FEATURE: ${feature}`;
        let startIndex = newData.indexOf(startString);
        let endIndex = newData.indexOf(endString, startIndex);
        
        while (startIndex >= 0 && endIndex >= 0) {
          // Remove the section from the beginning of the start string to the end of the end string (plus trailing line break)
          newData = newData.substring(0, startIndex) + newData.substring(endIndex + endString.length + 1);
          
          // find the next occurrence!
          startIndex = newData.indexOf(startString);
          endIndex = newData.indexOf(endString, startIndex);
        }
      }
      
      await fs.writeFile(workflow.filename, newData, 'utf8');
      shell.echo(`Updated ${workflow.filename}`);
    } catch (error) {
      shell.echo(`Failed to update ${workflow.filename}: ${error}`);
    }
  }));
}

const performFlexConfigRemovals = async () => {
  shell.echo("Removing features from flex-config...");
  try {
    for (configFile of flexConfigRemovals) {
      const originalData = await fs.readFile(configFile, "utf8");
      let jsonData = JSON.parse(originalData);
      for (key of Object.keys(jsonData?.custom_data?.features)) {
        // The config name for a feature uses underscores instead of hyphens
        const featureDirName = key.replace(/_/g, '-');
        if (!keepFeatures.includes(featureDirName)) {
          delete jsonData.custom_data.features[key];
        }
      }
      await fs.writeFile(configFile, JSON.stringify(jsonData, null, 2), 'utf8');
      shell.echo(`Updated ${configFile}`);
    }
  } catch (error) {
    shell.echo(`Failed to update ${configFile}: ${error}`);
  }
}

const performDirectoryRemovals = (baseDir) => {
  try {
    const featureDirs = shell.ls(baseDir);
    
    for (feature of featureDirs) {
      if (!keepFeatures.includes(feature)) {
        shell.rm('-rf', `${baseDir}/${feature}`);
        shell.echo(`Removed ${baseDir}/${feature}`);
      }
    }
  } catch (error) {
    shell.echo(`Failed to remove directory: ${error}`);
  }
}

const performRemovals = async () => {
  await performGitHubWorkflowRemovals();
  
  await performFlexConfigRemovals();
  
  shell.echo(`Removing plugin features from ${featureDirectory}...`);
  performDirectoryRemovals(featureDirectory);
  
  shell.echo(
    `Removing serverless functions and assets feature folders from ${serverlessSrc}...`
  );
  performDirectoryRemovals(`${serverlessSrc}/functions/features`);
  performDirectoryRemovals(`${serverlessSrc}/assets/features`);
  
  if (!keepFeatures.includes("schedule-manager")) {
    shell.echo(
      `Deleting schedule-manager serverless package ${scheduleManagerServerlessDir}...`
    );
    shell.rm("-rf", `${scheduleManagerServerlessDir}`);
  }
  
  if (!keepFeatures.includes("chat-to-video-escalation")) {
    shell.echo(
      `Deleting web-app-examples...`
    );
    shell.rm("-rf", `web-app-examples`);
  }
  
  shell.echo("Done!");
}

const parseArgs = (args) => {
  // node scripts/remove-features.js
  // node scripts/remove-features.js except feat1 feat2 featX
  if (args.length < 4 || (args.length > 3 && args[2] !== "except")) {
    // no features specified to remove or incorrect args format
    shell.echo("Removing all features...");
    return;
  }
  
  keepFeatures = args.slice(3);
  
  shell.echo(`Removing all features except ${keepFeatures.join(", ")}...`);
}

parseArgs(process.argv);
performRemovals();
