const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const {globSync} = require('glob');
const fs = require('fs');
const mime = require('mime-types');
const YAML = require('yaml');

main(argv);

async function main(args = argv) {
    const {
        _,
        servicesRoot,
        outDir,
    } = args;

    if (_.includes('help')) {
        console.log('help wanted');
        return;
    }

    try {
        checkPath(servicesRoot)
        outDir && checkPath(outDir)

        process.chdir(servicesRoot);

        const slsProjects = (await detectServerlessProjects(process.cwd()))
            .map((p) => new ServerlessProject({projectRoot: p}));

        const manifests = slsProjects ? slsProjects.map((proj) => proj.genManifest()) : [];

        fs.writeFileSync(
            path.join(outDir || process.cwd(), 'services-manifest.yaml'),
            YAML.stringify(manifests)
        );
    } catch (err) {
        console.error(err);
    }
}

class ServerlessProject {
    constructor({projectRoot}) {
        this.projectRoot = projectRoot;
        this.functionsFolder = 'functions';
    }

    detectFiles(folder, extension = null, serverlessPath = null) {
        const filesList = globSync(path.join(folder, `/**/*${extension ? `.${extension}` : '.*'}`))
            .map((f) => {
                const filename = f.split(`${folder}/`).at(-1);
                const functionPath = serverlessPath ? `${serverlessPath}/${filename}` : filename;
                const content_type = mime.lookup(f.split('.').slice(-1)[0]) || 'text/plain';

                return {
                    source: f,
                    visibility: this.detectFileVisibility(f),
                    content_type,
                    path: functionPath,
                    friendly_name: functionPath,
                };
            });
        return new Map(filesList.map((f) => [f.friendly_name, f]));
    }

    get functions() {
        return this.detectFiles(path.join(this.projectRoot, this.functionsFolder), 'js');
    }

    get assetsFolder() {
        // getting the assetsFolder field from .twilioserverlessrc the stupid way because the json has comments
        // and other special chars that break deserialization.
        const regex = /(?:\n\t)(?:\s*)(?:\/\/){0,0}("assetsFolder"):(.*)(\/\* .*)/g;
        try {
            const serverlessrc = fs.readFileSync(path.join(this.projectRoot, '.twilioserverlessrc')).toString();
            const [ [_, __, assetsFolder] ] = [...serverlessrc.matchAll(regex)];

            const parsedAssetsFolder = JSON.parse(assetsFolder.replace(',', '').replace('\t', '').replace('\n', '').replaceAll(' ', ''));
            return parsedAssetsFolder || 'assets';
        } catch (err) {
            return 'assets';
        }
    }

    get assets() {
        return this.detectFiles(path.join(this.projectRoot, this.assetsFolder));
    }

    get env() {
        return this.loadEnv('.env');
    }

    get envExample() {
        return this.loadEnv('.env.example');
    }

    get packageJson() {
        return JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json')).toString());
    }

    detectFileVisibility(filePath) {
        const visibilityRegex = /\.(private|protected)\./;

        const visibility = filePath.match(visibilityRegex);
        return visibility && visibility[0].replaceAll('.', '') || 'public';
    }

    loadEnv(envFile) {
        const varList = fs.readFileSync(path.join(this.projectRoot, envFile))
            .toString()
            .split('\n')
            .map((envEntry) => {
                const [variable, value] = splitOnce(envEntry, '=');
                return {[variable]: value};
            });
        return new Map(varList.map((v) => [...Object.keys(v), ...Object.values(v)]));
    }

    systemEnv() {
        const sysEnvs = {}
        for (const [envVar] of this.envExample) {
            sysEnvs[envVar] = process.env[envVar] || 'missing';
        }
        return sysEnvs;
    }

    genManifest() {
        return {
            project: this.packageJson.name,
            packageJson: this.packageJson,
            environment: this.systemEnv(),
            functions: this.functions,
            assets: this.assets,
        };
    }
}

function splitOnce(str, delim) {
    const components = str.split(delim);
    const result = [components.shift()];
    if (components.length) {
        result.push(components.join(delim));
    }
    return result;
}


async function detectServerlessProjects(servicesRoot) {
    return globSync(path.join(servicesRoot, '*/'));
}

function checkPath(...paths) {
    let path = null;
    try {
        paths.forEach(p => {
            path = p;
            return fs.accessSync(p, fs.constants.W_OK)
        });
    } catch (e) {
        console.error(`path ${path} not writable`)
        throw e;
    }
}

module.exports = {};
