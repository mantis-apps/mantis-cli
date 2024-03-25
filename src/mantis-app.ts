import { program } from 'commander';
import { OrbitLogger } from './utils/orbitLogger.helper';
import { welcome } from './utils/welcome.helper';
import packageJson from '../package.json';
import initCommand from './commands/init.command';
import startCommand from './commands/start.command';

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
      .version(
        packageJson.version,
        '-v, --version',
        'Output the current version.',
      )
      .usage('<command> [options]')
      .option('-v, --verbose', 'Enable verbose mode')
      .helpOption('-h, --help', 'Output usage information.');

    program.addCommand(initCommand);
    program.addCommand(startCommand);

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

void bootstrap();
