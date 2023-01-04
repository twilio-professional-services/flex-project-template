var shell = require("shelljs");
// https://github.com/shelljs/shelljs#shellstringstr

/* note this script is written exclusively for the v2 plugin 
   as most work going forward is expected to be built on flex v2.x
*/
  
const { serverlessSrc, flexConfigDir, flexConfigTemplateDir, scheduleManagerServerlessDir } = require ('./common');

// defaulting to plugin v2 for just now
var { setPluginName, getPaths } = require("./select-plugin");
const { pluginSrc, templateDirectory, featureDirectory} = getPaths("v2");


const filesToCopy = [
  {
    src: `${templateDirectory}/no-features/flex-hooks/actions.ts`,
    dst: `${pluginSrc}/flex-hooks/actions/`,
  },
  {
    src: `${templateDirectory}/no-features/flex-hooks/channels.ts`,
    dst: `${pluginSrc}/flex-hooks/channels/`,
  },
  {
    src: `${templateDirectory}/no-features/flex-hooks/components.ts`,
    dst: `${pluginSrc}/flex-hooks/components/`,
  },
  {
    src: `${templateDirectory}/no-features/flex-hooks/css-overrides.ts`,
    dst: `${pluginSrc}/flex-hooks/css-overrides/`,
  },
  {
    src: `${templateDirectory}/no-features/flex-hooks/events.ts`,
    dst: `${pluginSrc}/flex-hooks/events/`,
  },
  {
    src: `${templateDirectory}/no-features/flex-hooks/paste-elements.ts`,
    dst: `${pluginSrc}/flex-hooks/paste-elements/`,
  },
  {
    src: `${templateDirectory}/no-features/flex-hooks/states.ts`,
    dst: `${pluginSrc}/flex-hooks/states/`,
  },
  {
    src: `${templateDirectory}/no-features/flex-hooks/strings.ts`,
    dst: `${pluginSrc}/flex-hooks/strings/`,
  },
  {
    src: `${templateDirectory}/no-features/flex-hooks/notifications.ts`,
    dst: `${pluginSrc}/flex-hooks/notifications/`,
  },
  {
    src: `${templateDirectory}/no-features/flex-hooks/filters.ts`,
    dst: `${pluginSrc}/flex-hooks/teams-filters/`,
  },
  {
    src: `${templateDirectory}/no-features/flex-hooks/jsclient-event-listeners/index.ts`,
    dst: `${pluginSrc}/flex-hooks/jsclient-event-listeners/`,
  },
  {
    src: `${templateDirectory}/no-features/flex-hooks/jsclient-event-listeners/voice-client/*`,
    dst: `${pluginSrc}/flex-hooks/jsclient-event-listeners/voice-client/`,
  },
  {
    src: `${templateDirectory}/no-features/flex-hooks/jsclient-event-listeners/worker-client/*`,
    dst: `${pluginSrc}/flex-hooks/jsclient-event-listeners/worker-client/`,
  },
  {
    src: `${templateDirectory}/no-features/types/CustomServiceConfiguration.ts`,
    dst: `${pluginSrc}/types/manager/`,
  },
  {
    src: `${flexConfigTemplateDir}/*.json`,
    dst: `${flexConfigDir}/`
  },
  {
    src: `./.github/template_files/*.yaml`,
    dst: './.github/workflows/'
  }
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

shell.echo(
  `Deleting schedule-manager serverless package ${scheduleManagerServerlessDir}`
);
shell.rm("-rf", `${scheduleManagerServerlessDir}`);
