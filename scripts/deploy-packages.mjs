import shell from "shelljs";

import getPackageDirs from "./common/get-packages.mjs";

// get list of packages
const packages = getPackageDirs();

// install packages (generate env, install deps, run postinstall)
shell.exec(`npm run postinstall -- --packages=${packages.join(',')}`);

// deploy packages
for (const pkg of packages) {
  console.log(`Deploying ${pkg}...`);
  shell.cd(pkg);
  shell.exec('npm run deploy');
  shell.cd('../..');
}