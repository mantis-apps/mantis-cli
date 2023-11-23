import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { OrbitLogger } from '../utils/orbitLogger.helper';
import { getScriptFileExtension } from '../utils/files.helper';

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
