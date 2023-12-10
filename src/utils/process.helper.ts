import { execSync } from 'child_process';
import Spinnies from 'spinnies';
import { OrbitLogger } from './orbitLogger.helper';


const spinnies = new Spinnies();

interface ExecCommandOptions {
  command: string;
  cwd?: string;
  useSpinner?: boolean;
  crossPlatform?: boolean;
}

/**
 * Executes a shell command synchronously, with error handling and optional loading animation.
 *
 * @param {ExecCommandOptions} options - The options for executing the command.
 * @returns {void}
 */
export function execCommand(options: ExecCommandOptions): void {
  const { command, cwd, useSpinner = false } = options;

  try {
    if (useSpinner) {
      spinnies.add('execCommand', { text: 'Executing command...' });
    }

    if (options.crossPlatform) {
      execSync(`shx ${command}`, { stdio: 'inherit', cwd });
    } else {
      execSync(command, { stdio: 'inherit', cwd });
    }

    if (useSpinner) {
      spinnies.succeed('execCommand', { text: 'Command executed successfully.' });
    }
  } catch (error) {
    if (useSpinner) {
      spinnies.fail('execCommand', { text: 'Failed to execute command.' });
    }
    new OrbitLogger('COMMAND-EXECUTOR').error(`Error executing command: ${error.message}`);
    throw error;
  }
}
