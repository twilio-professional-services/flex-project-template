import prompt from "prompt";
import shell from "shelljs";

const printProfileWarning = () => {
  console.log("*****     WARNING       *****");
  console.log(`Twilio CLI profile not detected. Please set an active profile with`);
  console.log(`twilio profiles:use <profile-name>`);
}

// Gets and returns the account SID of the active Twilio CLI profile if present
const getActiveCliProfile = () => {
  try {
    const profiles = shell.exec("twilio profiles:list -o json", {silent: true});
    
    if (!profiles) {
      console.warn("Unable to list profiles from the Twilio CLI.");
      printProfileWarning();
      return;
    }
    
    const parsedProfiles = JSON.parse(profiles);
    const activeProfiles = parsedProfiles.filter(profile => profile.active);
    
    if (activeProfiles.length < 1) {
      console.warn("No active Twilio CLI profiles found.");
      printProfileWarning();
      return;
    }

    return activeProfiles[0];
  } catch (error) {
    console.warn("Unable to detect the active Twilio CLI profile.", error);
    printProfileWarning();
    return;
  }
}

// Request the auth token from the user for the provided Twilio CLI profile
const promptForAuthToken = async (profile) => {
  var prompt_schema  = {
    properties: {
      proceed: {
        description: `This script will setup environment variables for the active profile ${profile.id} (${profile.accountSid}) using the Twilio CLI. Do you want to proceed? Y/N`,
        pattern: /(?:^|\W)[YynN](?:$|\W)/,
        message: 'Prompt only accepts Y or N',
        hidden: false,
        required: true,
        ask: function() {
          return profile.accountSid;
        }
      },
      authToken: {
        description: `Please enter the auth token for account ${profile.accountSid}`,
        message: 'Auth token must be provided',
        hidden: true,
        replace: '*',
        required: true,
        ask: function() {
          return prompt.history('proceed') && prompt.history('proceed').value.toLocaleLowerCase() === 'y';
        }
      }
    }
  };
  
  prompt.colors = false;
  prompt.start();
  
  try {
    const result = await prompt.get(prompt_schema);
    console.log(""); // prevent followup logging from appearing on the prompt line
    return result;
  } catch (error) {
    console.warn("Error while prompting for auth token.", error);
  }
}

// Gets and returns credentials for the desired Twilio account
// Returns account SID, API key SID, and API key secret if already defined in the environment (such as in CI)
// Returns account SID and auth token otherwise
export default async () => {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_API_KEY && process.env.TWILIO_API_SECRET) {
    // Environment is providing the account details; skip prompt
    return {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      apiKey: process.env.TWILIO_API_KEY,
      apiSecret: process.env.TWILIO_API_SECRET,
    }
  }
  
  // Get account SID from the active CLI profile
  const activeProfile = getActiveCliProfile();
  
  if (!activeProfile?.accountSid) {
    console.log(`Please run "npm run postinstall" when the correct profile is set.`);
    return;
  }
  
  // Get auth token from the user
  const promptResult = await promptForAuthToken(activeProfile);
  
  // we will abandon the script if the user declined to provide an auth token
  if (!promptResult.proceed || promptResult.proceed.toLowerCase().includes("n") || !promptResult.authToken) {
    console.log(`Okay, abandoning local environment setup script. Please run "npm run postinstall" when the correct profile is set.`);
    return;
  }
  
  return {
    accountSid: activeProfile.accountSid,
    authToken: promptResult.authToken,
  };
}