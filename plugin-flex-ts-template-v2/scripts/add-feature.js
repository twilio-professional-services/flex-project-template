var shell = require("shelljs");
// https://github.com/shelljs/shelljs#shellstringstr

const featureName = process.argv.slice(2)[0];

// todo - sanity check no invalid characters
if (!featureName) {
  shell.echo("Error: please provide the name of the feature as an argument");
  shell.exit(1);
}

const pathToFeatureLibrary = `src/feature-library/${featureName}`;
shell.mkdir(pathToFeatureLibrary);
shell.cp("-r", "template-files/new-feature/*", pathToFeatureLibrary);

shell.echo("Copied new feature template files to", pathToFeatureLibrary);
