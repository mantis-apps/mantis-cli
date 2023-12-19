import { prompt } from "enquirer";
import { isValidVariableName } from "../../utils/globalValidators.helper";
import { printWithBadge, printWithMantisGradient } from "../../utils/prettyPrint.helper";
import { Action } from "../abstract.action";
import { StartCommandOptions } from "./start.types";
import { changeDirectory, createDirectory, moveFile, removeFile, replaceInFile, replaceInFiles } from "../../utils/files.helper";
import { checkPortAvailability, execCommand, findAvailablePort } from "../../utils/process.helper";
import fs from 'fs';
import path from 'path';
import { OrbitLogger } from "src/utils/orbitLogger.helper";
import portscanner from 'portscanner';

export default class StartAction extends Action {
    private options: StartCommandOptions;

    constructor(options: StartCommandOptions) {
        super('[START-ACTION]');
        this.options = options;
    }

    async execute() {
        printWithMantisGradient(`🛖   NX WORKSPACE CREATION   🛠️`);

        this.logger.debug(`Started [START] Action...`, this.options);

        console.log(printWithBadge({ text: 'Hello World !' }));

        const { workspace, workDir, createMobileApp } = this.options && this.options.workspace ? this.options : await this.getWorkspaceInfo();

        this.logger.debug(`Prompts Answers: ${workspace} - ${createMobileApp}`);

        try {
            this.createNxWorkspace(workspace, createMobileApp);
            changeDirectory(path.resolve(workspace));
            this.installDependencies();
            this.createApplications(workspace);
            this.createLibraryDirectories();
            this.installAngularPackage();
            this.generateFeatureLibrary();
            this.moveContent(workspace);
            this.cleanupDirectories(workspace);
            this.replaceHomePage(workspace);
            this.updateImportPaths(workspace);
            // this.installConcurrentlyPackage();
            await this.checkPorts(createMobileApp);
            this.launchApplications();

            this.logger.info('Workspace setup complete!');
        } catch (error) {
            this.logger.error(`Error occurred during workspace setup: ${error.message}`);
        }

    }

    private async getWorkspaceInfo(): Promise<StartCommandOptions> {
        return prompt([
            {
                type: 'input',
                name: 'workspace',
                message: 'Enter the name of the workspace (default is mantis):',
                initial: 'mantis',
                validate: (value) => isValidVariableName(value),
            },
            // {
            //     type: 'input',
            //     name: 'workDir',
            //     message: 'Specify the Workdir:',
            //     validate: (value) => isValidPath(value),
            // },
            {
                name: 'createMobileApp',
                message: 'Do you want to create a separate mobile app?',
                type: 'confirm',
                initial: false
            }
        ]) as Promise<StartCommandOptions>;
    }

    private createNxWorkspace(workspace: string, createMobileApp: boolean) {
        try {

            this.logger.info(`Creating NX workspace in ${process.cwd()}...`);
            const command = `npx create-nx-workspace ${workspace} --preset nest --name ${workspace} --appName server --nxCloud false --docker true --create`;

            execCommand({
                command,
                useSpinner: false
            });

            this.logger.info(`NX workspace '${workspace}' created successfully.`);

            if (createMobileApp) {
                // TODO: Additional logic to create a mobile app
            }
        } catch (error) {
            this.logger.error(`Failed to create NX workspace: ${error.message}`);
            throw error;
        }
    }

    private installDependencies() {
        this.logger.info('Installing necessary plugins and dependencies...');
        execCommand({
            command: 'npm install --save-dev @nxext/ionic-angular @nxext/capacitor',
            useSpinner: false
        });
    }

    private createApplications(workspace: string) {
        const slugifiedName = workspace.toLowerCase().replace(/\s+/g, '-');
        this.logger.info(`Creating Ionic applications in ${process.cwd()}...`);
        execCommand({
            command: `npx nx generate @nxext/ionic-angular:application ${slugifiedName}-web --template=blank`,
            useSpinner: false
        });
        execCommand({
            command: `npx nx generate @nxext/ionic-angular:application ${slugifiedName}-mobile --template=blank`,
            useSpinner: false
        });
    }

    private createLibraryDirectories() {
        this.logger.info('Creating library directories...');
        createDirectory('-p', ['libs/shared/home', 'libs/mobile', 'libs/web']);
    }

    private installAngularPackage() {
        this.logger.info('Installing @nrwl/angular package...');
        execCommand({
            command: 'npm install --save-dev @nrwl/angular',
            useSpinner: false
        });
    }

    private generateFeatureLibrary() {
        this.logger.info('Generating new feature library...');
        execCommand({
            command: 'npx nx generate @nx/angular:library --name=feature --directory=shared/home --inlineStyle=true --inlineTemplate=true --standalone=true --no-interactive',
            useSpinner: false
        });
    }

    private moveContent(workspace: string) {
        const slugifiedName = workspace.toLowerCase().replace(/\s+/g, '-');
        const workspaceRoot = process.cwd();
        const sourcePath = `${workspaceRoot}/apps/${slugifiedName}-web/src/app/home`;
        const destinationPath = `${workspaceRoot}/libs/shared/home/feature/src/lib`;

        if (fs.existsSync(sourcePath)) {
            this.logger.info('Moving content...');
            moveFile(`${sourcePath}/*`, destinationPath);
        } else {
            this.logger.error(`Directory ${sourcePath} not found.`);
        }
    }

    private cleanupDirectories(workspace: string) {
        const slugifiedName = workspace.toLowerCase().replace(/\s+/g, '-');
        const workspaceRoot = process.cwd();
        const webAppPath = `${workspaceRoot}/apps/${slugifiedName}-web/src/app/home`;
        const mobileAppPath = `${workspaceRoot}/apps/${slugifiedName}-mobile/src/app/home`;
        const featureLibPath = `${workspaceRoot}/libs/shared/home/feature/src/lib/shared-home-feature`;

        this.logger.info('Cleaning up unnecessary directories...');
        removeFile('-rf', [webAppPath, mobileAppPath, featureLibPath]);
    }

    private replaceHomePage(workspace: string) {
        const workspaceRoot = process.cwd();
        const featureLibPath = `${workspaceRoot}/libs/shared/home/feature/src/lib`;

        this.logger.info('Replacing instances of HomePage with HomePageComponent...');
        replaceInFiles(featureLibPath, 'HomePage', 'HomePageComponent');
    }

    private updateImportPaths(workspace: string) {
        const workspaceRoot = process.cwd();
        const slugifiedName = workspace.toLowerCase().replace(/\s+/g, '-');

        const featureLibIndexPath = path.resolve(`${workspaceRoot}/libs/shared/home/feature/src/index.ts`);
        const webAppRoutingModulePath = path.resolve(`${workspaceRoot}/apps/${slugifiedName}-web/src/app/app-routing.module.ts`);
        const mobileAppRoutingModulePath = path.resolve(`${workspaceRoot}/apps/${slugifiedName}-mobile/src/app/app-routing.module.ts`);
        const sharedHomeFeaturePath = `@${workspace}/shared/home/feature`;

        this.logger.info('-> Updating import paths...');

        replaceInFile(featureLibIndexPath, 'lib/shared-home-feature/shared-home-feature.component', 'lib/home.module');
        replaceInFile(webAppRoutingModulePath, "import\\('./home/home.module'\\)\\.then\\(\\(m\\) => m\\.HomePageModule\\)", `import('${sharedHomeFeaturePath}').then((m) => m.HomePageComponentModule)`);
        replaceInFile(mobileAppRoutingModulePath, "import\\('./home/home.module'\\)\\.then\\(\\(m\\) => m\\.HomePageModule\\)", `import('${sharedHomeFeaturePath}').then((m) => m.HomePageComponentModule)`);
    }

    private installConcurrentlyPackage() {
        this.logger.info('Installing concurrently package...');
        execCommand({
            command: 'npm install --save-dev concurrently',
            useSpinner: false
        });
    }

    private async checkPorts(createMobileApp: boolean) {
        let webPort = Number(process.env.WebPort) || 4200;
        let mobilePort = Number(process.env.MobilePort) || 4300;
        let serverPort = Number(process.env.ServerPort) || 3000;

        const isWebPortAvailable = await checkPortAvailability({ port: webPort });
        const isMobilePortAvailable = createMobileApp ? await checkPortAvailability({ port: mobilePort }) : true;
        const isServerPortAvailable = await checkPortAvailability({ port: serverPort });

        if (!isWebPortAvailable) {
            this.logger.warning(`Port ${webPort} (Web) is already in use`);
            process.env.WebPort = (await findAvailablePort({ startPort: webPort, endPort: webPort + 99 })).toString();
        }
        if (!isMobilePortAvailable) {
            this.logger.warning(`Port ${mobilePort} (Mobile) is already in use`);
            process.env.MobilePort = (await findAvailablePort({ startPort: mobilePort, endPort: mobilePort + 99 })).toString();
        }
        if (!isServerPortAvailable) {
            this.logger.warning(`Port ${serverPort} (Server) is already in use`);
            process.env.ServerPort = (await findAvailablePort({ startPort: serverPort, endPort: serverPort + 99 })).toString();
        }
    }

    private launchApplications() {
        const command = 'npx nx run-many --target=serve --all --maxParallel=100';

        try {
            this.logger.info('Launching applications...');
            execCommand({ command, useSpinner: true });

            this.logger.sponsor('Applications launched successfully.');
        } catch (error) {
            this.logger.error(`Error launching applications: ${error.message}`);
            throw error; // Rethrow the error for further handling if necessary
        }
    }
}

