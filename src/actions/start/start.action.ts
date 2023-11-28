import { prompt } from "enquirer";
import { isValidPath, isValidVariableName } from "../../utils/globalValidators.helper";
import { printWithBadge, printWithMantisGradient } from "../../utils/prettyPrint.helper";
import { Action } from "../abstract.action";
import { StartCommandOptions } from "./start.types";
import { execCommand } from "../../utils/process.helper";

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

        this.createNxWorkspace(workspace, workDir, createMobileApp);

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
                useSpinner: true
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

}

