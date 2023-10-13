import shell from "shelljs";

import { packagesDir } from "./constants.mjs";

export default () => {
  try {
    return [ ...shell.ls('-d', `${packagesDir}/*/`).map((pkg) => pkg.slice(0, -1)) ];
  } catch (error) {
    console.error(`Unable to fetch packages`, error);
    return [];
  }
}