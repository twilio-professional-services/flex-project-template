var shell = require("shelljs");
// https://github.com/shelljs/shelljs#shellstringstr

shell.echo("cp template-files/actions.ts -> src/flex-hooks/actions");
shell.cp(
  "template-files/no-features/flex-hooks/actions/actions.ts",
  "src/flex-hooks/actions/"
);

// TODO - delete folders from features-library
