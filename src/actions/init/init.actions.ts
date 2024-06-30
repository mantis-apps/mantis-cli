import { checkNodeVersion } from '../../utils/utilities.helper';
import { Action } from '../abstract.action';
import { InitActionOptions } from './init.types';
import { MongoClient } from 'mongodb';
import { PackageManager, PackageManagerName, installDependencies } from 'nypm';

import fsExtra from 'fs-extra';
import { $, execaCommand } from 'execa';
import fs from 'fs';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';
import { changeDirectory } from '../../utils/files.helper';
import { printWithMantisGradient } from '../../utils/prettyPrint.helper';

type PMTypePromptResult = Pick<PackageManager, 'name'>;

export default class InitAction extends Action {
  private options: InitActionOptions;

  constructor(options: InitActionOptions) {
    super('[INIT-ACTION]', { checkMantisProject: false });
    this.options = options;
  }

  promptForPackageManagerSelect = async (): Promise<PMTypePromptResult> => {
    const temp = await inquirer.prompt<PMTypePromptResult>({
      type: 'list',
      name: 'name' satisfies keyof PMTypePromptResult,
      message: "Select the package manager you'd like to use:",
      choices: ['npm', 'bun', 'pnpm', 'yarn'] satisfies PackageManagerName[],
    });
    return temp;
  };

  installDependenciesWithMessage = async (workspacePath: string) => {
    const pm = await this.promptForPackageManagerSelect();
    const spinner = ora('Installing dependencies').start();
    await installDependencies({
      packageManager: pm.name,
      cwd: workspacePath,
      silent: true,
    });
    spinner.succeed('Installed dependencies');
    return pm;
  };

  async promptForMissingValues() {
    type PromptResult = {
      workspaceName: string;
      mongoUrl: string;
      createMobile: boolean;
    };
    const answers = await inquirer.prompt<PromptResult>([
      {
        type: 'input',
        name: 'workspaceName',
        message: 'Enter the name of the workspace to create:',
        default: 'mantis',
        when: () => !this.options.workspaceName,
        validate: async (value) => {
          if (value.trim().length <= 0)
            return 'Workspace name must not be empty';
          if (await fsExtra.pathExists(value)) {
            return `Workspace already exists: ${value}`;
          }

          return true;
        },
      },
      {
        type: 'input',
        name: 'mongoUrl',
        message:
          "Enter the MongoDB URI (default is 'mongodb://localhost:27017/mantis'):",
        default: 'mongodb://localhost:27017/mantis',
        when: () => !this.options.mongodbUri,
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
      {
        type: 'confirm',
        name: 'createMobile',
        message: 'Create mobile app?',
        when: () => ![true, false].includes(this.options.createMobile),
      },
    ]);

    return {
      workspaceName: answers.workspaceName || this.options.workspaceName,
      mongoUrl: answers.mongoUrl || this.options.mongodbUri,
      createMobile: [true, false].includes(answers.createMobile)
        ? answers.createMobile
        : this.options.createMobile,
    };
  }

  async createWorkspace(workspaceName: string) {
    const spinner = ora(`Creating ${workspaceName} workspace...`).start();
    try {
      const { stdout } = await execaCommand(
        `yes | npx create-nx-workspace ${workspaceName} --preset=ts --nxCloud=skip --interactive=false`,
        { shell: true },
      );
      console.log(stdout);
      spinner.succeed(`Workspace ${workspaceName} created`);
    } catch (error) {
      spinner.fail(`Failed to create ${workspaceName} workspace`);
      throw error;
    }
  }

  async setupEnvironment(
    workspacePath: string,
    mongoUrl: string,
    frontendUrl: string = 'http://localhost:4200',
  ) {
    const spinner = ora('Setting up environment variables...').start();
    const envPath = path.join(workspacePath, '.env');
    const envContent = `MONGODB_URI=${mongoUrl}\nFRONTEND_URLS=${frontendUrl}`;
    fs.writeFileSync(envPath, envContent);
    spinner.succeed('Environment variables set');
  }

  async cloneAndSetupTemplate(params: {
    workspaceName: string;
    workspacePath: string;
    createMobile: boolean;
  }) {
    const { workspaceName, workspacePath } = params;
    const spinner = ora('Setting up project template...').start();
    try {
      await $`git clone --no-checkout https://github.com/mantis-apps/mantis-templates.git`;
      changeDirectory('mantis-templates');
      await $`git sparse-checkout init`;
      await $`git sparse-checkout set todo`;
      await $`git checkout`;

      await $`mv todo/app-web ${workspacePath}/app-web`;
      if (params.createMobile) {
        await $`mv todo/app-mobile ${workspacePath}/app-mobile`;
      }
      await $`mv todo/shared-ui ${workspacePath}/shared-ui`;
      await $`mv todo/tsconfig.base.json ${workspacePath}/tsconfig.base.json`;
      await $`mv todo/jest.config.ts ${workspacePath}/jest.config.ts`;
      await $`mv todo/jest.preset.js ${workspacePath}/jest.preset.js`;
      await $`mv todo/package.json ${workspacePath}/package.json`;
      // await $`mv todo/package-lock.json ${workspacePath}/package-lock.json`;
      await $`mv todo/nx.json ${workspacePath}/nx.json`;

      changeDirectory(workspacePath);
      await $`npm pkg set name=@${workspaceName}/source`;
      await $`rm -rf mantis-templates`;
      spinner.succeed('Project template setup complete.');
    } catch (error) {
      spinner.fail('Failed to set up project template.');
      throw error;
    }
  }

  async execute() {
    try {
      printWithMantisGradient(`🛖   WORKSPACE CREATION   🛠️`);
      await checkNodeVersion();
      const { workspaceName, mongoUrl, createMobile } =
        await this.promptForMissingValues();

      const workspacePath = path.join(process.cwd(), workspaceName);
      this.logger.info('Node version is valid');
      await this.createWorkspace(workspaceName);
      await this.setupEnvironment(workspacePath, mongoUrl);

      // navigate to the workspace
      changeDirectory(workspacePath);

      // remove node_modules, package-lock.json & package.json
      await $`rm -rf node_modules package-lock.json package.json`;

      // clone and setup template
      await this.cloneAndSetupTemplate({
        workspaceName,
        workspacePath,
        createMobile,
      });

      // install dependencies
      const pm = await this.installDependenciesWithMessage(workspacePath);

      // add mantis json
      const mantisJsonPath = path.join(workspacePath, 'mantis.json');
      const mantisJsonContent = `{
        "name": "${workspaceName}",
        "version": "0.0.1",
        "description": "Mantis Workspace",
        "workspace": ["@${workspaceName}/source"],
        "packageManager": "${pm.name}"
      }`;
      fs.writeFileSync(mantisJsonPath, mantisJsonContent);
      fs.writeFileSync(mantisJsonPath, mantisJsonContent);
      this.logger.info('Workspace initialized');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
