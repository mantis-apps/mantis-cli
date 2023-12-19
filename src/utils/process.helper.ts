import { execSync } from 'child_process';
import Spinnies from 'spinnies';
import { OrbitLogger } from './orbitLogger.helper';
import portscanner from 'portscanner';


const spinnies = new Spinnies();

interface ExecCommandOptions {
  command: string;
  cwd?: string;
  useSpinner?: boolean;
  crossPlatform?: boolean;
}

interface CheckPortOptions {
  port: number;
  envName?: string;
  host?: string;
}

interface FindAvailablePortOptions {
  startPort: number;
  endPort: number;
  host?: string;
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

/**
* Checks if a given port is available on a specified host.
* 
* @param {CheckPortOptions} options - The options for checking the port.
* @param {number} options.port - The port to check for availability.
* @param {string} [options.envName] - Optional environment variable name to use for the port.
* @param {string} [options.host='127.0.0.1'] - The host on which to check the port. Defaults to '127.0.0.1'.
* @returns {Promise<boolean>} `true` if the port is available, `false` otherwise.
*/
export async function checkPortAvailability(options: CheckPortOptions): Promise<boolean> {
  const { port, envName, host = '127.0.0.1' } = options;
  const logger = new OrbitLogger('PORT-CHECKER');

  let checkPort = port;
  if (envName && process.env[envName]) {
    logger.info(`Using Environment Defined Port for ${envName}: [${process.env[envName]}]`);
    checkPort = Number(process.env[envName]);
  }

  try {
    const status = await portscanner.checkPortStatus(checkPort, host);

    // Status is 'open' if currently in use or 'closed' if available
    if (status === 'closed') {
      logger.info(`Port ${checkPort} on host ${host} is available`);
      return true;
    } else {
      logger.warning(`Port ${checkPort} on host ${host} is already in use`);
      return false;
    }
  } catch (error) {
    logger.error(`Error checking port ${checkPort} on host ${host}: ${error.message}`);
    throw error;
  }
}

/**
 * Finds an available port within a specified range.
 * 
 * @param {FindAvailablePortOptions} options - The options for finding an available port.
 * @param {number} options.startPort - The start of the port range to check.
 * @param {number} options.endPort - The end of the port range to check.
 * @param {string} [options.host='127.0.0.1'] - The host on which to check the port range. Defaults to '127.0.0.1'.
 * @returns {Promise<number>} The first available port found within the range.
 */
export async function findAvailablePort(options: FindAvailablePortOptions): Promise<number> {
  const { startPort, endPort, host = '127.0.0.1' } = options;
  const logger = new OrbitLogger('PORT-FINDER');

  try {
    const availablePort = await portscanner.findAPortNotInUse(startPort, endPort, host);
    logger.info(`Found available port: ${availablePort}`);
    return availablePort;
  } catch (error) {
    logger.error(`Error finding available port: ${error.message}`);
    throw error;
  }
}