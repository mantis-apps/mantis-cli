import { prompt } from "enquirer";
import { isValidPath, isValidVariableName } from "../../utils/globalValidators.helper";
import { printWithMantisGradient } from "../../utils/prettyPrint.helper";
import { Action } from "../abstract.action";
import { StartCommandOptions } from "./start.types";

export default class StartAction extends Action {
    private options: StartCommandOptions;

    constructor(options: StartCommandOptions) {
        super('[START-ACTION]');
        this.options = options;
    }

    async execute() {
        printWithMantisGradient(`🛖   NX WORKSPACE CREATION   🛠️`);

        this.logger.debug(`Started [START] Action...`, this.options);
        const { workspace, createMobileApp } = this.options && this.options.workspace ? this.options : await this.getWorkspaceInfo();

        this.logger.debug(`Prompts Answers: ${workspace} - ${createMobileApp}`);


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

}

