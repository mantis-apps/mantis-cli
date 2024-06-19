import { execa } from 'execa';
import {
  checkPortAvailability,
  execCommand,
  findAvailablePort,
} from '../../utils/process.helper';
import { Action } from '../abstract.action';

export default class StartAction extends Action {
  private createMobileApp: boolean = false;

  constructor() {
    super('[START-ACTION]');
  }

  async execute() {
    this.logger.debug(`Started [START] Action...`);
    try {
      await execa(
        'npx',
        ['nx', 'run-many', '--target=serve', '--projects=app-web,app-mobile'],
        {
          stdout: 'inherit',
          stderr: 'inherit',
        },
      );
      this.logger.info('Workspace started!');
    } catch (error) {
      this.logger.error(
        `Error occurred during workspace start: ${error.message}`,
      );
      throw new Error(error);
    }
  }

  private installConcurrentlyPackage() {
    this.logger.info('Installing concurrently package...');
    execCommand({
      command: 'npm install --save-dev concurrently',
      useSpinner: false,
    });
  }

  private async checkPorts() {
    const webPort = Number(process.env.WebPort) || 4200;
    const mobilePort = Number(process.env.MobilePort) || 4300;
    const serverPort = Number(process.env.ServerPort) || 3000;

    const isWebPortAvailable = await checkPortAvailability({ port: webPort });
    const isMobilePortAvailable = this.createMobileApp
      ? await checkPortAvailability({ port: mobilePort })
      : true;
    const isServerPortAvailable = await checkPortAvailability({
      port: serverPort,
    });

    if (!isWebPortAvailable) {
      this.logger.warning(`Port ${webPort} (Web) is already in use`);
      process.env.WebPort = (
        await findAvailablePort({ startPort: webPort, endPort: webPort + 99 })
      ).toString();
    }
    if (!isMobilePortAvailable) {
      this.logger.warning(`Port ${mobilePort} (Mobile) is already in use`);
      process.env.MobilePort = (
        await findAvailablePort({
          startPort: mobilePort,
          endPort: mobilePort + 99,
        })
      ).toString();
    }
    if (!isServerPortAvailable) {
      this.logger.warning(`Port ${serverPort} (Server) is already in use`);
      process.env.ServerPort = (
        await findAvailablePort({
          startPort: serverPort,
          endPort: serverPort + 99,
        })
      ).toString();
    }
  }
}
