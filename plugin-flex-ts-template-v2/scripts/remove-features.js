var shell = require("shelljs");
// https://github.com/shelljs/shelljs#shellstringstr

const templateDirectory = "template-files/no-features/";
const featureDirectory = "src/feature-library/";
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
    dst: srcDirctory + "flex-hooks/css-overrides/",
  },
  {
    src: templateDirectory + "flex-hooks/events.ts",
    dst: srcDirctory + "flex-hooks/events/",
  },
  {
    src: templateDirectory + "flex-hooks/paste-elements.ts",
    dst: srcDirctory + "flex-hooks/paste-elements/",
  },
  {
    src: templateDirectory + "flex-hooks/states.ts",
    dst: srcDirctory + "flex-hooks/states/",
  },
  {
    src: templateDirectory + "flex-hooks/strings.ts",
    dst: srcDirctory + "flex-hooks/strings/",
  },
  {
    src: templateDirectory + "flex-hooks/notifications.ts",
    dst: srcDirctory + "flex-hooks/notifications/",
  },
  {
    src: templateDirectory + "types/CustomServiceConfiguration.ts",
    dst: srcDirctory + "types/manager/",
  },
];

shell.echo("Clearing flex-hooks of features handlers");
filesToCopy.forEach((files) => {
  shell.echo(`cp ${files.src} -> ${files.dst}`);
  shell.cp(files.src, files.dst);
});

shell.echo(`Deleting ${featureDirectory} folders`);
shell.rm("-rf", `${featureDirectory}/*`);
