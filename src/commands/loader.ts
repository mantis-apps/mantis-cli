import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { OrbitLogger } from '../utils/orbitLogger.helper';
import { getScriptFileExtension } from '../utils/files.helper';
import { ActionFunction } from 'src/actions/actionTypes';


/**
 * Dynamically loads and registers command modules to the provided Commander program.
 * It scans the commands directory for files ending with `.command.ts` or `.command.js`,
 * depending on the environment (development or production), and then requires these files
 * to register their commands with the Commander program instance.
 *
 * Error handling is implemented to catch and report issues related to loading command files.
 * 
 * @param {Command} program - The Commander program instance to which the commands will be added.
 */
export async function loadCommands(program: Command) {
  const logger = new OrbitLogger('[LOADER]');

  const commandsDir = path.join(__dirname, '.');
  const fileExtension = getScriptFileExtension();

  logger.debug(`Loading command files with extension: ${fileExtension}`);
  logger.debug(`Commands directory: ${commandsDir}`);

  try {
    const commandFiles = fs
      .readdirSync(commandsDir)
      .filter(file => file.endsWith(`.command${fileExtension}`));

    logger.debug('Command Files:', commandFiles);

    commandFiles.forEach(async file => {
      try {
        const command = await require(path.join(commandsDir, file));
        if (command.default) {
          program.addCommand(command.default);
        } else {
          throw new Error(`Command file '${file}' does not export a default command.`);
        }
      } catch (innerError) {
        logger.error(`Error loading command from file '${file}': ${innerError.message}`);
      }
    });
  } catch (error) {
    logger.error(`Failed to load commands: ${error.message}`);
    throw error;
  }
}



/**
 * Dynamically loads and returns the 'execute' method of an action class based on a provided command name.
 * Assumes each action class is the default export from a file named `<commandName>.action.ts` in the 'actions' directory
 * and that these classes have an 'execute' method.
 *
 * @param {string} commandName - The name of the command for which the action class is to be loaded.
 * @returns {ExecuteMethod} The 'execute' method of the loaded action class.
 * @throws Will throw an error if the action file cannot be found or does not export a class with an 'execute' method.
 */
export function loadAction(commandName: string): ActionFunction {
  const logger = new OrbitLogger('[ACTION-LOADER]');

  try {
    logger.debug(`Loading [${commandName}] Action Class...`)
    // Dynamically import the action class based on the commandName.
    const ActionClass = require(`../actions/${commandName}/${commandName}.action`).default;

    // Check if the class has an 'execute' method.
    if (typeof ActionClass.prototype.execute !== 'function') {
      logger.error(`Action class for '${commandName}' does not have an 'execute' method.`)
      throw new Error('Action Loading Error: Execute Function Missing');
    }

    // Return a function that, when called, executes the 'execute' method of the action class instance.
    return (...args: any[]) => {
      const actionInstance = new ActionClass();
      return actionInstance.execute(...args);
    };
  } catch (error) {
    logger.error(`Failed to load action for command '${commandName}': ${error.message}`)
    throw new Error('Action Loading Error');
  }
}
