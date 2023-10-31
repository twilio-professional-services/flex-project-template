import shell from "shelljs";

import { addonsDir } from "./constants.mjs";

export default () => {
  try {
    return [ ...shell.ls('-d', `${addonsDir}/*/`).map((pkg) => pkg.slice(0, -1)) ];
  } catch (error) {
    console.error(`Unable to fetch addons`, error);
    return [];
  }
}