import shell from "shelljs";

export default (packageDir, skipInstall, uninstall) => {
  if (packageDir && shell.test('-d', packageDir)) {
    shell.cd(`./${packageDir}`);
    
    if (uninstall) {
      console.log(`Uninstalling package ${packageDir}...`);
      shell.rm('-rf', 'node_modules');
      shell.rm('-f', 'package-lock.json');
    }
    
    if (!skipInstall) {
      console.log(`Installing package ${packageDir}...`);
      shell.exec("npm install", {silent:true});
    }
    
    const dirDepth = packageDir.split("/").length;
    for (let i = 0; i < dirDepth; i++) {
      shell.cd("..");
    }
  }
}