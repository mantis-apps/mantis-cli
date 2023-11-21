import { Command } from 'commander';
import { someAction } from '../actions/some.action';

export default new Command('someCommand')
    .description('Description of someCommand')
    .action(someAction);
