import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

export const loadCommands = async (program: Command) => {
  const commandsDir = path.join(__dirname, '.');
  
  const commandFiles = fs
    .readdirSync(commandsDir)
    .filter(file => file.endsWith('.command.ts'));

  for (const file of commandFiles) {
    const command = require(path.join(commandsDir, file));
    if (command.default) {
      program.addCommand(command.default);
    }
  }
};
