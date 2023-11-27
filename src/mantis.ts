#!/usr/bin/env node
import { program } from 'commander';
import { loadCommands } from './commands/loader';
import { OrbitLogger } from './utils/orbitLogger.helper';
import { welcome } from './utils/welcome.helper';

const bootstrap = async () => {
  await welcome();

  const logger = new OrbitLogger('[BOOTSTRAP]');

  logger.debug('🚀 STARTED MANTIS-CLI 🚀');

  program
    .version(require('../package.json').version, '-v, --version', 'Output the current version.')
    .usage('<command> [options]')
    .option('-v, --verbose', 'Enable verbose mode')
    .helpOption('-h, --help', 'Output usage information.');

  await loadCommands(program);

  await program.parseAsync(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};
bootstrap();
