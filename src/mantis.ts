#!/usr/bin/env node
import { program } from 'commander';
import { loadCommands } from './commands/loader';

const bootstrap = async () => {
  program
    .version(require('../package.json').version, '-v, --version', 'Output the current version.')
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Output usage information.');

  await loadCommands(program);

  program.parseAsync(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};

bootstrap();
