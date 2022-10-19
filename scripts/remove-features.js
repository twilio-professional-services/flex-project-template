var shell = require("shelljs");
// https://github.com/shelljs/shelljs#shellstringstr

/* note this script is written exclusively for the v2 plugin 
   as most work going forward is expected to be built on flex v2.x
*/
  
const { templateDirectory, featureDirectory, pluginSrc, serverlessSrc } = require ('./common');

const filesToCopy = [
  {
    src: `${templateDirectory}/flex-hooks/actions.ts`,
    dst: `${pluginSrc}/flex-hooks/actions/`,
  },
  {
    src: `${templateDirectory}/flex-hooks/channels.ts`,
    dst: `${pluginSrc}/flex-hooks/channels/`,
  },
  {
    src: `${templateDirectory}/flex-hooks/components.ts`,
    dst: `${pluginSrc}/flex-hooks/components/`,
  },
  {
    src: `${templateDirectory}/flex-hooks/css-overrides.ts`,
    dst: `${pluginSrc}/flex-hooks/css-overrides/`,
  },
  {
    src: `${templateDirectory}/flex-hooks/events.ts`,
    dst: `${pluginSrc}/flex-hooks/events/`,
  },
  {
    src: `${templateDirectory}/flex-hooks/paste-elements.ts`,
    dst: `${pluginSrc}/flex-hooks/paste-elements/`,
  },
  {
    src: `${templateDirectory}/flex-hooks/states.ts`,
    dst: `${pluginSrc}/flex-hooks/states/`,
  },
  {
    src: `${templateDirectory}/flex-hooks/strings.ts`,
    dst: `${pluginSrc}/flex-hooks/strings/`,
  },
  {
    src: `${templateDirectory}/flex-hooks/notifications.ts`,
    dst: `${pluginSrc}/flex-hooks/notifications/`,
  },
  {
    src: `${templateDirectory}/types/CustomServiceConfiguration.ts`,
    dst: `${pluginSrc}/types/manager/`,
  },
];

shell.echo("Clearing flex-hooks of features handlers");
filesToCopy.forEach((files) => {
  shell.echo(`cp ${files.src} -> ${files.dst}`);
  shell.cp(files.src, files.dst);
});

shell.echo(`Deleting ${featureDirectory} folders`);
shell.rm("-rf", `${featureDirectory}/*`);

shell.echo(
  `Deleting ${serverlessSrc} functions and asserts feature folders`
);
shell.rm("-rf", `${serverlessSrc}/functions/features/*`);
shell.rm("-rf", `${serverlessSrc}/assets/features/*`);
