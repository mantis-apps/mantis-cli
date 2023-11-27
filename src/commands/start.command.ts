import { Command } from 'commander';
import { getCommandName } from '../utils/files.helper';
import { loadAction } from './loader';

const currentCommandName = getCommandName(__filename);

export default new Command(currentCommandName)
    .description('Description of someCommand')
    .option('-w, --workspace <name>', 'Specify the name of the workspace')
    .option('--createMobileApp', 'Create a Mobile App')
    .action(loadAction(currentCommandName));
