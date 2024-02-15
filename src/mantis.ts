#!/usr/bin/env node
import { program } from 'commander';
import { loadCommands } from './commands/loader';
import { OrbitLogger } from './utils/orbitLogger.helper';
import { welcome } from './utils/welcome.helper';

const logger = new OrbitLogger('[BOOTSTRAP]');

const handleExit = () => {
  logger.info('Exiting MANTIS-CLI 😓...');
  process.exit(1);
};

const bootstrap = async () => {
  try {
    await welcome();

    logger.debug('🚀 STARTED MANTIS-CLI 🚀');

    // Listen for the 'SIGINT' event
    process.on('SIGINT', handleExit);

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
  } catch (error) {
    if (!error) {
      return handleExit();
    }
    logger.error('Error During Bootstrap');
    console.error(error);
  } finally {
    process.removeListener('SIGINT', handleExit);
  }
};

bootstrap();
