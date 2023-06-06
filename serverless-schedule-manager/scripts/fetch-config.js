const fs = require('fs');
const homedir = require('os').homedir();

const axios = require('axios').default;

const { getServerlessServices } = require('../../scripts/common');

if (!process.argv[2]) {
  throw new Error('Please provide an output path');
}

let apiKey = process.env.TWILIO_API_KEY;
let apiSecret = process.env.TWILIO_API_SECRET;
if (!apiKey || !apiSecret) {
  // Fall back to Twilio CLI profile if present
  try {
    const profileConfig = JSON.parse(fs.readFileSync(`${homedir}/.twilio-cli/config.json`, 'utf8'));
    if (profileConfig.activeProject && profileConfig.profiles) {
      const profile = profileConfig.profiles[profileConfig.activeProject];

      if (profile) {
        apiKey = profile.apiKey;
        apiSecret = profile.apiSecret;
      }
    }
  } catch (error) {
    console.log(error);
  }

  if (!apiKey || !apiSecret) {
    throw new Error('Please set the TWILIO_API_KEY and TWILIO_API_SECRET environment variables');
  }
}

let domain = '';
const outputPath = process.argv[2];
const environment = process.argv[3];

console.log('Fetching serverless domain...');

if (environment) {
  // First, attempt to get domain via flex-config
  try {
    const flexConfig = JSON.parse(fs.readFileSync(`../flex-config/ui_attributes.${environment}.json`, 'utf8'));
    const configDomain = flexConfig?.custom_data?.features?.schedule_manager?.serverless_domain;

    if (configDomain && configDomain.includes('twil.io')) {
      domain = configDomain;
    }
  } catch (error) {
    console.log('Unable to read from flex-config, fetching domain via API...', error);
  }
}

if (!domain) {
  // Fall back to fetching domain via API
  domain = getServerlessServices()?.scheduledFunctionsDomain;
}

console.log('Fetching latest deployed config...');

if (domain) {
  axios
    .get(`https://${domain}/admin/fetch-config?apiKey=${apiKey}&apiSecret=${apiSecret}`)
    .then((response) => {
      fs.writeFileSync(outputPath, JSON.stringify(response.data, null, 2), 'utf8');
      console.log(`Saved latest deployed config to ${outputPath}`);
    })
    .catch((error) => {
      if (error?.response?.status === 404) {
        // A 404 indicates this serverless domain exists, but is an older version without the fetch-config function
        // Continue, otherwise we will never deploy the updated service!
        console.log(
          'Unable to fetch data, as the service exists but the fetch-config function is not present. Ensure your local config is up-to-date before deploying.',
        );
      } else {
        console.log('Unable to fetch data', error);
        throw new Error(`Received an error when attempting to fetch the latest config`);
      }
    });
} else {
  console.log('Existing serverless domain not found; assuming new deployment');
}
