import axios from 'axios';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';
import merge from 'lodash/merge.js';

import { fillReplacementsForString } from "../scripts/common/fill-replacements.mjs";
import printReplacements from "../scripts/common/print-replacements.mjs";

async function exists (path) {  
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}

(async () => {

  dotenv.config();

  [
    "ENVIRONMENT",
    "TWILIO_ACCOUNT_SID",
    "TWILIO_API_KEY",
    "TWILIO_API_SECRET",
  ].forEach((requiredEnvVar) => {
    if (!process.env[requiredEnvVar]) {
      throw new Error(`Missing env var "${requiredEnvVar}"`);
    }
  });

  const { ENVIRONMENT, TWILIO_ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET, OVERWRITE_CONFIG } =
    process.env;

  deployConfigurationData({
    auth: {
      accountSid: TWILIO_ACCOUNT_SID,
      apiKey: TWILIO_API_KEY,
      apiSecret: TWILIO_API_SECRET,
    },
    environment: ENVIRONMENT,
    overwrite: OVERWRITE_CONFIG,
  });
})();

Array.prototype.unique = function () {
  var a = this.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i].name === a[j].name) a.splice(j--, 1);
    }
  }

  return a;
};

async function deployConfigurationData({ auth, environment, overwrite }) {
  try {
    const commonFileName = './ui_attributes.common.json';
    const defaultEnvFileName = './ui_attributes.example.json';
    const envFileName = `./ui_attributes.${environment}.json`;
    const skillsFileName = './taskrouter_skills.json';
    const envExists = await exists(envFileName);

    // first ensure environment specific file exists
    if(!envExists){
      try {
        await fs.copyFile(defaultEnvFileName, envFileName)
      } catch (error) {
        console.log(`Error copying file ${defaultEnvFileName} to ${envFileName}: ${error}`);
      }
    }

    const uiAttributesEnvFile = await fs.readFile(new URL(envFileName, import.meta.url), 'utf8');
    const uiAttributesCommonFile = await fs.readFile(new URL(commonFileName, import.meta.url), 'utf8');
    const taskrouter_skills = JSON.parse(await fs.readFile(new URL(skillsFileName, import.meta.url), 'utf8'));
    
    console.log("Populating environmental configuration data...");
    const uiAttributesEnvReplaced = await fillReplacementsForString(uiAttributesEnvFile, auth, environment);
    const uiAttributesCommonReplaced = await fillReplacementsForString(uiAttributesCommonFile, auth, environment);
    
    printReplacements({
      ...uiAttributesCommonReplaced.envVars,
      ...uiAttributesEnvReplaced.envVars,
    });

    console.log("Getting current configuration...");
    const {
      ui_attributes: uiAttributesCurrent,
      taskrouter_skills: tr_current = "",
    } = await getConfiguration({ auth });

    console.log("Merging current configuraton with new configuration...");
    let uiAttributesMerged;
    const uiAttributesEnvJson = JSON.parse(uiAttributesEnvReplaced.data);
    const uiAttributesCommonJson = JSON.parse(uiAttributesCommonReplaced.data);
    if (overwrite && overwrite.toLowerCase() === "true") {
      // when overwriting, clear out the existing custom_data object to remove obsolete values
      delete uiAttributesCurrent.custom_data;
      uiAttributesMerged = merge(uiAttributesCurrent, uiAttributesCommonJson, uiAttributesEnvJson);
    } else {
      uiAttributesMerged = merge({}, uiAttributesCommonJson, uiAttributesEnvJson, uiAttributesCurrent);
    }
    const trskillsMerged = tr_current
      ? tr_current.concat(taskrouter_skills).unique()
      : taskrouter_skills;

    console.log("Updating configuration...");
    const configurationUpdated = await setConfiguration({
      auth,
      configurationChanges: {
        ui_attributes: uiAttributesMerged,
        taskrouter_skills: trskillsMerged,
      },
    });


    console.log("Configuration updated.");
    console.log("");
    
    var readableFeatures = []
    Object.entries(configurationUpdated.ui_attributes.custom_data.features).forEach( feature => {
      { readableFeatures.push( { name: feature[0], enabled: feature[1].enabled}  )};
    });
    var readableAttributes = configurationUpdated.ui_attributes;
    readableAttributes.custom_data.features = readableFeatures;

    console.log("### UI attributes (reduced for readability):");
    console.log("```");
    console.dir(readableAttributes.custom_data, { depth: null });
    console.log("```");
    console.log("");
    console.log("### TaskRouter skills:");
    configurationUpdated.taskrouter_skills.forEach(element => {
      console.log(`- ${element.name}`);
    })
  } catch (error) {
    console.error("Error caught:", error);
    console.log("Auth", error.config?.auth);
    console.log("Data", error.response?.data);
  }
}

async function getConfiguration({ auth }) {
  return axios({
    method: "get",
    url: "https://flex-api.twilio.com/v1/Configuration",
    auth: {
      username: auth.apiKey,
      password: auth.apiSecret,
    },
  }).then((response) => response.data);
}

async function setConfiguration({ auth, configurationChanges }) {
  return axios({
    method: "post",
    url: "https://flex-api.twilio.com/v1/Configuration",
    auth: {
      username: auth.apiKey,
      password: auth.apiSecret,
    },
    data: {
      ...configurationChanges,
      account_sid: auth.accountSid,
    },
  }).then((response) => response.data);
}
