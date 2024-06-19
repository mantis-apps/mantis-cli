import ora from 'ora';
import { Action } from '../abstract.action';
import { GenerateActionOptions } from './generate.types';
import { execa } from 'execa';

import fs from 'fs';
import path from 'path';

export class GenerateAction extends Action {
  private options: GenerateActionOptions;

  constructor(options: GenerateActionOptions) {
    super('[GENERATE-ACTION]');
    this.options = options;
  }

  updateIndexTs = async (name: string) => {
    const filePath = path.join('shared-ui/src', 'index.ts');
    let content = await fs.promises.readFile(filePath, 'utf8');
    // add new line to the end of the file
    content += `\nexport * from './lib/${name}/${name}.component';`;
    await fs.promises.writeFile(filePath, content, 'utf8');
  };

  addNewComponentToTsConfig = async (name: string) => {
    const filePath = path.join('tsconfig.base.json');
    const content = await fs.promises.readFile(filePath, 'utf8');
    // Update tsconfig.base.json to add the new component in compilerOptions.paths array
    const json = JSON.parse(content);
    const COMPONENT_PATH = `shared-ui/src/lib/${name}/${name}.component`;
    json.compilerOptions.paths[`@todo/${name}`] = [COMPONENT_PATH];
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(json, null, 2),
      'utf8',
    );
  };

  generateComponent = async (name: string) => {
    const spinner = ora();
    spinner.start('Generating component');
    // generate new shared ui component
    await execa('npx', [
      'nx',
      'generate',
      '@nx/angular:component',
      name,
      '--directory',
      `shared-ui/src/lib/${name}`,
      '--nameAndDirectoryFormat',
      'as-provided',
    ]);
    // export the component from the index.ts file
    await this.updateIndexTs(name);
    // add new component to tsconfig.base.json
    await this.addNewComponentToTsConfig(name);
    spinner.succeed();
  };

  async execute() {
    try {
      this.logger.info('Generating...');
      const { type, name, filePath } = this.options;
      switch (type) {
        case 'component':
          await this.generateComponent(name);
          break;
        case 'service':
          this.logger.warning('Unimplemented');
          break;
        case 'mongo-schema':
          if (!filePath) {
            throw new Error('File path is required');
          }
          this.logger.warning('Unimplemented');
          // await generateMongoSchema({
          //   name,
          //   filePath,
          // });
          break;
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
