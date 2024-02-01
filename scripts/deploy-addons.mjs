import shell from "shelljs";

import getAddonsDirs from "./common/get-addons.mjs";

// get list of addons
const addons = getAddonsDirs();

// deploy addons
for (const addon of addons) {
  console.log(`Deploying ${addon}...`);
  shell.cd(addon);
  shell.exec('npm run deploy');
  shell.cd('../..');
}