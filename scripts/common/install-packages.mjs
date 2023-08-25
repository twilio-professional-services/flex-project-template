import shell from "shelljs";

import * as constants from "./constants.mjs";
import getPluginDirs from "./get-plugin.mjs";

const installNpmPackage = (packageDir) => {
  if (packageDir && shell.test('-d', packageDir)) {
    console.log(`Installing package dependencies for ${packageDir}...`);
    shell.cd(`./${packageDir}`)
    shell.exec("npm install", {silent:true});
    const dirDepth = packageDir.split("/").length;
    for (let i = 0; i < dirDepth; i++) {
      shell.cd("..");
    }
  }
}

export const installAllPackages = () => {
  installNpmPackage(getPluginDirs().pluginDir);
  installNpmPackage(constants.serverlessDir);
  installNpmPackage(constants.scheduleManagerServerlessDir);
  installNpmPackage(constants.flexConfigDir);
  installNpmPackage(constants.videoAppDir);
}

export const buildVideoApp = () => {
  if (shell.test('-d', constants.videoAppDir)) {
    console.log("Building assets for video app quickstart...");
    shell.cd(`./${constants.videoAppDir}`);
    shell.exec("npm run build", {silent:true});
    shell.cd("../..");
  }
}