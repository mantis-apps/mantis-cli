import { prompt } from "enquirer";
import { OrbitLogger } from "../../utils/orbitLogger.helper";
import { isValidVariableName } from "../../utils/globalValidators.helper";
import { printWithMantisGradient } from "src/utils/prettyPrint.helper";

interface startCommandOptions {
    workspace: string,
    createMobileApp: boolean
}


export async function startAction(options: startCommandOptions) {
    const logger = new OrbitLogger('[START-ACTION]');
    printWithMantisGradient(`🛖 NX WORKSPACE CREATION 🛠️`);

    logger.debug(`Started [START] Action...`, options);
    const { workspace, createMobileApp } = options && options?.workspace ? options : await getWorkspaceInfo();

    logger.debug(`Prompts Answers: ${workspace} - ${createMobileApp}`);



};

function getWorkspaceInfo() {
    return prompt([
        {
            type: 'input',
            name: 'workspace',
            message: 'Enter the name of the workspace (default is mantis):',
            initial: 'mantis',
            validate: (value) => isValidVariableName(value),
        },
        {
            name: 'createMobileApp',
            message: 'Do you want to create a separate mobile app?',
            type: 'confirm',
            initial: false
        }
    ]) as Promise<startCommandOptions>;
}

// function createWorkspace() {
//     log(`Using workspace name: ${workspace}`);
//     log(`Creating separate mobile app: ${dualApp}`);
  
//     execSync(`npx create-nx-workspace ${workspace} --preset nest --name mantis-todo --appName server --nxCloud false --docker true`, { stdio: 'inherit' });
// }