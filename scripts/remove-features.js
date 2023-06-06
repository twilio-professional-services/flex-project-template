var shell = require("shelljs");
// https://github.com/shelljs/shelljs#shellstringstr

const { serverlessSrc, flexConfigDir, flexConfigTemplateDir, scheduleManagerServerlessDir } = require ('./common');

var { getPaths } = require("./select-plugin");
const { featureDirectory} = getPaths();


const filesToCopy = [
  {
    src: `${flexConfigTemplateDir}/*.json`,
    dst: `${flexConfigDir}/`
  },
  {
    src: `./.github/template_files/*.yaml`,
    dst: './.github/workflows/'
  }
];

shell.echo("Updating files");
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

shell.echo(
  `Deleting web-app-examples`
);
shell.rm("-rf", `web-app-examples`);
