import { Command } from 'commander';
import StartAction from '../actions/start/start.action';

export default new Command('start')
  .description('Description of someCommand')
  .option('-w, --workspace <name>', 'Specify the name of the workspace')
  .option('--createMobileApp', 'Create a Mobile App')
  .action(() => {
    new StartAction({ workspace: '' }).execute();
  });
