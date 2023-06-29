const axios = require("axios");
const dotenv = require("dotenv");
const { promises: fs } = require('fs');
const _ = require('lodash');
const { getServerlessServices, populateFlexConfigPlaceholders } = require ('../scripts/common');

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
      TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY,
      TWILIO_API_SECRET,
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

    defaultEnvFileName = './ui_attributes.example.json';
    envFileName = `./ui_attributes.${environment}.json`;
    envExists = await exists(envFileName);

    // first ensure envirnment specific file exists
    if(!envExists){
      try {
        await fs.copyFile(defaultEnvFileName, envFileName)
      } catch (error) {
        console.log(`Error copying file ${defaultEnvFileName} to ${envFileName}: ${error}`);
      }
    }

    // then populate it using the twilio cli
    result = getServerlessServices();
    populateFlexConfigPlaceholders(result, environment);

    console.log(result);

    const uiAttributesOverrides = require(envFileName);
    const uiAttributesCommon = require("./ui_attributes.common.json");
    const taskrouter_skills = require("./taskrouter_skills.json");

    console.log("Getting current configuration...");
    const {
      ui_attributes: uiAttributesCurrent,
      taskrouter_skills: tr_current = "",
    } = await getConfiguration({ auth });

    console.log("Merging current configuraton with new configuration...");
    let uiAttributesMerged;
    if (overwrite && overwrite.toLowerCase() === "true") {
      uiAttributesMerged = _.merge(uiAttributesCurrent, uiAttributesCommon, uiAttributesOverrides);
    } else {
      uiAttributesMerged = _.merge({}, uiAttributesCommon, uiAttributesOverrides, uiAttributesCurrent);
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


    console.log("Configuration updated: (following output formatted for readability)");
    
    var readableFeatures = []
    Object.entries(configurationUpdated.ui_attributes.custom_data.features).forEach( feature => {
      { readableFeatures.push( { name: feature[0], enabled: feature[1].enabled}  )};
    });
    var readableAttributes = configurationUpdated.ui_attributes;
    readableAttributes.custom_data.features = readableFeatures;

    console.log("UI Attributes");
    console.dir(readableAttributes, { depth: null });
    console.log("TaskRouter Skills:");
    configurationUpdated.taskrouter_skills.forEach(element => {
      console.log(`\t${element.name}`);
    })
  } catch (error) {
    console.error("error caught", error);
    console.log("Auth", error.config?.auth);
    console.log("Data", error.response?.data);
  }
}

async function getConfiguration({ auth }) {
  return axios({
    method: "get",
    url: "https://flex-api.twilio.com/v1/Configuration",
    auth: {
      username: auth.TWILIO_API_KEY,
      password: auth.TWILIO_API_SECRET,
    },
  }).then((response) => response.data);
}

async function setConfiguration({ auth, configurationChanges }) {
  return axios({
    method: "post",
    url: "https://flex-api.twilio.com/v1/Configuration",
    auth: {
      username: auth.TWILIO_API_KEY,
      password: auth.TWILIO_API_SECRET,
    },
    data: {
      ...configurationChanges,
      account_sid: auth.TWILIO_ACCOUNT_SID,
    },
  }).then((response) => response.data);
}
