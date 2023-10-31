import shell from "shelljs";
import { promises as fs } from 'fs';

import { serverlessSrc, flexConfigDir, infraAsCodeDir, terraformDir } from './common/constants.mjs';
import getPluginDirs from "./common/get-plugin.mjs";

const { featureDirectory } = getPluginDirs();

const featureRegionReferences = [
  {
    filename: `${infraAsCodeDir}/state/import_internal_state.sh`,
    features: ["remove-all", "callback-and-voicemail", "schedule-manager", "activity-reservation-handler", "conversation-transfer", "internal-call"]
  },
  {
    filename: `${terraformDir}/environments/default/example.tfvars`,
    features: [ "callback-and-voicemail", "schedule-manager"],
  },
  {
    filename: `${terraformDir}/environments/default/main.tf`,
    features: [ "callback-and-voicemail", "schedule-manager", "conversation-transfer", "internal-call", "remove-all"],
  },
  {
    filename: `${terraformDir}/environments/default/outputs.tf`,
    features: [ "remove-all", "callback-and-voicemail", "schedule-manager"],
  },
  {
    filename: `${terraformDir}/environments/default/variables.tf`,
    features: [ "callback-and-voicemail", "schedule-manager"],
  },
  {
    filename: `${terraformDir}/modules/studio/main.tf`,
    features: [ "remove-all", "callback-and-voicemail", "schedule-manager"],
  },
  {
    filename: `${terraformDir}/modules/studio/outputs.tf`,
    features: [ "remove-all", "callback-and-voicemail", "schedule-manager"],
  },
  {
    filename: `${terraformDir}/modules/studio/variables.tf`,
    features: [ "callback-and-voicemail", "schedule-manager", "internal-call", "conversation-transfer", "remove-all"],
  },
  {
    filename: `${terraformDir}/modules/taskrouter/activities.tf`,
    features: [ "activity-reservation-handler"],
  },
  {
    filename: `${terraformDir}/modules/taskrouter/outputs.tf`,
    features: [ "conversation-transfer", "callback-and-voicemail", "internal-call", "remove-all"],
  },
  {
    filename: `${terraformDir}/modules/taskrouter/task_queues.tf`,
    features: [ "remove-all", "internal-call"],
  },
  {
    filename: `${terraformDir}/modules/taskrouter/workflows.tf`,
    features: [ "internal-call", "conversation-transfer", "callback-and-voicemail", "remove-all" ],
  }
];

const flexConfigRemovals = [
  `${flexConfigDir}/ui_attributes.common.json`,
  `${flexConfigDir}/ui_attributes.example.json`,
];

let keepFeatures = [];

const performFeatureRegionRemoval = async () => {
  shell.echo("Removing features from GitHub Actions workflows...");

  if(keepFeatures.length > 0){
    keepFeatures.push("remove-all")
  }
  
  await Promise.all(featureRegionReferences.map(async (reference) => {
    try {
      const originalData = await fs.readFile(reference.filename, "utf8");
      let newData = originalData;
      
      for (const feature of reference.features) {
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
      
      await fs.writeFile(reference.filename, newData, 'utf8');
      shell.echo(`Updated ${reference.filename}`);
    } catch (error) {
      shell.echo(`Failed to update ${reference.filename}: ${error}`);
    }
  }));
}

const performFlexConfigRemovals = async () => {
  shell.echo("Removing features from flex-config...");
  try {
    for (const configFile of flexConfigRemovals) {
      try {
        const originalData = await fs.readFile(configFile, "utf8");
        let jsonData = JSON.parse(originalData);
        for (const key of Object.keys(jsonData?.custom_data?.features)) {
          // The config name for a feature uses underscores instead of hyphens
          const featureDirName = key.replace(/_/g, '-');
          if (!keepFeatures.includes(featureDirName)) {
            delete jsonData.custom_data.features[key];
          }
        }
        await fs.writeFile(configFile, JSON.stringify(jsonData, null, 2), 'utf8');
        shell.echo(`Updated ${configFile}`);
     } catch (error) {
      shell.echo(`Failed to update ${configFile}: ${error}`);
     }
    }
  } catch (error) {
    shell.echo(`Failed to update config files: ${error}`);
  }
}

const performDirectoryRemovals = (baseDir) => {
  try {
    const featureDirs = shell.ls(baseDir);
    
    for (const feature of featureDirs) {
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
  await performFeatureRegionRemoval();
  
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
      `Deleting schedule-manager serverless package addons/serverless-schedule-manager...`
    );
    shell.rm("-rf", `addons/serverless-schedule-manager`);
  }
  
  if (!keepFeatures.includes("chat-to-video-escalation")) {
    shell.echo(
      `Deleting addons/twilio-video-demo-app...`
    );
    shell.rm("-rf", `addons/twilio-video-demo-app`);
  }

  // if we are removing everything we need want to
  // remove the terraform assets
  if(keepFeatures.length === 0){
    shell.echo(
      `Deleting managed terraform assets for studio and taskrouter`
    );
    shell.rm("-rf", `${terraformDir}/studio/*`)
    shell.rm("-rf", `${terraformDir}/taskrouter/*`)
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
