import shell from "shelljs";

export default (packageDir) => {
  if (packageDir && shell.test('-d', packageDir)) {
    console.log(`Installing package ${packageDir}...`);
    shell.cd(`./${packageDir}`)
    shell.exec("npm install", {silent:true});
    const dirDepth = packageDir.split("/").length;
    for (let i = 0; i < dirDepth; i++) {
      shell.cd("..");
    }
  }
}