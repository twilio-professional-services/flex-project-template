import shell from "shelljs";
import { execFileSync } from "child_process";

import getPackageDirs from "./common/get-packages.mjs";

// get list of packages
const packages = getPackageDirs();

// install packages (generate env, install deps, run postinstall)
execFileSync('npm', [ 'run', 'postinstall', '--', `--packages=${packages.join(',')}` ], { stdio: 'inherit' });

// deploy packages
for (const pkg of packages) {
  console.log(`Deploying ${pkg}...`);
  shell.cd(pkg);
  shell.exec('npm run deploy');
  shell.cd('../..');
}