#!/usr/bin/env node
import { program } from 'commander';
import { loadCommands } from './commands/loader';
import { OrbitLogger } from './utils/orbitLogger.helper';

const bootstrap = async () => {
  const logger = new OrbitLogger('BootStrap');
  
  logger.info('Hello There Boot');

  program
    .version(require('../package.json').version, '-v, --version', 'Output the current version.')
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Output usage information.');

  await loadCommands(program);

  await program.parseAsync(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};

bootstrap();
