import * as core from "@actions/core";
import * as fs from "fs";

let inputsObject = JSON.parse(
  fs.readFileSync(process.env.GITHUB_EVENT_PATH!, "utf8")
).inputs;
let allInputKeys = Object.keys(inputsObject);
core.info(`All inputs for this workflow: ${allInputKeys}`);

for (const inputKey of allInputKeys) {
  core.info(`Hiding and exporting value for input: ${inputKey}`);
  core.exportVariable(inputKey, inputsObject[inputKey]);
  core.setSecret(inputsObject[inputKey]);
}
