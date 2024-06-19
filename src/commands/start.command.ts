import { Command } from 'commander';
import StartAction from '../actions/start/start.action';

export default new Command('start')
  .description('Start the Mantis project')
  .action(async () => {
    await new StartAction().execute();
  });
