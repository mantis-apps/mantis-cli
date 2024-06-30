import { execa } from 'execa';
import { Action } from '../abstract.action';

export default class StartAction extends Action {
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
}
