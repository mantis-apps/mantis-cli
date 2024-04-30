import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { PackageManager, PackageManagerName, installDependencies } from 'nypm';
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

    const { isLocal, dbUrl } = await promptForDbUrl();

    await copyTemplate({
      template: { name: templateName, path: templatePath },
      workspace: { name: workspaceName, path: workspacePath },
      secrets: { dbUrl },
    });
    await installDependenciesWithMessage(workspacePath);
    await startApplications(workspacePath, {
      startLocalDb: isLocal,
    });
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

const promptForDbUrl = async (): Promise<{
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
  await renameGitignoreFiles(workspace.path);
  const envPath = path.join(workspace.path, 'apps/web-client/.env.local');
  await fs.ensureFile(envPath);
  await fs.appendFile(envPath, `\nMONGODB_URI='${dbUrl}'`);
  replaceInFiles({
    dir: workspace.path,
    searchStr: template.name,
    replaceStr: workspace.name,
  });
  spinner.succeed('Created workspace');
};

/**
 * This is needed because npm can't publish .gitignore files
 * https://github.com/npm/npm/issues/3763
 */
const renameGitignoreFiles = async (workspacePath: string) => {
  const gitignoreFiles = await fs.readdir(workspacePath, {
    withFileTypes: true,
    recursive: true,
  });
  await Promise.all(
    gitignoreFiles
      .filter((entry) => entry.isFile() && entry.name === '_gitignore')
      .map(async (entry) => {
        await fs.rename(
          path.join(entry.path, entry.name),
          path.join(entry.path, '.gitignore'),
        );
      }),
  );
};

type PMTypePromptResult = Pick<PackageManager, 'name'>;
const promptForPackageManagerSelect = async (): Promise<PMTypePromptResult> => {
  const temp = await Enquirer.prompt<PMTypePromptResult>({
    type: 'select',
    name: 'name' satisfies keyof PMTypePromptResult,
    message: "Select the package manager you'd like to use:",
    choices: ['npm', 'bun', 'pnpm', 'yarn'] satisfies PackageManagerName[],
    // This is to workaround a bug
    // https://github.com/enquirer/enquirer/issues/121
    result(choice) {
      return (this as any).map(choice)[choice];
    },
  });
  return temp;
};

const installDependenciesWithMessage = async (workspacePath: string) => {
  const pm = await promptForPackageManagerSelect();
  const spinner = ora('Installing dependencies').start();
  await installDependencies({
    packageManager: pm.name,
    cwd: workspacePath,
    silent: true,
  });
  spinner.succeed('Installed dependencies');
};

const startApplications = async (
  workspacePath: string,
  { startLocalDb }: { startLocalDb: boolean },
) => {
  console.log(`${logSymbols.info} Starting applications...`);
  try {
    await execa(
      'npx',
      [
        'nx',
        'run-many',
        startLocalDb ? '--targets=serve,start-local-db' : '--target=serve',
        '--projects=web-client,mobile-client',
      ],
      { cwd: workspacePath, stdio: 'inherit' },
    );
  } catch (err: unknown) {
    if (
      err &&
      typeof err === 'object' &&
      'exitCode' in err &&
      // 130 is the exit code for SIGINT (ctrl + c)
      // i.e. the user cancelled the process
      err.exitCode === 130
    ) {
      return;
    }
    console.error(
      `${logSymbols.error} Failed to start applications: ${
        err instanceof Error ? err.message : 'Unknown cause'
      }`,
    );
  }
};
