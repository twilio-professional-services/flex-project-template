const axios = require('axios');
const dotenv = require('dotenv');

const uiAttributesDev = require('./dev.ui_attributes.json');
const uiAttributesTest = require('./test.ui_attributes.json');
const uiAttributesQa = require('./qa.ui_attributes.json');
const uiAttributesProd = require('./prod.ui_attributes.json');
const taskrouter_skills = require('./taskrouter_skills.json');

dotenv.config();

const uiAttributesEnvMap = {
  dev: uiAttributesDev,
  test: uiAttributesTest,
  qa: uiAttributesQa,
  prod: uiAttributesProd,
};

;(async () => {
  [
    'ENVIRONMENT',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_API_KEY',
    'TWILIO_API_SECRET',
  ].forEach(requiredEnvVar => {
    if (!process.env[requiredEnvVar]) {
      throw new Error(`Missing env var "${requiredEnvVar}"`);
    }
  });

  const {
    ENVIRONMENT,
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY,
    TWILIO_API_SECRET,
  } = process.env;

  deployConfigurationData({
    auth: {
      TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY,
      TWILIO_API_SECRET,
    },
    environment: ENVIRONMENT,
  });
})();

Array.prototype.unique = function() {
  var a = this.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i].name === a[j].name)
              a.splice(j--, 1);
      }
  }

  return a;
};

async function deployConfigurationData({ auth, environment }) {
  try {
    const uiAttributes = uiAttributesEnvMap[environment];

    console.log('Getting current configuration...');
    const { ui_attributes: uiAttributesCurrent, taskrouter_skills: tr_current } = await getConfiguration({ auth });
    console.log('Merging current configuraton with new configuration...');
    const uiAttributesMerged = {...uiAttributesCurrent, ...uiAttributes};
    const trskillsMerged = tr_current.concat(taskrouter_skills).unique();

    console.log('Updating configuration...');
    const configurationUpdated = await setConfiguration({
      auth,
      configurationChanges: {
        ui_attributes: uiAttributesMerged,
        taskrouter_skills: trskillsMerged
      },
    });

    console.log('Configuration updated to:');
    console.log(configurationUpdated);
  } catch (error) {
    console.log('Auth', error.config?.auth);
    console.log('Data', error.response?.data);
  }
}

async function getConfiguration({ auth }) {
  return axios({
    method: 'get',
    url: 'https://flex-api.twilio.com/v1/Configuration',
    auth: {
      username: auth.TWILIO_API_KEY,
      password: auth.TWILIO_API_SECRET,
    },
  }).then(response => response.data);
}

async function setConfiguration({ auth, configurationChanges }) {
  return axios({
    method: 'post',
    url: 'https://flex-api.twilio.com/v1/Configuration',
    auth: {
      username: auth.TWILIO_API_KEY,
      password: auth.TWILIO_API_SECRET,
    },
    data: {
      ...configurationChanges,
      account_sid: auth.TWILIO_ACCOUNT_SID,
    },
  }).then(response => response.data);
}
