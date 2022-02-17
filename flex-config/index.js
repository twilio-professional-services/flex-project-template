const yargs = require('yargs');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');
const lodash = require('lodash');

const argv = yargs
  .option('env', {
    description: 'Relative path for file containing environment variables',
    type: 'string'
  })
  .option('taskrouter_skills', {
    description: 'Relative path for file containing taskrouter_skills array',
    type: 'string'
  })
  .option('ui_attributes', {
    description: 'Relative path for file containing ui_attributes object',
    type: 'string'
  })
  .argv;

if (argv.env && argv.ui_attributes && argv.taskrouter_skills) {
  dotenv.config({
    path: path.resolve(process.cwd(), argv.env)
  });
  deployConfigurationData();
}

async function deployConfigurationData() {
  try {
    const ui_attributes = require(path.resolve(process.cwd(), argv.ui_attributes));
    const taskrouter_skills = require(path.resolve(process.cwd(), argv.taskrouter_skills));
    const currentConfigration = (await getConfiguration()).ui_attributes;
    const merged_ui_attributes = lodash.merge({}, currentConfigration, ui_attributes)
    const updatedConfiguration = await setConfiguration({
      ui_attributes: merged_ui_attributes,
      taskrouter_skills
    });
    console.log(updatedConfiguration);
  } catch (error) {
    console.log(error);
  }
}

async function getConfiguration() {
  return axios({
    method: 'get',
    url: 'https://flex-api.twilio.com/v1/Configuration',
    auth: {
      username: process.env.TWILIO_ACCOUNT_SID,
      password: process.env.TWILIO_AUTH_TOKEN
    }
  }).then(response => response.data);
}

async function setConfiguration(configuration) {
  return axios({
    method: 'post',
    url: 'https://flex-api.twilio.com/v1/Configuration',
    auth: {
      username: process.env.TWILIO_ACCOUNT_SID,
      password: process.env.TWILIO_AUTH_TOKEN
    },
    data: {
      ...configuration,
      account_sid: process.env.TWILIO_ACCOUNT_SID
    }
  }).then(response => response.data);
}