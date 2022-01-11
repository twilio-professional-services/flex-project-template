import { Resource } from 'twilio-pulumi-provider';

import { readdirSync } from 'fs';

export const applyResourcesFromDirectory = (path: string, sufix: string, references?: any) => {

    let output: any = {};

    const workspaces = readdirSync(path);

    for (let i = 0; i < workspaces.length; i++) {

        const file = workspaces[i];
        const name = file.replace(".ts", "");

        const description = require(`${path}/${file}`)
        output[name] = new Resource(`${name}-${sufix}`, description.default(references));

    }

    return output;

}

export const initDescription = (description: any) => {

    const keys = Object.keys(description);
    const values = Object.values(description);

    let output: any = {};

    for (let i = 0; i < keys.length; i++) {

        const { path, sufix }: any = values[i];

        output[keys[i]] = applyResourcesFromDirectory(path, sufix, output);

    }

    return output;

}
