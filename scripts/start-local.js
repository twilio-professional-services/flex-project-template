const shell = require("shelljs");
var { setPluginName, getPaths } = require("./select-plugin");

const plugin = process.argv[2]

setPluginName(plugin)
const paths = getPaths();

shell.cd(`${paths.pluginDir}`);
shell.exec("twilio flex:plugins:start");
