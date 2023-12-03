import { prompt } from "enquirer";
import { isValidPath, isValidVariableName } from "../../utils/globalValidators.helper";
import { printWithBadge, printWithMantisGradient } from "../../utils/prettyPrint.helper";
import { Action } from "../abstract.action";
import { StartCommandOptions } from "./start.types";
import { execCommand } from "../../utils/process.helper";
import fs from 'fs';
import path from 'path';

export default class StartAction extends Action {
    private options: StartCommandOptions;

    constructor(options: StartCommandOptions) {
        super('[START-ACTION]');
        this.options = options;
    }

    async execute() {
        printWithMantisGradient(`🛖   NX WORKSPACE CREATION   🛠️`);

        this.logger.debug(`Started [START] Action...`, this.options);

        console.log(printWithBadge({text: 'Hello World !'}));

        const { workspace, workDir, createMobileApp } = this.options && this.options.workspace ? this.options : await this.getWorkspaceInfo();

        this.logger.debug(`Prompts Answers: ${workspace} - ${createMobileApp}`);

        try {
            this.createNxWorkspace(workspace, workDir, createMobileApp);
            this.installDependencies();
            this.createApplications(workspace);
            this.createLibraryDirectories();
            this.installAngularPackage();
            this.generateFeatureLibrary();
            this.moveContent(workspace);
            this.cleanupDirectories(workspace);
            this.replaceHomePage(workspace);
            this.updateImportPaths(workspace);
            this.installConcurrentlyPackage();
            // this.checkPorts(); // Uncomment if needed
            // this.launchApplications(workspace); // Uncomment if needed

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
            {
                type: 'input',
                name: 'workDir',
                message: 'Specify the Workdir:',
                validate: (value) => isValidPath(value),
            },

            {
                name: 'createMobileApp',
                message: 'Do you want to create a separate mobile app?',
                type: 'confirm',
                initial: false
            }
        ]) as Promise<StartCommandOptions>;
    }

    private createNxWorkspace(workspace: string, workDir: string, createMobileApp: boolean) {
        try {

            this.logger.info(`Creating NX workspace in ${workDir}...`);
            const command = `npx create-nx-workspace ${workspace} --preset nest --name ${workspace} --appName server --nxCloud false --docker true`;
            
            execCommand({
                command,
                cwd: workDir,
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
        this.logger.info('Creating Ionic applications...');
        execCommand({
            command: `npx nx generate @nxext/ionic-angular:application ${slugifiedName}-web`,
            useSpinner: false
        });
        execCommand({
            command: `npx nx generate @nxext/ionic-angular:application ${slugifiedName}-mobile`,
            useSpinner: false
        });
    }

    private createLibraryDirectories() {
        this.logger.info('Creating library directories...');
        execCommand({
            command: 'mkdir -p libs/shared/home libs/mobile libs/web',
            useSpinner: false
        });
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
            execCommand({
                command: `mv ${sourcePath}/* ${destinationPath}`,
                useSpinner: false
            });
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
        execCommand({
            command: `rm -rf ${webAppPath} ${mobileAppPath} ${featureLibPath}`,
            useSpinner: false
        });
    }

    private replaceHomePage(workspace: string) {
        const workspaceRoot = process.cwd();
        const featureLibPath = `${workspaceRoot}/libs/shared/home/feature/src/lib`;

        this.logger.info('Replacing instances of HomePage with HomePageComponent...');
        execCommand({
            command: `find ${featureLibPath} -type f -exec sed -i 's/HomePage/HomePageComponent/g' {} \\;`,
            useSpinner: false
        });
    }

    private updateImportPaths(workspace: string) {
        const workspaceRoot = process.cwd();
        const slugifiedName = workspace.toLowerCase().replace(/\s+/g, '-');

        const featureLibIndexPath = `${workspaceRoot}/libs/shared/home/feature/src/index.ts`;
        const webAppRoutingModulePath = `${workspaceRoot}/apps/${slugifiedName}-web/src/app/app-routing.module.ts`;
        const mobileAppRoutingModulePath = `${workspaceRoot}/apps/${slugifiedName}-mobile/src/app/app-routing.module.ts`;
        const sharedHomeFeaturePath = `@${workspace}/shared/home/feature`;

        this.logger.info('Updating import paths...');
        execCommand({
            command: `sed -i 's/lib\\/shared-home-feature\\/shared-home-feature.component/lib\\/home.module/g' ${featureLibIndexPath}`,
            useSpinner: false
        });
        execCommand({
            command: `sed -i "s|import('./home/home.module').then((m) => m.HomePageModule)|import('${sharedHomeFeaturePath}').then((m) => m.HomePageComponentModule)|g" "${webAppRoutingModulePath}"`,
            useSpinner: false
        });
        execCommand({
            command: `sed -i "s|import('./home/home.module').then((m) => m.HomePageModule)|import('${sharedHomeFeaturePath}').then((m) => m.HomePageComponentModule)|g" "${mobileAppRoutingModulePath}"`,
            useSpinner: false
        });
    }

    private installConcurrentlyPackage() {
        this.logger.info('Installing concurrently package...');
        execCommand({
            command: 'npm install --save-dev concurrently',
            useSpinner: false
        });
    }
}

