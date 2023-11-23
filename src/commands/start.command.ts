import { Command } from 'commander';
import path from 'path';
import { ActionFile } from 'src/actions/actionTypes';

const currentCommandName = path.basename(__filename).split('.').at(0);

export default new Command(currentCommandName)
    .description('Description of someCommand')
    .action((require(`../actions/${currentCommandName}.action`) as ActionFile)[`${currentCommandName}Action`]);
