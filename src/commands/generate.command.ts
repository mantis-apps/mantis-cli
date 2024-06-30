import { Command } from 'commander';
import { GenerateAction } from '../actions/generate/generate.actions';

export default new Command('generate')
  .description('Generate a new Mantis feature')
  .argument('<type>', 'The type of thing to generate')
  .argument('<name>', 'The name of the thing to generate')
  .option('-p, --path <path>', 'The path to the file')
  .action(async (type, name, options) => {
    await new GenerateAction({ type, name, filePath: options.path }).execute();
  });
