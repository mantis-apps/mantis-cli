import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { PackageManagerName, detectPackageManager } from 'nypm';
import { fileURLToPath } from 'url';
import { execa } from 'execa';
import Enquirer from 'enquirer';
import { MongoClient } from 'mongodb';
import ora from 'ora';
import logSymbols from 'log-symbols';
import { replaceInFiles } from '../utils/files.helper';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default new Command('init')
  .description('Create a basic mantis app')
  .action(async () => {
    const templateName = 'mantis-todo';
    const templatePath = path.resolve(
      __dirname,
      `../templates/${templateName}`,
    );
    const workspaceName = await promptForWorkspaceName({
      defaultName: templateName,
    });
    const workspacePath = path.join(process.cwd(), workspaceName);

    const dbUrl = await promptForDbUrl();
    await copyTemplate({
      template: { name: templateName, path: templatePath },
      workspace: { name: workspaceName, path: workspacePath },
      secrets: { dbUrl },
    });
    await installDependenciesWithMessage(workspacePath);
    await startApplications(workspacePath);
  });

const promptForWorkspaceName = async ({
  defaultName,
}: {
  defaultName: string;
}) => {
  interface PromptResult {
    workspaceName: string;
  }
  const { workspaceName } = await Enquirer.prompt<PromptResult>([
    {
      type: 'input',
      name: 'workspaceName' satisfies keyof PromptResult,
      message: 'Enter the name of the workspace to create:',
      initial: defaultName,
      validate: async (value) => {
        if (value.trim().length <= 0) return 'Workspace name must not be empty';
        if (await fs.pathExists(value)) {
          return `Workspace already exists: ${value}`;
        }

        return true;
      },
    },
  ]);
  return workspaceName;
};

const promptForDbUrl = async () => {
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

const copyTemplate = async ({
  template,
  workspace,
  secrets: { dbUrl },
}: {
  template: { name: string; path: string };
  workspace: { name: string; path: string };
  secrets: { dbUrl: string };
}) => {
  const spinner = ora('Creating workspace').start();
  await fs.copy(template.path, workspace.path);
  const envPath = path.join(workspace.path, 'apps/server/.env.local');
  await fs.ensureFile(envPath);
  await fs.appendFile(envPath, `\nMONGODB_URI='${dbUrl}'`);
  replaceInFiles({
    dir: workspace.path,
    searchStr: template.name,
    replaceStr: workspace.name,
  });
  spinner.succeed('Created workspace');
};

// Needed until https://github.com/unjs/nypm/issues/115 is resolved
const pmToInstallCommandMap: Record<PackageManagerName, [string, string[]]> = {
  npm: ['npm', ['ci']],
  yarn: ['yarn', ['install', '--frozen-lockfile']],
  bun: ['bun', ['install', '--frozen-lockfile']],
  pnpm: ['pnpm', ['install', '--frozen-lockfile']],
};

const installDependenciesWithMessage = async (workspacePath: string) => {
  const spinner = ora('Installing dependencies').start();
  const pm = await detectPackageManager(workspacePath);
  if (!pm) {
    throw new Error(
      'No package manager found in the workspace. Unable to install dependencies.',
    );
  }
  const [command, args] = pmToInstallCommandMap[pm.name];
  await execa(command, args, {
    cwd: workspacePath,
    /* Ignore output */
    stdio: 'pipe',
  });
  spinner.succeed('Installed dependencies');
};

const startApplications = async (workspacePath: string) => {
  console.log(`${logSymbols.info} Starting applications...`);
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
};
