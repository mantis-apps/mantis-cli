import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { OrbitLogger } from '../utils/orbitLogger.helper';
import { getScriptFileExtension } from '../utils/files.helper';
import { ActionFile, ActionFunction } from 'src/actions/actionTypes';

/**
 * Dynamically loads and registers command modules to the provided Commander program.
 * It scans the commands directory for files ending with `.command.ts` or `.command.js`,
 * depending on the environment (development or production), and then requires these files
 * to register their commands with the Commander program instance.
 * 
 * @param {Command} program - The Commander program instance to which the commands will be added.
 */
export const loadCommands = async (program: Command) => {
  const logger = new OrbitLogger('[LOADER]');
  
  const commandsDir = path.join(__dirname, '.');
  const fileExtension = getScriptFileExtension();

  logger.debug(`Loading command files with extension: ${fileExtension}`);
  logger.debug(`Commands directory: ${commandsDir}`);

  const commandFiles = fs
    .readdirSync(commandsDir)
    .filter(file => file.endsWith(`.command${fileExtension}`));

  logger.debug('Command Files:', commandFiles);

  for (const file of commandFiles) {
    const command = require(path.join(commandsDir, file));
    if (command.default) {
      program.addCommand(command.default);
    }
  }
};


/**
 * Dynamically loads and returns an action function based on a provided command name.
 * This function assumes a specific naming convention and file structure for action modules:
 * each action should be named `<commandName>Action` and should be exported from a file named
 * `<commandName>.action.ts` located in the `actions` directory.
 * 
 * The function dynamically imports the corresponding action module using `require` and then
 * returns a new function that calls the imported action with all of its arguments. This setup
 * allows for passing any command-line arguments and options to the action function.
 *
 * @param {string} commandName - The name of the command for which the action is to be loaded.
 * @returns {ActionFunction} A function that, when called, executes the action associated with
 *                            the given command name, passing along all provided arguments.
 */
export function loadAction(commandName: string): ActionFunction {
  // Import the action function dynamically based on the commandName.
  // The action is expected to be a named export following the naming convention.
  const actionFunction = (require(`../actions/${commandName}/${commandName}.action`) as ActionFile)[`${commandName}Action`];
  
  // Return a new function that forwards all its arguments to the action function.
  return (...args) => actionFunction(...args);
}