import { getActiveCliProfile } from "./common/get-account.mjs";

const activeProfile = getActiveCliProfile();

if (!activeProfile?.accountSid) {
  console.log('No active profile found.');
} else {
  console.log(activeProfile.accountSid);
}