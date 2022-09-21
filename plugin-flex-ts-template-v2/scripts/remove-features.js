const { forEach } = require("lodash");
var shell = require("shelljs");
// https://github.com/shelljs/shelljs#shellstringstr

const templateDirectory = "template-files/no-features/";
const srcDirctory = "src/";

const filesToCopy = [
  {
    src: templateDirectory + "flex-hooks/actions.ts",
    dst: srcDirctory + "flex-hooks/actions/",
  },
  {
    src: templateDirectory + "flex-hooks/channels.ts",
    dst: srcDirctory + "flex-hooks/channels/",
  },
  {
    src: templateDirectory + "flex-hooks/components.ts",
    dst: srcDirctory + "flex-hooks/components/",
  },
  {
    src: templateDirectory + "flex-hooks/css-overrides.ts",
    dst: srcDirctory + "flex-hooks/overrides/",
  },
  {
    src: templateDirectory + "flex-hooks/events.ts",
    dst: srcDirctory + "flex-hooks/events/",
  },
];

shell.echo("Clearing flex-hooks of features handlers");
filesToCopy.forEach((files) => {
  shell.echo(`cp ${files.src} -> ${files.dst}`);
  shell.cp(files.src, files.dst);
});

// TODO - delete folders from features-library
