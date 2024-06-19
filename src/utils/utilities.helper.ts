import { exec } from 'child_process';
import { promisify } from 'util';
import { MIN_NODE_VERSION } from '../constants';

/**
 * Clears the console screen.
 */
export const clearConsole = () => {
  // const clearCommand = os.platform() === 'win32' ? 'cls' : 'clear';
  // shell.exec(clearCommand);
  // The 'process' of Node.js allows access to the terminal.
  process.stdout.write('\x1Bc'); // '\x1Bc' is an escape sequence to clear the screen.
  console.log('');
};

const execAsync = promisify(exec);

export async function runCommand(command: string) {
  const { stdout, stderr } = await execAsync(command);
  if (stderr) throw new Error(stderr);
  return stdout;
}

export async function checkNodeVersion(
  requiredVersion: number = MIN_NODE_VERSION,
): Promise<void> {
  try {
    const stdout = await runCommand('node -v');
    const version = parseInt(stdout.slice(1).split('.')[0]);
    if (version < requiredVersion) {
      console.error(
        `Node version must be at least ${requiredVersion}. You are running version ${stdout}. Please update Node.js.`,
      );
      process.exit(1);
    }
  } catch (error) {
    console.error('Node is not installed. Please install Node.js.');
    process.exit(1);
  }
}
