import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { installDependencies } from 'nypm';
import { fileURLToPath } from 'url';
import { execa } from 'execa';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default new Command('init')
  .description('Create a basic mantis app')
  .action(async () => {
    const templatePath = path.resolve(__dirname, '../templates/mantis-todo');
    const workspacePath = path.join(process.cwd(), 'mantis-todo');
    // Copy over files
    await fs.copy(templatePath, workspacePath, { overwrite: true });
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
