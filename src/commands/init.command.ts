import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { installDependencies } from 'nypm';
import { fileURLToPath } from 'url';
import { execa } from 'execa';
import Enquirer from 'enquirer';
import { MongoClient } from 'mongodb';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default new Command('init')
  .description('Create a basic mantis app')
  .action(async () => {
    const templatePath = path.resolve(__dirname, '../templates/mantis-todo');
    const workspacePath = path.join(process.cwd(), 'mantis-todo');
    // Get db url
    const dbUrl = await promptForDbUrl();
    // Copy over files
    await fs.copy(templatePath, workspacePath, { overwrite: true });
    const envPath = path.join(workspacePath, 'apps/server/.env.local');
    await fs.ensureFile(envPath);
    await fs.appendFile(envPath, `\nMONGODB_URI='${dbUrl}'`);
    // Install dependencies
    await installDependencies({
      cwd: workspacePath,
    });
    // Start application
    await execa(
      'npx',
      [
        'nx',
        'run-many',
        '--target=serve',
        '--projects=web-client,mobile-client,server',
      ],
      { cwd: workspacePath, stdio: 'inherit' },
    );
  });

const promptForDbUrl = async (): Promise<string> => {
  interface PromptResult {
    dbUrl: string;
  }
  const { dbUrl } = await Enquirer.prompt<PromptResult>([
    {
      type: 'input',
      name: 'dbUrl' satisfies keyof PromptResult,
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
  return dbUrl;
};
