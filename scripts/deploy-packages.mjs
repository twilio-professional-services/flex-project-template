import shell from "shelljs";

import getPackageDirs from "./common/get-packages.mjs";

// get list of packages
const packages = getPackageDirs();

// deploy packages
for (const pkg of packages) {
  console.log(`Deploying ${pkg}...`);
  shell.cd(pkg);
  shell.exec('npm run deploy');
  shell.cd('../..');
}