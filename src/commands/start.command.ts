import { Command } from 'commander';
import path from 'path';
import { ActionFile } from 'src/actions/actionTypes';

const currentCommandName = path.basename(__filename).split('.').at(0);

/**
* TODO: Create an Action Loader function that will load action when given {this} 
* See if we cant Create a Get Command Name function for current file name.
*/
export default new Command(currentCommandName)
    .description('Description of someCommand')
    .action((require(`../actions/${currentCommandName}.action`) as ActionFile)[`${currentCommandName}Action`]);
