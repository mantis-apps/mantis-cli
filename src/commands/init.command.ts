import { Command } from 'commander';
import Enquirer from 'enquirer';
import { MongoClient } from 'mongodb';

import InitAction from '../actions/init/init.actions';

// const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default new Command('init')
  .description('Create a basic mantis app')
  .option('-m, --mongodb-uri <mongodb-uri>', 'The MongoDB URI')
  .option('-n, --name <name>', 'The name of the workspace')
  .option('-cm, --create-mobile <create-mobile>', 'Create mobile app', true)
  .action(async (params) => {
    await new InitAction(params).execute();
  });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _promptForDbUrl = async (): Promise<{
  dbUrl: string;
  isLocal: boolean;
}> => {
  interface DbTypePromptResult {
    dbType: string;
  }
  const { dbType } = await Enquirer.prompt<DbTypePromptResult>({
    type: 'select',
    name: 'dbType' satisfies keyof DbTypePromptResult,
    message: 'How do you want to connect to the database?',
    choices: [
      {
        name: 'Create a local development mongo db for me (default)',
        value: 'local',
      },
      {
        name: 'Provide a mongo connection string',
        value: 'dbUrl',
      },
    ],
    // This is to workaround a bug
    // https://github.com/enquirer/enquirer/issues/121
    result(choice) {
      return (this as any).map(choice)[choice];
    },
  });
  if (dbType === 'local') {
    return { isLocal: true, dbUrl: 'mongodb://127.0.0.1:27017' };
  }
  interface DbUrlPromptResult {
    dbUrl: string;
  }
  const { dbUrl } = await Enquirer.prompt<DbUrlPromptResult>([
    {
      type: 'input',
      name: 'dbUrl' satisfies keyof DbUrlPromptResult,
      message: 'Enter the url for the mongo db to connect to:',
      validate: async (value) => {
        if (value.trim().length <= 0) return 'Db url must not be empty';
        try {
          await MongoClient.connect(value);
          return true;
        } catch (error) {
          return `Db url seems to be invalid: ${error.message}`;
        }
      },
    },
  ]);
  return { isLocal: false, dbUrl };
};
