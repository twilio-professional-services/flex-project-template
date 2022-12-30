const shell = require("shelljs");
var { getPaths } = require("./select-plugin");

const plugin = process.argv[2]

const paths = getPaths(plugin);

shell.cd(`${paths.pluginDir}`);
shell.exec("twilio flex:plugins:start");
